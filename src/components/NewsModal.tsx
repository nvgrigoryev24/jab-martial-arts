'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { News, NewsCategory, NewsAuthor, NewsReaction, getImageUrl, stripHtmlTags, getNewsById, updateNewsReaction, transparencyToHex } from '@/lib/pocketbase';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  newsId: string | null;
  allNews: News[];
  currentNewsIndex: number;
  onNavigateToNews: (newsId: string) => void;
}

export default function NewsModal({ isOpen, onClose, newsId, allNews, currentNewsIndex, onNavigateToNews }: NewsModalProps) {
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(false);
  const [userReactions, setUserReactions] = useState<{[key: string]: string[]}>({});
  const [reactionCounts, setReactionCounts] = useState<{[reactionName: string]: number}>({});
  const processingRef = useRef<{[key: string]: boolean}>({});

  useEffect(() => {
    if (isOpen && newsId) {
      loadNews();
    }
  }, [isOpen, newsId]);

  useEffect(() => {
    if (news) {
      // Инициализируем счетчики из PocketBase
      setReactionCounts(news.reaction_counts || {});
    }
  }, [news]);

  // Блокируем прокрутку основного окна при открытом модальном окне
  useEffect(() => {
    if (isOpen) {
      // Сохраняем текущую позицию прокрутки
      const scrollY = window.scrollY;
      
      // Блокируем прокрутку
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Восстанавливаем прокрутку при закрытии
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const loadNews = async () => {
    if (!newsId) return;
    
    setLoading(true);
    try {
      const newsData = await getNewsById(newsId);
      setNews(newsData);
    } catch (error) {
      setNews(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

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

  const handleReaction = useCallback(async (reactionType: string) => {
    if (!news) return;
    
    const reactionKey = `${news.id}-${reactionType}`;
    
    // Предотвращаем двойной вызов через useRef
    if (processingRef.current[reactionKey]) {
      return;
    }
    
    processingRef.current[reactionKey] = true;
    
    // Получаем текущее состояние
    const currentReactions = userReactions[news.id] || [];
    const isActive = currentReactions.includes(reactionType);
    const currentCount = reactionCounts[reactionType] || 0;
    
    // Определяем, добавляем или убираем реакцию
    const isAdding = !isActive;
    
    // Оптимистично обновляем UI
    setUserReactions(prevUserReactions => {
      if (isActive) {
        // Убираем реакцию
        return { 
          ...prevUserReactions, 
          [news.id]: currentReactions.filter(r => r !== reactionType) 
        };
      } else {
        // Добавляем реакцию
        return { 
          ...prevUserReactions, 
          [news.id]: [...currentReactions, reactionType] 
        };
      }
    });
    
    setReactionCounts(prevCounts => {
      if (isAdding) {
        // Добавляем реакцию - увеличиваем счетчик на 1
        return {
          ...prevCounts,
          [reactionType]: currentCount + 1
        };
      } else {
        // Убираем реакцию - уменьшаем счетчик на 1, но не ниже 0
        return {
          ...prevCounts,
          [reactionType]: Math.max(0, currentCount - 1)
        };
      }
    });
    
    // Отправляем обновление в PocketBase
    try {
      await updateNewsReaction(news.id, reactionType, isAdding);
    } catch (error) {
      console.error('Ошибка при обновлении реакции в PocketBase:', error);
      
      // Откатываем изменения в случае ошибки
      setUserReactions(prevUserReactions => {
        if (isActive) {
          // Возвращаем реакцию обратно
          return { 
            ...prevUserReactions, 
            [news.id]: [...currentReactions, reactionType] 
          };
        } else {
          // Убираем реакцию обратно
          return { 
            ...prevUserReactions, 
            [news.id]: currentReactions.filter(r => r !== reactionType) 
          };
        }
      });
      
      setReactionCounts(prevCounts => {
        if (isAdding) {
          // Возвращаем счетчик обратно (уменьшаем)
          return {
            ...prevCounts,
            [reactionType]: currentCount
          };
        } else {
          // Возвращаем счетчик обратно (увеличиваем)
          return {
            ...prevCounts,
            [reactionType]: currentCount
          };
        }
      });
    }
    
    // Сбрасываем флаг через microtask
    Promise.resolve().then(() => {
      delete processingRef.current[reactionKey];
    });
  }, [news, userReactions, reactionCounts]);

  // Определяем предыдущую и следующую новость
  const hasPrevious = currentNewsIndex > 0;
  const hasNext = currentNewsIndex < allNews.length - 1;
  const previousNews = hasPrevious ? allNews[currentNewsIndex - 1] : null;
  const nextNews = hasNext ? allNews[currentNewsIndex + 1] : null;

  const handlePrevious = () => {
    if (previousNews) {
      onNavigateToNews(previousNews.id);
    }
  };

  const handleNext = () => {
    if (nextNews) {
      onNavigateToNews(nextNews.id);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm rounded-2xl border border-red-500/20 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Заголовок модального окна */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-4">
            {/* Категория */}
            {news && (() => {
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
            
            {/* Горячая новость */}
            {news?.is_hot && (
              <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider hero-jab-text animate-bounce">
                🔥 ГОРЯЧАЯ
              </span>
            )}
          </div>
          
          {/* Кнопка закрытия */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Контент модального окна */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-64 bg-white/10 rounded-xl"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-white/10 rounded w-3/4"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-6 bg-white/10 rounded w-full"></div>
                  <div className="h-6 bg-white/10 rounded w-5/6"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-white/10 rounded w-full"></div>
                  <div className="h-4 bg-white/10 rounded w-full"></div>
                  <div className="h-4 bg-white/10 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ) : news ? (
            <>
              {/* Изображение новости */}
              <div className="relative h-64 sm:h-80 overflow-hidden">
                {news.image ? (
                  <Image
                    src={getImageUrl(news, news.image)}
                    alt={news.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <span className="text-8xl">📰</span>
                  </div>
                )}
              </div>

              {/* Реакции - сразу после фото */}
              {(news.expand?.reactions && news.expand.reactions.length > 0) ? (
                <div className="px-6 py-4 border-b border-gray-700/50">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="hero-jab-text text-sm text-gray-400">Реакции:</span>
                    
                    {news.expand.reactions.map((reaction) => {
                      const count = reactionCounts[reaction.name] || 0;
                      const isActive = userReactions[news.id]?.includes(reaction.name) || false;
                      
                      return (
                        <button
                          key={reaction.id}
                          type="button"
                          onClick={() => handleReaction(reaction.name)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors duration-200 cursor-glove border ${
                            isActive 
                              ? 'bg-blue-500/20 border-blue-500/50' 
                              : 'bg-transparent border-gray-600/50 hover:bg-gray-700/30'
                          }`}
                        >
                          <span className={`text-lg transition-transform duration-200 ${
                            isActive ? 'scale-125' : ''
                          }`}>{reaction.emoji}</span>
                          {count > 0 && (
                            <span className={`hero-jab-text text-sm transition-colors ${
                              isActive ? 'text-blue-300' : 'text-gray-300'
                            }`}>{count}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                // Fallback реакции для тестирования
                <div className="px-6 py-4 border-b border-gray-700/50">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="hero-jab-text text-sm text-gray-400">Реакции:</span>
                    
                    {[
                      { emoji: '👍', name: 'like' },
                      { emoji: '❤️', name: 'love' },
                      { emoji: '🔥', name: 'fire' }
                    ].map((reaction) => {
                      const count = reactionCounts[reaction.name] || 0;
                      const isActive = userReactions[news.id]?.includes(reaction.name) || false;
                      
                      return (
                        <button
                          key={reaction.name}
                          type="button"
                          onClick={() => handleReaction(reaction.name)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors duration-200 cursor-glove border ${
                            isActive 
                              ? 'bg-blue-500/20 border-blue-500/50' 
                              : 'bg-transparent border-gray-600/50 hover:bg-gray-700/30'
                          }`}
                        >
                          <span className={`text-lg transition-transform duration-200 ${
                            isActive ? 'scale-125' : ''
                          }`}>{reaction.emoji}</span>
                          {count > 0 && (
                            <span className={`hero-jab-text text-sm transition-colors ${
                              isActive ? 'text-blue-300' : 'text-gray-300'
                            }`}>{count}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Контент новости */}
              <div className="p-6 space-y-6">
                {/* Дата и автор */}
                <div className="hero-jab-text text-sm text-gray-400">
                  {formatDate(news.published_date)} / {news.expand?.author?.name || news.author}
                </div>

                {/* Заголовок */}
                <h1 className="hero-jab-text text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {news.title}
                </h1>

                {/* Краткое описание */}
                {news.excerpt && (
                  <div className="hero-jab-text text-lg text-gray-300 leading-relaxed">
                    {stripHtmlTags(news.excerpt)}
                  </div>
                )}

                {/* Полный контент */}
                {news.content && (
                  <div className="hero-jab-text text-gray-300 leading-relaxed prose prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: news.content }} />
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-6 text-center">
              <div className="text-gray-400 hero-jab-text">
                Новость не найдена
              </div>
            </div>
          )}
        </div>

        {/* Футер модального окна */}
        {allNews.length > 1 && (
          <div className="flex items-center justify-between p-6 border-t border-gray-700/50">
            {/* Левая кнопка - Назад (предыдущая новость) или закрытие */}
            {hasPrevious ? (
              <button
                onClick={handlePrevious}
                className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-xl font-semibold transition-colors hero-jab-text cursor-glove flex items-center gap-2"
              >
                ← Назад
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-xl font-semibold transition-colors hero-jab-text cursor-glove"
              >
                Закрыть
              </button>
            )}
            
            {/* Индикатор прогресса */}
            <div className="flex items-center gap-2">
              {allNews.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentNewsIndex 
                      ? 'bg-red-500' 
                      : 'bg-gray-600'
                  }`}
                ></div>
              ))}
            </div>
            
            {/* Правая кнопка - Вперед (следующая новость) или закрытие */}
            {hasNext ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors hero-jab-text cursor-glove flex items-center gap-2"
              >
                Вперед →
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors hero-jab-text cursor-glove"
              >
                Закрыть
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
