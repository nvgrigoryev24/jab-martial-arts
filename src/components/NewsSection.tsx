'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { getNews, News, NewsCategory, NewsAuthor, NewsReaction, getImageUrl, stripHtmlTags, updateNewsReaction, transparencyToHex } from '@/lib/pocketbase';
import NewsModal from './NewsModal';
import UnderMaintenance from './UnderMaintenance';
import { useUnderMaintenance } from '@/hooks/useUnderMaintenance';

const categories = [
  { id: 'all', name: 'Все новости' },
  { id: 'Команда', name: 'Команда' },
  { id: 'События', name: 'События' },
  { id: 'Оборудование', name: 'Оборудование' },
  { id: 'Мастер-классы', name: 'Мастер-классы' }
];

export default function NewsSection() {
  const [newsData, setNewsData] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userReactions, setUserReactions] = useState<{[key: string]: string[]}>({});
  const [reactionCounts, setReactionCounts] = useState<{[key: string]: {[reactionName: string]: number}}>({});
  const processingRef = useRef<{[key: string]: boolean}>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [currentNewsIndex, setCurrentNewsIndex] = useState<number>(0);
  
  const {
    isUnderMaintenance,
    retryCount,
    canRetry,
    showMaintenance,
    hideMaintenance,
    retry
  } = useUnderMaintenance({ 
    sectionName: 'новости',
    maxRetries: 3,
    retryDelay: 2000
  });

  const loadNews = async () => {
    try {
      setLoading(true);
      const news = await getNews();
      
      if (news.length > 0) {
        setNewsData(news);
        
        // Инициализируем счетчики реакций из PocketBase
        const initialCounts: {[key: string]: {[reactionName: string]: number}} = {};
        news.forEach(newsItem => {
          initialCounts[newsItem.id] = newsItem.reaction_counts || {};
        });
        setReactionCounts(initialCounts);
        hideMaintenance();
      } else {
        showMaintenance();
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      showMaintenance();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleRetry = () => {
    retry(loadNews);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const filteredNews = selectedCategory === 'all' 
    ? newsData 
    : newsData.filter(item => {
      if (typeof item.category === 'string') {
        return item.category === selectedCategory;
      }
      return item.expand?.category?.name === selectedCategory;
    });

  const getCategoryColor = (category: NewsCategory | string) => {
    if (typeof category === 'string') {
      // Fallback для старых данных
      switch (category) {
        case 'Команда':
          return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
        case 'События':
          return 'bg-red-500/20 text-red-300 border-red-500/30';
        case 'Оборудование':
          return 'bg-green-500/20 text-green-300 border-green-500/30';
        case 'Мастер-классы':
          return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
        case 'Турниры':
          return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
        default:
          return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      }
    }
    
    // Проверяем, есть ли цвета в объекте категории (старая структура)
    if (category.color && category.bg_color && category.border_color) {
      // Используем цвета из PocketBase через inline стили (старая система без transparency)
      return {
        className: '',
        style: {
          backgroundColor: `${category.bg_color}20`,
          color: category.color,
          borderColor: `${category.border_color}30`
        }
      };
    }
    
    // Новая структура с color_theme - используем цвета из связанной темы
    if (category.expand?.color_theme) {
      const theme = category.expand.color_theme;
      
      // Конвертируем прозрачность в HEX
      const transparencyValue = theme.transparency !== undefined ? theme.transparency : 80;
      const alphaHex = transparencyToHex(transparencyValue);
      
      return {
        className: '',
        style: {
          backgroundColor: `${theme.bg_color}${alphaHex}`,
          color: theme.color,
          borderColor: `${theme.border_color}${alphaHex}`
        }
      };
    }
    
    // Fallback цвета по названию категории
    switch (category.name) {
      case 'Команда':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'События':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'Оборудование':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Мастер-классы':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Турниры':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const handleReaction = useCallback(async (newsId: string, reactionType: string) => {
    const reactionKey = `${newsId}-${reactionType}`;
    
    // Предотвращаем двойной вызов через useRef
    if (processingRef.current[reactionKey]) {
      return;
    }
    
    processingRef.current[reactionKey] = true;
    
    // Получаем текущее состояние
    const currentReactions = userReactions[newsId] || [];
    const isActive = currentReactions.includes(reactionType);
    const currentCount = reactionCounts[newsId]?.[reactionType] || 0;
    
    // Определяем, добавляем или убираем реакцию
    const isAdding = !isActive;
    
    // Оптимистично обновляем UI
    setUserReactions(prevUserReactions => {
      if (isActive) {
        // Убираем реакцию
        return { 
          ...prevUserReactions, 
          [newsId]: currentReactions.filter(r => r !== reactionType) 
        };
      } else {
        // Добавляем реакцию
        return { 
          ...prevUserReactions, 
          [newsId]: [...currentReactions, reactionType] 
        };
      }
    });
    
    setReactionCounts(prevCounts => {
      if (isAdding) {
        // Добавляем реакцию - увеличиваем счетчик на 1
        return {
          ...prevCounts,
          [newsId]: {
            ...prevCounts[newsId],
            [reactionType]: currentCount + 1
          }
        };
      } else {
        // Убираем реакцию - уменьшаем счетчик на 1, но не ниже 0
        return {
          ...prevCounts,
          [newsId]: {
            ...prevCounts[newsId],
            [reactionType]: Math.max(0, currentCount - 1)
          }
        };
      }
    });
    
    // Отправляем обновление в PocketBase
    try {
      await updateNewsReaction(newsId, reactionType, isAdding);
    } catch (error) {
      console.error('❌ Ошибка при обновлении реакции в PocketBase:', error);
      
      // Откатываем изменения в случае ошибки
      setUserReactions(prevUserReactions => {
        if (isActive) {
          // Возвращаем реакцию обратно
          return { 
            ...prevUserReactions, 
            [newsId]: [...currentReactions, reactionType] 
          };
        } else {
          // Убираем реакцию обратно
          return { 
            ...prevUserReactions, 
            [newsId]: currentReactions.filter(r => r !== reactionType) 
          };
        }
      });
      
      setReactionCounts(prevCounts => {
        if (isAdding) {
          // Возвращаем счетчик обратно (уменьшаем)
          return {
            ...prevCounts,
            [newsId]: {
              ...prevCounts[newsId],
              [reactionType]: currentCount
            }
          };
        } else {
          // Возвращаем счетчик обратно (увеличиваем)
          return {
            ...prevCounts,
            [newsId]: {
              ...prevCounts[newsId],
              [reactionType]: currentCount
            }
          };
        }
      });
    }
    
    // Сбрасываем флаг через microtask
    Promise.resolve().then(() => {
      delete processingRef.current[reactionKey];
    });
  }, [userReactions, reactionCounts]);

  const openNewsModal = (newsId: string) => {
    const newsIndex = filteredNews.findIndex(news => news.id === newsId);
    setCurrentNewsIndex(newsIndex);
    setSelectedNewsId(newsId);
    setIsModalOpen(true);
  };

  const navigateToNews = (newsId: string) => {
    const newsIndex = filteredNews.findIndex(news => news.id === newsId);
    setCurrentNewsIndex(newsIndex);
    setSelectedNewsId(newsId);
  };

  const closeNewsModal = () => {
    setIsModalOpen(false);
    setSelectedNewsId(null);
    setCurrentNewsIndex(0);
  };

  if (loading && !isUnderMaintenance) {
    return (
      <section id="news" className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="hero-jab-title text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                НОВОСТИ
              </span>
            </h2>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        </div>
      </section>
    );
  }

  if (isUnderMaintenance) {
    return (
      <section id="news" className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="hero-jab-title text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                НОВОСТИ
              </span>
            </h2>
          </div>
          <UnderMaintenance 
            sectionName="новости"
            message={`Информация о новостях временно недоступна. Попытка ${retryCount + 1} из 3.`}
            showRetry={canRetry}
            onRetry={handleRetry}
          />
        </div>
      </section>
    );
  }

  return (
    <section id="news" className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Красные и синие круги - адаптивные размеры */}
        <div className="absolute top-12 sm:top-20 left-4 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 bg-red-500/10 rounded-full animate-pulse"></div>
        <div className="absolute top-24 sm:top-40 right-8 sm:right-20 w-16 h-16 sm:w-24 sm:h-24 bg-blue-500/10 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-12 sm:bottom-20 left-1/4 w-12 h-12 sm:w-20 sm:h-20 bg-red-500/10 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-24 sm:bottom-40 right-1/3 w-16 h-16 sm:w-28 sm:h-28 bg-blue-500/10 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Заголовок секции */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="hero-jab-title text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
              НОВОСТИ
            </span>
          </h2>
          <p className="hero-jab-text text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
            Следите за последними событиями и обновлениями в мире JAB
          </p>
        </div>

        {/* Фильтры по категориям */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 px-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-full border transition-all duration-300 hero-jab-text cursor-glove text-xs sm:text-sm ${
                selectedCategory === category.id
                  ? 'bg-red-500/20 text-red-300 border-red-500/50'
                  : 'bg-transparent text-gray-300 border-gray-600/50 hover:border-red-500/30 hover:text-red-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Сетка новостей */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="block lg:hidden space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white/10 rounded-xl p-3 sm:p-4 animate-pulse">
                  <div className="flex">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 rounded mb-3 sm:mb-4"></div>
                    <div className="flex-grow ml-3 sm:ml-4">
                      <div className="h-4 bg-white/20 rounded mb-2"></div>
                      <div className="h-3 bg-white/20 rounded mb-2"></div>
                      <div className="h-3 bg-white/20 rounded mb-2"></div>
                      <div className="h-3 bg-white/20 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Мобильная версия - вертикальные карточки как в референсе */}
              <div className="block lg:hidden space-y-4">
                {filteredNews.map((news) => (
                  <article
                    key={news.id}
                    className={`group bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl border transition-all duration-500 cursor-glove overflow-hidden flex flex-col hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 ${
                      news.is_hot 
                        ? 'border-yellow-500/60 shadow-lg shadow-yellow-500/20 hover:border-yellow-500/80 hover:shadow-yellow-500/30' 
                        : 'border-gray-700/50 hover:border-blue-500/40'
                    }`}
                  >
                    {/* Изображение новости - как в референсе */}
                    <div className="relative h-48 overflow-hidden">
                      {news.image ? (
                        <Image
                          src={getImageUrl(news, news.image)}
                          alt={news.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                          <span className="text-6xl">📰</span>
                        </div>
                      )}
                      
                      {/* Категория - как в референсе */}
                      <div className="absolute top-3 left-3">
                        {(() => {
                          const colorData = getCategoryColor(news.expand?.category || news.category);
                          if (typeof colorData === 'string') {
                            return (
                              <span className={`px-2 py-1 rounded-full text-xs font-bold tracking-wider border hero-jab-text ${colorData}`}>
                                {news.expand?.category?.name || news.category}
                              </span>
                            );
                          } else {
                            return (
                              <span 
                                className={`px-2 py-1 rounded-full text-xs font-bold tracking-wider border hero-jab-text ${colorData.className}`}
                                style={colorData.style}
                              >
                                {news.expand?.category?.name || news.category}
                              </span>
                            );
                          }
                        })()}
                      </div>
                      
                      {/* Горячая новость - бейдж */}
                      {news.is_hot && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider hero-jab-text animate-bounce">
                          🔥 ГОРЯЧАЯ
                        </div>
                      )}
                    </div>

                    {/* Контент новости - как в референсе */}
                    <div className="p-4 flex flex-col flex-grow">
                      {/* Дата и автор - как в референсе */}
                      <div className="hero-jab-text text-xs text-gray-400 mb-2">
                        {formatDate(news.published_date)} / {news.expand?.author?.name || news.author}
                      </div>

                      {/* Заголовок - как в референсе */}
                      <h3 className="hero-jab-text text-base font-bold text-white mb-3 group-hover:text-red-300 transition-colors line-clamp-2">
                        {news.title}
                      </h3>

                      {/* Кнопка "Читать далее" - как в референсе */}
                      <div className="mt-auto">
                        <button
                          onClick={() => openNewsModal(news.id)}
                          className="text-red-400 hover:text-red-300 font-semibold hero-jab-text transition-colors cursor-glove text-sm flex items-center gap-1"
                        >
                          Читать далее →
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Десктопная версия - обычные карточки */}
              <div className="hidden lg:grid grid-cols-4 gap-4">
                {filteredNews.map((news) => (
                  <article
                    key={news.id}
                    className={`group bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl border transition-all duration-500 cursor-glove overflow-hidden flex flex-col h-full hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 ${
                      news.is_hot 
                        ? 'border-yellow-500/60 shadow-lg shadow-yellow-500/20 animate-pulse hover:border-yellow-500/80 hover:shadow-yellow-500/30' 
                        : 'border-gray-700/50 hover:border-blue-500/40'
                    }`}
                  >
                    {/* Изображение новости - как в референсе */}
                    <div className="relative h-48 overflow-hidden">
                      {news.image ? (
                        <Image
                          src={getImageUrl(news, news.image)}
                          alt={news.title}
                          fill
                          sizes="(max-width: 768px) 112px, (max-width: 1024px) 128px, 200px"
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                          <span className="text-6xl">📰</span>
                        </div>
                      )}
                      
                      {/* Категория - как TAG в референсе */}
                      <div className="absolute top-4 left-4">
                        {(() => {
                          const colorData = getCategoryColor(news.expand?.category || news.category);
                          if (typeof colorData === 'string') {
                            return (
                              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider border hero-jab-text ${colorData}`}>
                                {news.expand?.category?.name || news.category}
                              </span>
                            );
                          } else {
                            return (
                              <span 
                                className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider border hero-jab-text ${colorData.className}`}
                                style={colorData.style}
                              >
                                {news.expand?.category?.name || news.category}
                              </span>
                            );
                          }
                        })()}
                      </div>
                      
                      {/* Горячая новость - бейдж */}
                      {news.is_hot && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider hero-jab-text animate-bounce">
                          🔥 ГОРЯЧАЯ
                        </div>
                      )}
                    </div>

                    {/* Контент новости - как в референсе */}
                    <div className="p-4 flex flex-col flex-grow">
                      {/* Дата и автор - как DATE/AUTHOR в референсе */}
                      <div className="hero-jab-text text-xs text-gray-400 mb-2">
                        {formatDate(news.published_date)} / {news.expand?.author?.name || news.author}
                      </div>

                      {/* Заголовок - как TITLE в референсе */}
                      <h3 className="hero-jab-text text-lg font-bold text-white mb-3 group-hover:text-red-300 transition-colors line-clamp-2">
                        {news.title}
                      </h3>

                      {/* Краткое описание - как SUMMARY в референсе */}
                      <p className="hero-jab-text text-gray-300 leading-relaxed mb-4 flex-grow text-sm group-hover:text-gray-200 transition-colors line-clamp-3">
                        {stripHtmlTags(news.excerpt)}
                      </p>

                      {/* Реакции */}
                      {(news.expand?.reactions && news.expand.reactions.length > 0) ? (
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {news.expand.reactions.map((reaction) => {
                            const count = reactionCounts[news.id]?.[reaction.name] || 0;
                            const isActive = userReactions[news.id]?.includes(reaction.name) || false;
                            
                            return (
                              <button
                                key={reaction.id}
                                type="button"
                                onClick={() => handleReaction(news.id, reaction.name)}
                                className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors duration-200 cursor-glove border ${
                                  isActive 
                                    ? 'bg-blue-500/20 border-blue-500/50' 
                                    : 'bg-transparent border-transparent hover:bg-gray-700/30'
                                }`}
                              >
                                <span className={`text-sm transition-transform duration-200 ${
                                  isActive ? 'scale-125' : ''
                                }`}>{reaction.emoji}</span>
                                {count > 0 && (
                                  <span className={`hero-jab-text text-xs transition-colors ${
                                    isActive ? 'text-blue-300' : 'text-gray-300'
                                  }`}>{count}</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        // Fallback реакции для тестирования
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {[
                            { emoji: '👍', name: 'like' },
                            { emoji: '❤️', name: 'love' },
                            { emoji: '🔥', name: 'fire' }
                          ].map((reaction) => {
                            const count = reactionCounts[news.id]?.[reaction.name] || 0;
                            const isActive = userReactions[news.id]?.includes(reaction.name) || false;
                            
                            return (
                              <button
                                key={reaction.name}
                                type="button"
                                onClick={() => handleReaction(news.id, reaction.name)}
                                className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors duration-200 cursor-glove border ${
                                  isActive 
                                    ? 'bg-blue-500/20 border-blue-500/50' 
                                    : 'bg-transparent border-transparent hover:bg-gray-700/30'
                                }`}
                              >
                                <span className={`text-sm transition-transform duration-200 ${
                                  isActive ? 'scale-125' : ''
                                }`}>{reaction.emoji}</span>
                                {count > 0 && (
                                  <span className={`hero-jab-text text-xs transition-colors ${
                                    isActive ? 'text-blue-300' : 'text-gray-300'
                                  }`}>{count}</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Кнопка "Читать далее" - как READ MORE в референсе */}
                      <div className="mt-auto">
                        <button
                          onClick={() => openNewsModal(news.id)}
                          className="text-red-400 hover:text-red-300 font-semibold hero-jab-text transition-colors cursor-glove text-sm flex items-center gap-1"
                        >
                          Читать далее →
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Кнопка "Все новости" */}
        <div className="text-center mt-8 sm:mt-12">
          <button className="bg-red-500 hover:bg-red-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 hero-jab-text cursor-glove text-sm sm:text-base w-full sm:w-auto">
            Все новости
          </button>
        </div>
      </div>

      {/* Модальное окно для новостей */}
      <NewsModal 
        isOpen={isModalOpen}
        onClose={closeNewsModal}
        newsId={selectedNewsId}
        allNews={filteredNews}
        currentNewsIndex={currentNewsIndex}
        onNavigateToNews={navigateToNews}
      />
    </section>
  );
}
