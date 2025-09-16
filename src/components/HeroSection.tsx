'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getHeroContent, HeroContent, getImageUrl } from '@/lib/pocketbase';
import UnderMaintenance from './UnderMaintenance';
import { useUnderMaintenance } from '@/hooks/useUnderMaintenance';

export default function HeroSection() {
  const [isRevealed, setIsRevealed] = useState(true); // Сразу показываем без анимации
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  
  const {
    isUnderMaintenance,
    retryCount,
    canRetry,
    showMaintenance,
    hideMaintenance,
    retry
  } = useUnderMaintenance({ 
    sectionName: 'главная секция',
    maxRetries: 3,
    retryDelay: 2000
  });

  const loadHeroContent = async () => {
    try {
      setLoading(true);
      const content = await getHeroContent();
      
      if (content) {
        setHeroContent(content);
        hideMaintenance();
      } else {
        showMaintenance();
      }
    } catch (error) {
      console.error('Ошибка загрузки Hero контента:', error);
      showMaintenance();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHeroContent();
  }, []);

  const handleRetry = () => {
    retry(loadHeroContent);
  };
  
  const imageAlt = heroContent?.image_alt || 'Тренировочный зал JAB';
  // Правильно формируем URL изображения
  const imageUrl = heroContent?.image_url 
    ? heroContent.image_url.startsWith('http') 
      ? heroContent.image_url 
      : getImageUrl(heroContent, heroContent.image_url)
    : null;

  if (loading && !isUnderMaintenance) {
    return (
      <section id="hero" className="relative min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Загрузка...</p>
        </div>
      </section>
    );
  }

  if (isUnderMaintenance) {
    return (
      <section id="hero" className="relative min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <UnderMaintenance 
            sectionName="главная секция"
            message={`Главная секция временно недоступна. Попытка ${retryCount + 1} из 3.`}
            showRetry={canRetry}
            onRetry={handleRetry}
          />
        </div>
      </section>
    );
  }

  return (
    <section id="hero" className={`relative min-h-screen flex items-center overflow-hidden pt-16 sm:pt-20 pb-24 sm:pb-32 ${isRevealed ? 'reveal-on' : 'reveal-prep'}`}>
      {/* Динамические элементы фона */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Красные и синие акценты как в боксе - адаптивные размеры */}
        <div className="absolute top-16 sm:top-20 left-4 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-16 sm:bottom-20 right-4 sm:right-10 w-24 h-24 sm:w-40 sm:h-40 bg-blue-500/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 sm:w-24 sm:h-24 bg-red-600/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
        
        {/* Белые линии движения - адаптивные позиции */}
        <div className="absolute top-24 sm:top-32 left-12 sm:left-20 w-8 h-0.5 sm:w-16 sm:h-0.5 bg-white/20 transform rotate-45"></div>
        <div className="absolute top-32 sm:top-40 left-8 sm:left-16 w-6 h-0.5 sm:w-12 sm:h-0.5 bg-white/20 transform rotate-45"></div>
        <div className="absolute bottom-24 sm:bottom-32 right-12 sm:right-20 w-10 h-0.5 sm:w-20 sm:h-0.5 bg-white/20 transform -rotate-45"></div>
        <div className="absolute bottom-32 sm:bottom-40 right-8 sm:right-16 w-7 h-0.5 sm:w-14 sm:h-0.5 bg-white/20 transform -rotate-45"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 py-12 sm:py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center" data-reveal-container>
        {/* Левая колонка - контент */}
        <div className="space-y-4 sm:space-y-6 text-center md:text-left order-1 md:order-1">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 justify-center md:justify-start" data-reveal>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="hero-jab-eyebrow inline-block rounded-full border border-red-500/30 bg-red-500/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-red-400 backdrop-blur-sm">
              {heroContent?.eyebrow_text || 'БОКС И КИКБОКСИНГ'}
            </span>
          </div>
          
          {/* Заголовок */}
          <h1 className="hero-jab-title text-3xl sm:text-4xl md:text-5xl lg:text-7xl tracking-tight text-white leading-tight" data-reveal>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
              {heroContent?.title || 'ШКОЛА ЕДИНОБОРСТВ JAB'}
            </span>
          </h1>
          
          {/* Описание */}
          <p className="hero-jab-text text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl mx-auto md:mx-0" data-reveal>
            {heroContent?.description || 'Группы по уровню. Первая тренировка - бесплатно'}
          </p>
          
          {/* Кнопка */}
          <div className="pt-2 sm:pt-4" data-reveal>
            <Link
              href={heroContent?.cta_link || '#contact'}
              className="relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hero-jab-text text-center cursor-glove bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-red-500/25 hover:from-red-700 hover:to-red-800 inline-block w-full sm:w-auto"
            >
              <span className="relative z-10">{heroContent?.cta_text || 'Записаться'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
          
          {/* Дополнительные элементы */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 pt-6 sm:pt-8" data-reveal>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-ping"></div>
              <span className="hero-jab-text text-gray-400 text-xs sm:text-sm text-center md:text-left">{heroContent?.feature_1_text || 'Первая тренировка бесплатно'}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-ping" style={{animationDelay: '0.3s'}}></div>
              <span className="hero-jab-text text-gray-400 text-xs sm:text-sm text-center md:text-left">{heroContent?.feature_2_text || 'Группы по уровню'}</span>
            </div>
          </div>
        </div>

        {/* Правая колонка - изображение */}
        <div className="relative order-2 md:order-last" data-reveal>
          <div className="relative group">
            <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl cursor-glove transition-all duration-500 group-hover:shadow-red-500/20 group-hover:shadow-3xl group-hover:scale-105 group-hover:border-red-500/40" style={{ aspectRatio: "16 / 10" }}>
              {imageUrl ? (
                // Показываем изображение если оно есть
                <img 
                  src={imageUrl} 
                  alt={imageAlt}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 group-hover:contrast-105"
                />
              ) : (
                // Показываем плейсхолдер если изображения нет
                <div className="absolute inset-0 flex items-center justify-center transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-red-900/20 group-hover:to-blue-900/20">
                  <div className="text-center transition-all duration-500 group-hover:scale-110">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-3 sm:mb-4 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse transition-all duration-500 group-hover:bg-red-500/40 group-hover:shadow-lg group-hover:shadow-red-500/50">
                      <span className="text-3xl sm:text-4xl md:text-6xl transition-all duration-500 group-hover:scale-110">🥊</span>
                    </div>
                    <p className="hero-jab-text text-gray-400 text-sm sm:text-base md:text-lg transition-all duration-500 group-hover:text-white">ТРЕНИРОВОЧНЫЙ ЗАЛ</p>
                    <p className="hero-jab-text text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2 transition-all duration-500 group-hover:text-gray-300">Современное оборудование</p>
                  </div>
                </div>
              )}
              
              {/* Декоративные элементы - красный и синий углы */}
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-4 h-4 sm:w-6 sm:h-6 bg-red-500 rounded-full animate-bounce transition-all duration-500 group-hover:scale-125 group-hover:shadow-lg group-hover:shadow-red-500/50"></div>
              <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full animate-bounce transition-all duration-500 group-hover:scale-125 group-hover:shadow-lg group-hover:shadow-blue-500/50" style={{animationDelay: '0.3s'}}></div>
              
              {/* Рамка с анимацией */}
              <div className="absolute inset-0 rounded-2xl border-2 border-red-500/30 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Дополнительный эффект свечения при hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/0 via-transparent to-blue-500/0 opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>
              
              {/* Эффект частиц при hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-400 rounded-full animate-ping" style={{animationDelay: '0.1s'}}></div>
                <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '0.3s'}}></div>
                <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-red-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 bg-blue-300 rounded-full animate-ping" style={{animationDelay: '0.7s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Современные боксерские канаты - адаптивные */}
      <div className="absolute bottom-12 sm:bottom-16 left-0 right-0 h-1.5 sm:h-2 z-0">
        {/* Белый канат */}
        <div className="w-full h-full bg-gradient-to-b from-gray-200 via-white to-gray-200 rounded-sm shadow-sm"></div>
        {/* Световая анимация поверх каната */}
        <div className="absolute inset-0 w-full h-full animate-led-strip rounded-sm"></div>
      </div>
      <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 h-1.5 sm:h-2 z-0">
        {/* Белый канат */}
        <div className="w-full h-full bg-gradient-to-b from-gray-200 via-white to-gray-200 rounded-sm shadow-sm"></div>
        {/* Световая анимация поверх каната */}
        <div className="absolute inset-0 w-full h-full animate-led-strip rounded-sm"></div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1.5 sm:h-2 z-0">
        {/* Белый канат */}
        <div className="w-full h-full bg-gradient-to-b from-gray-200 via-white to-gray-200 rounded-sm shadow-sm"></div>
        {/* Световая анимация поверх каната */}
        <div className="absolute inset-0 w-full h-full animate-led-strip rounded-sm"></div>
      </div>
      
      {/* Перемычки между канатами с надписью JAB - адаптивные */}
      <div className="absolute bottom-0 left-1/4 w-4 sm:w-6 h-12 sm:h-16 md:h-20 z-10">
        <div className="w-full h-full bg-red-500 rounded-sm shadow-md flex items-center justify-center">
          <span className="text-white font-bold text-xs sm:text-sm tracking-wider transform -rotate-90" style={{textShadow: '1px 1px 0px rgba(0,0,0,0.3), -1px -1px 0px rgba(0,0,0,0.3), 1px -1px 0px rgba(0,0,0,0.3), -1px 1px 0px rgba(0,0,0,0.3)'}}>JAB</span>
        </div>
      </div>
      <div className="absolute bottom-0 right-1/4 w-4 sm:w-6 h-12 sm:h-16 md:h-20 z-10">
        <div className="w-full h-full bg-blue-500 rounded-sm shadow-md flex items-center justify-center">
          <span className="text-white font-bold text-xs sm:text-sm tracking-wider transform -rotate-90" style={{textShadow: '1px 1px 0px rgba(0,0,0,0.3), -1px -1px 0px rgba(0,0,0,0.3), 1px -1px 0px rgba(0,0,0,0.3), -1px 1px 0px rgba(0,0,0,0.3)'}}>JAB</span>
        </div>
      </div>
      
      {/* Нижняя граница с градиентом */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
    </section>
  );
}
