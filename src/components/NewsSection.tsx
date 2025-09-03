'use client';

import { useState } from 'react';
import Image from 'next/image';

const newsData = [
  {
    id: '1',
    title: 'Новый тренер в команде JAB',
    excerpt: 'Мы рады представить нашего нового тренера по боксу с 10-летним опытом работы в профессиональном спорте.',
    content: 'Александр Петров присоединился к нашей команде тренеров. Он имеет звание мастера спорта по боксу и многолетний опыт подготовки спортсменов различного уровня.',
    image: 'https://picsum.photos/400/250?random=1',
    date: '2024-01-15',
    category: 'Команда',
    author: 'Администрация JAB',
    isHot: true,
    reactions: {
      like: 24,
      love: 8,
      fire: 15,
      clap: 12
    }
  },
  {
    id: '2',
    title: 'Турнир по боксу среди любителей',
    excerpt: 'Приглашаем всех желающих принять участие в нашем внутреннем турнире по боксу.',
    content: 'Турнир пройдет 25 января в нашем зале. Участие бесплатное для всех членов клуба. Призы и награды для победителей!',
    image: 'https://picsum.photos/400/250?random=2',
    date: '2024-01-10',
    category: 'События',
    author: 'Организаторы',
    isHot: false,
    reactions: {
      like: 18,
      love: 5,
      fire: 8,
      clap: 6
    }
  },
  {
    id: '3',
    title: 'Новое оборудование в зале',
    excerpt: 'Мы обновили оборудование в нашем зале для еще более эффективных тренировок.',
    content: 'Установлены новые боксерские мешки, обновлена ринговая площадка и добавлено современное кардио-оборудование.',
    image: 'https://picsum.photos/400/250?random=3',
    date: '2024-01-05',
    category: 'Оборудование',
    author: 'Техническая служба',
    isHot: false,
    reactions: {
      like: 12,
      love: 3,
      fire: 4,
      clap: 7
    }
  },
  {
    id: '4',
    title: 'Мастер-класс от чемпиона',
    excerpt: 'Приглашаем на мастер-класс от действующего чемпиона России по боксу.',
    content: 'Уникальная возможность получить советы от профессионала высшего уровня. Мастер-класс состоится 30 января.',
    image: 'https://picsum.photos/400/250?random=4',
    date: '2024-01-08',
    category: 'Мастер-классы',
    author: 'Пресс-служба',
    isHot: false,
    reactions: {
      like: 31,
      love: 12,
      fire: 22,
      clap: 15
    }
  }
];

const categories = [
  { id: 'all', name: 'Все новости' },
  { id: 'Команда', name: 'Команда' },
  { id: 'События', name: 'События' },
  { id: 'Оборудование', name: 'Оборудование' },
  { id: 'Мастер-классы', name: 'Мастер-классы' }
];

export default function NewsSection() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNews, setSelectedNews] = useState<string | null>(null);
  const [userReactions, setUserReactions] = useState<{[key: string]: string}>({});

  const filteredNews = selectedCategory === 'all' 
    ? newsData 
    : newsData.filter(item => item.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Команда':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'События':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'Оборудование':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Мастер-классы':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
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

  const handleReaction = (newsId: string, reactionType: string) => {
    setUserReactions(prev => {
      const currentReaction = prev[newsId];
      if (currentReaction === reactionType) {
        // Если кликнули на ту же реакцию, убираем её
        const newReactions = { ...prev };
        delete newReactions[newsId];
        return newReactions;
      } else {
        // Если кликнули на другую реакцию, заменяем
        return { ...prev, [newsId]: reactionType };
      }
    });
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Красные и синие круги */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-red-500/10 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-blue-500/10 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        
        {/* Белые линии */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Заголовок секции */}
        <div className="text-center mb-16">
          <h2 className="hero-jab-title text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
              НОВОСТИ
            </span>
          </h2>
          <p className="hero-jab-text text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Следите за последними событиями и обновлениями в мире JAB
          </p>
        </div>

        {/* Фильтры по категориям */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full border transition-all duration-300 hero-jab-text cursor-glove ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredNews.map((news) => (
            <article
              key={news.id}
              className={`group bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl border transition-all duration-300 cursor-glove overflow-hidden flex flex-col h-full ${
                news.isHot 
                  ? 'border-yellow-500/60 shadow-lg shadow-yellow-500/20 animate-pulse' 
                  : 'border-gray-700/50 hover:border-red-500/40'
              }`}
            >
              {/* Изображение новости */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={news.image}
                  alt={news.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border hero-jab-text ${getCategoryColor(news.category)}`}>
                    {news.category}
                  </span>
                </div>
                {/* Горячая новость - бейдж */}
                {news.isHot && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider hero-jab-text animate-bounce">
                    🔥 ГОРЯЧАЯ
                  </div>
                )}
              </div>

              {/* Контент новости */}
              <div className="p-6 flex flex-col h-full">
                {/* Дата и автор */}
                <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                  <span className="hero-jab-text">{formatDate(news.date)}</span>
                  <span className="hero-jab-text">{news.author}</span>
                </div>

                {/* Заголовок */}
                <h3 className="hero-jab-text text-xl font-bold text-white mb-3 group-hover:text-red-300 transition-colors">
                  {news.title}
                </h3>

                {/* Краткое описание */}
                <p className="hero-jab-text text-gray-300 leading-relaxed mb-4 flex-grow">
                  {news.excerpt}
                </p>

                {/* Реакции для всех новостей */}
                {news.reactions && (
                  <div className="flex items-center gap-4 mb-4">
                    <button
                      onClick={() => handleReaction(news.id, 'like')}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors duration-200 cursor-glove min-w-[60px] border ${
                        userReactions[news.id] === 'like' 
                          ? 'bg-blue-500/20 border-blue-500/50' 
                          : 'bg-transparent border-transparent hover:bg-gray-700/30'
                      }`}
                    >
                      <span className={`text-lg transition-transform duration-200 ${
                        userReactions[news.id] === 'like' ? 'scale-125' : ''
                      }`}>👍</span>
                      <span className={`hero-jab-text text-sm transition-colors ${
                        userReactions[news.id] === 'like' ? 'text-blue-300' : 'text-gray-300'
                      }`}>{news.reactions.like}</span>
                    </button>
                    
                    <button
                      onClick={() => handleReaction(news.id, 'love')}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors duration-200 cursor-glove min-w-[60px] border ${
                        userReactions[news.id] === 'love' 
                          ? 'bg-red-500/20 border-red-500/50' 
                          : 'bg-transparent border-transparent hover:bg-gray-700/30'
                      }`}
                    >
                      <span className={`text-lg transition-transform duration-200 ${
                        userReactions[news.id] === 'love' ? 'scale-125' : ''
                      }`}>❤️</span>
                      <span className={`hero-jab-text text-sm transition-colors ${
                        userReactions[news.id] === 'love' ? 'text-red-300' : 'text-gray-300'
                      }`}>{news.reactions.love}</span>
                    </button>
                    
                    <button
                      onClick={() => handleReaction(news.id, 'fire')}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors duration-200 cursor-glove min-w-[60px] border ${
                        userReactions[news.id] === 'fire' 
                          ? 'bg-orange-500/20 border-orange-500/50' 
                          : 'bg-transparent border-transparent hover:bg-gray-700/30'
                      }`}
                    >
                      <span className={`text-lg transition-transform duration-200 ${
                        userReactions[news.id] === 'fire' ? 'scale-125' : ''
                      }`}>🔥</span>
                      <span className={`hero-jab-text text-sm transition-colors ${
                        userReactions[news.id] === 'fire' ? 'text-orange-300' : 'text-gray-300'
                      }`}>{news.reactions.fire}</span>
                    </button>
                    
                    <button
                      onClick={() => handleReaction(news.id, 'clap')}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors duration-200 cursor-glove min-w-[60px] border ${
                        userReactions[news.id] === 'clap' 
                          ? 'bg-yellow-500/20 border-yellow-500/50' 
                          : 'bg-transparent border-transparent hover:bg-gray-700/30'
                      }`}
                    >
                      <span className={`text-lg transition-transform duration-200 ${
                        userReactions[news.id] === 'clap' ? 'scale-125' : ''
                      }`}>👏</span>
                      <span className={`hero-jab-text text-sm transition-colors ${
                        userReactions[news.id] === 'clap' ? 'text-yellow-300' : 'text-gray-300'
                      }`}>{news.reactions.clap}</span>
                    </button>
                  </div>
                )}

                {/* Кнопка "Читать далее" */}
                <div className="mt-auto">
                  <button
                    onClick={() => setSelectedNews(selectedNews === news.id ? null : news.id)}
                    className="text-red-400 hover:text-red-300 font-semibold hero-jab-text transition-colors cursor-glove"
                  >
                    {selectedNews === news.id ? 'Скрыть' : 'Читать далее'} →
                  </button>
                </div>

                {/* Полный текст (раскрывается при клике) */}
                {selectedNews === news.id && (
                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <p className="hero-jab-text text-gray-300 leading-relaxed">
                      {news.content}
                    </p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Кнопка "Все новости" */}
        <div className="text-center mt-12">
          <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 hero-jab-text cursor-glove">
            Все новости
          </button>
        </div>
      </div>
    </section>
  );
}
