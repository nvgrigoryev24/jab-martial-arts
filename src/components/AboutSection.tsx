'use client';

import { useEffect, useState } from 'react';
import { getAboutPage, getAboutCards, AboutPage, AboutCard, getImageUrl, getColorThemeStyles, sanitizeHtmlForDisplay } from '@/lib/pocketbase';
import UnderMaintenance from './UnderMaintenance';
import { useUnderMaintenance } from '@/hooks/useUnderMaintenance';

export default function AboutSection() {
  const [aboutPage, setAboutPage] = useState<AboutPage | null>(null);
  const [aboutCards, setAboutCards] = useState<AboutCard[]>([]);
  const [loading, setLoading] = useState(true);
  
  const {
    isUnderMaintenance,
    retryCount,
    canRetry,
    showMaintenance,
    hideMaintenance,
    retry
  } = useUnderMaintenance({ 
    sectionName: 'о школе',
    maxRetries: 3,
    retryDelay: 2000
  });

  const loadAboutData = async () => {
    try {
      setLoading(true);
      const [pageData, cardsData] = await Promise.all([
        getAboutPage(),
        getAboutCards()
      ]);
      
      if (pageData && cardsData.length > 0) {
        setAboutPage(pageData);
        setAboutCards(cardsData);
        hideMaintenance();
      } else {
        showMaintenance();
      }
    } catch (error) {
      console.error('Ошибка загрузки данных About секции:', error);
      showMaintenance();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAboutData();
  }, []);

  const handleRetry = () => {
    retry(loadAboutData);
  };

  if (loading && !isUnderMaintenance) {
    return (
      <section id="about" className="relative py-12 sm:py-16 md:py-20 text-white overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Загрузка...</p>
          </div>
        </div>
      </section>
    );
  }

  if (isUnderMaintenance) {
    return (
      <section id="about" className="relative py-12 sm:py-16 md:py-20 text-white overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <div className="text-center mb-16">
              <h2 className="hero-jab-title text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                  О ШКОЛЕ JAB
                </span>
              </h2>
            </div>
            <UnderMaintenance 
              sectionName="о школе"
              message={`Информация о школе временно недоступна. Попытка ${retryCount + 1} из 3.`}
              showRetry={canRetry}
              onRetry={handleRetry}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="relative py-12 sm:py-16 md:py-20 text-white overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Красные и синие акценты - адаптивные размеры */}
        <div className="absolute top-6 sm:top-10 right-8 sm:right-20 w-16 h-16 sm:w-24 sm:h-24 bg-red-600/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-6 sm:bottom-10 left-8 sm:left-20 w-20 h-20 sm:w-28 sm:h-28 bg-blue-500/12 rounded-full blur-2xl animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/3 right-1/4 sm:right-1/3 w-12 h-12 sm:w-20 sm:h-20 bg-red-600/08 rounded-full blur-xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
        
        {/* Белые линии движения - адаптивные позиции */}
        <div className="absolute top-12 sm:top-16 right-16 sm:right-32 w-6 h-0.5 sm:w-12 sm:h-0.5 bg-white/15 transform rotate-45"></div>
        <div className="absolute bottom-12 sm:bottom-16 left-16 sm:left-32 w-8 h-0.5 sm:w-16 sm:h-0.5 bg-white/15 transform -rotate-45"></div>
        <div className="absolute top-1/2 left-4 sm:left-10 w-4 h-0.5 sm:w-8 sm:h-0.5 bg-white/10 transform rotate-45"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Заголовок секции */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="hero-jab-title text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                {aboutPage?.section_title || 'О ШКОЛЕ JAB'}
              </span>
            </h2>
            <p className="hero-jab-text text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
              {aboutPage?.section_subtitle || 'МЫ СОЗДАЕМ ПРОСТРАНСТВО, ГДЕ КАЖДЫЙ МОЖЕТ РАСКРЫТЬ СВОЙ ПОТЕНЦИАЛ И ДОСТИЧЬ НОВЫХ ВЫСОТ В ЕДИНОБОРСТВАХ'}
            </p>
          </div>

          {/* Динамические карточки преимуществ */}
          {aboutCards.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16">
              {aboutCards.map((card, index) => {
                // Формируем URL фонового изображения
                const backgroundImageUrl = card.background_image 
                  ? getImageUrl(card, card.background_image)
                  : null;

                return (
                  <div 
                    key={card.id}
                    className={`group relative rounded-2xl p-4 sm:p-6 md:p-8 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl cursor-glove flex flex-col h-full overflow-hidden ${
                      backgroundImageUrl 
                        ? 'before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-black/70 before:via-black/50 before:to-black/60 before:z-10 after:absolute after:inset-0 after:rounded-2xl after:border-2 after:border-red-500/30 hover:after:border-red-500/60 after:pointer-events-none after:z-5' 
                        : 'bg-gradient-to-br from-gray-900/50 to-black/50 after:absolute after:inset-0 after:rounded-2xl after:border-2 after:border-red-500/30 hover:after:border-red-500/60 after:pointer-events-none after:z-5'
                    }`}
                    style={{
                      backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      boxSizing: 'border-box'
                    } as React.CSSProperties}
                  >
                    {/* Hover эффект - легкое свечение */}
                    <div 
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/10 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" 
                      style={{
                        boxSizing: 'border-box'
                      }}
                    ></div>
                    
                    <div className="relative z-30 flex flex-col h-full">
                      {/* Фиксированная высота для иконки */}
                      <div className="h-12 sm:h-14 md:h-16 flex items-center mb-6 sm:mb-8 md:mb-10 group-hover:animate-pulse">
                        <span className="text-3xl sm:text-4xl md:text-5xl">{card.icon}</span>
                      </div>
                      
                      {/* Фиксированная высота для заголовка */}
                      <div className="h-12 sm:h-14 md:h-16 flex items-center mb-1 sm:mb-2">
                        <h3 className="hero-jab-text text-lg sm:text-xl md:text-2xl font-bold text-white group-hover:text-red-200 transition-colors drop-shadow-lg">
                          {card.title}
                        </h3>
                      </div>

                      {/* Гибкая область для описания */}
                      <div className="flex-grow mb-4 sm:mb-6">
                        <div
                          className="hero-jab-text text-gray-100 leading-relaxed text-sm sm:text-base drop-shadow-md"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtmlForDisplay(card.description)
                          }}
                        />
                      </div>

                      {/* Фиксированная высота для ссылки */}
                      <div className="h-6 sm:h-8 flex items-center">
                        <div className="flex items-center text-red-400 group-hover:text-red-300 transition-colors">
                          <span className="hero-jab-text text-xs sm:text-sm font-semibold">Узнать больше</span>
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Дополнительная информация */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-6 py-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="hero-jab-text text-red-400 font-semibold">
                {aboutPage?.bottom_banner_text || 'ПЕРВАЯ ТРЕНИРОВКА БЕСПЛАТНО'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
