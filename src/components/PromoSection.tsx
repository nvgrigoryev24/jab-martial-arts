'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { getPromoSection, PromoSection as PromoSectionType, getImageUrl } from '@/lib/pocketbase';

export default function PromoSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [promoData, setPromoData] = useState<PromoSectionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileCardOpen, setIsMobileCardOpen] = useState(false);
  const [isPeeking, setIsPeeking] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Загрузка данных промо секции из PocketBase
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchPromoSection = async () => {
      try {
        const promo = await getPromoSection(abortController.signal);
        setPromoData(promo);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching promo section:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPromoSection();

    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Запускаем анимацию "подглядывания" только на мобильных
          if (window.innerWidth < 640) {
            setIsPeeking(true);
            // Останавливаем анимацию через 3 секунды
            setTimeout(() => {
              setIsPeeking(false);
            }, 3000);
          }
        }
      },
      {
        threshold: 0.3 // 30% viewport - более мягкое условие для мобильных
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Показываем индикатор загрузки
  if (loading) {
    return (
      <section ref={sectionRef} id="promo" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Загрузка...</p>
        </div>
      </section>
    );
  }

  // Если нет данных из PocketBase, используем дефолтные значения
  const sectionData = promoData || {
    title: "Бесплатный спорт для детей",
    subtitle: "<p>Дайте своему ребенку возможность заниматься спортом <strong>бесплатно</strong>.</p><p>Мы предоставляем качественные тренировки по боксу и кикбоксингу для детей от 6 лет.</p>",
    contact_button_text: "Связаться с нами",
    contact_button_link: "#contact",
    support_button_text: "Поддержать",
    support_button_link: "#support",
    background_image: null,
    background_image_mobile: null,
    overlay_opacity: 40,
    card_position: "left",
    card_width: "narrow"
  };

  // Очистка HTML entities для корректного отображения
  const cleanSubtitle = sectionData.subtitle
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

  // Функция для определения классов ширины карточки
  const getCardWidthClasses = (width: string) => {
    switch (width) {
      case 'narrow':
        return 'max-w-md lg:max-w-lg';
      case 'medium':
        return 'max-w-lg lg:max-w-xl';
      case 'wide':
        return 'max-w-xl lg:max-w-2xl';
      default:
        return 'max-w-md lg:max-w-lg';
    }
  };

  // Функция для определения классов позиции карточки
  const getCardPositionClasses = (position: string) => {
    switch (position) {
      case 'left':
        return 'lg:justify-start';
      case 'center':
        return 'lg:justify-center';
      case 'right':
        return 'lg:justify-end';
      default:
        return 'lg:justify-start';
    }
  };

  // Функция для переключения мобильной карточки
  const toggleMobileCard = () => {
    setIsMobileCardOpen(!isMobileCardOpen);
  };

  // Формируем URL фоновых изображений
  const backgroundImageUrl = sectionData.background_image && promoData 
    ? getImageUrl(promoData, sectionData.background_image)
    : "/childsport.jpg"; // Временное изображение из public для десктопа
  
  const backgroundImageUrlMobile = sectionData.background_image_mobile && promoData 
    ? getImageUrl(promoData, sectionData.background_image_mobile)
    : "/childsportMob.jpg"; // Временное изображение из public для мобильных

  return (
    <section 
      ref={sectionRef} 
      id="promo" 
      className={`relative flex items-center justify-center overflow-hidden w-full ${isVisible ? 'reveal-on' : 'reveal-prep'}`}
      style={{ minHeight: '100vh', width: '100%' }}
    >
      {/* Фоновое изображение */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ height: '100vh' }}
      >
        {/* Изображение для десктопа */}
        <Image
          src={backgroundImageUrl}
          alt="Дети занимаются спортом"
          width={1920}
          height={1080}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
          className="object-cover hidden sm:block w-full h-full"
          priority
          quality={90}
        />
        {/* Изображение для мобильных */}
        <Image
          src={backgroundImageUrlMobile}
          alt="Дети занимаются спортом"
          width={640}
          height={1136}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
          className="object-cover block sm:hidden w-full h-full"
          priority
          quality={90}
        />
        {/* Темный оверлей для читаемости текста */}
        <div 
          className="absolute inset-0 bg-black" 
          style={{ opacity: sectionData.overlay_opacity / 100 }}
        ></div>
      </div>


      {/* Декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Красные и синие акценты - адаптивные размеры */}
        <div className="absolute top-8 sm:top-16 left-8 sm:left-16 w-12 h-12 sm:w-20 sm:h-20 bg-red-600/15 rounded-full blur-xl animate-pulse" style={{animationDelay: '2.5s'}}></div>
        <div className="absolute bottom-8 sm:bottom-16 right-8 sm:right-16 w-16 h-16 sm:w-24 sm:h-24 bg-blue-500/12 rounded-full blur-xl animate-pulse" style={{animationDelay: '3.5s'}}></div>
        <div className="absolute top-1/4 left-1/4 sm:left-1/3 w-10 h-10 sm:w-16 sm:h-16 bg-red-600/10 rounded-full blur-lg animate-pulse" style={{animationDelay: '1.8s'}}></div>
        
        {/* Белые линии движения - адаптивные позиции */}
        <div className="absolute top-16 sm:top-24 left-12 sm:left-20 w-6 h-0.5 sm:w-12 sm:h-0.5 bg-white/20 transform rotate-45 animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-20 sm:top-28 left-8 sm:left-16 w-4 h-0.5 sm:w-8 sm:h-0.5 bg-white/20 transform rotate-45 animate-pulse" style={{animationDelay: '1.2s'}}></div>
        <div className="absolute bottom-16 sm:bottom-24 right-12 sm:right-20 w-8 h-0.5 sm:w-16 sm:h-0.5 bg-white/20 transform -rotate-45 animate-pulse" style={{animationDelay: '2.8s'}}></div>
        <div className="absolute bottom-20 sm:bottom-28 right-8 sm:right-16 w-5 h-0.5 sm:w-10 sm:h-0.5 bg-white/20 transform -rotate-45 animate-pulse" style={{animationDelay: '3.2s'}}></div>
      </div>

      {/* Контент */}
      <div className="w-full relative z-10 h-full">
        <div className="w-full h-full">
          <div className={`flex items-end lg:items-center py-12 pb-0 ${getCardPositionClasses(sectionData.card_position)}`} style={{ minHeight: '100vh' }}>
            {/* Динамическая карточка с текстом - скрыта на мобильных по умолчанию */}
            <div className={`w-full px-4 ${getCardWidthClasses(sectionData.card_width)} ${isVisible ? 'animate-fade-in-up' : 'opacity-0'} hidden sm:block`}>
              <div className="bg-black/30 sm:bg-black/40 lg:bg-black/50 rounded-2xl p-6 sm:p-8 lg:p-10 border border-red-500/20 shadow-2xl">
                {/* Заголовок */}
                <div className="mb-8">
                  <h2 className="hero-jab-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 drop-shadow-lg sm:drop-shadow-none">{sectionData.title}</span>
                  </h2>
                </div>

                {/* Подзаголовок */}
                <div className={`mb-10 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
                  <div 
                    className="hero-jab-text text-lg sm:text-xl text-white sm:text-gray-200 leading-relaxed prose prose-invert max-w-none drop-shadow-lg sm:drop-shadow-none"
                    dangerouslySetInnerHTML={{ __html: cleanSubtitle }}
                    style={{
                      '--tw-prose-body': '#ffffff',
                      '--tw-prose-headings': '#ffffff',
                      '--tw-prose-links': '#ef4444',
                      '--tw-prose-bold': '#ffffff',
                      '--tw-prose-strong': '#ffffff'
                    } as React.CSSProperties}
                  />
                </div>

                {/* Кнопки */}
                <div className={`flex flex-col sm:flex-row gap-6 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
                  {/* Кнопка "Связаться с нами" */}
                  <Link
                    href={sectionData.contact_button_link}
                    className="group relative px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-lg rounded-lg overflow-hidden transition-all duration-300 hover:from-red-500 hover:to-red-600 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 text-center hero-jab-text"
                  >
                    <span className="relative z-10">{sectionData.contact_button_text}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>

                  {/* Кнопка "Поддержать" */}
                  <Link
                    href={sectionData.support_button_link}
                    className="group relative px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-red-500 text-white font-bold text-lg rounded-lg overflow-hidden transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:border-red-400 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 text-center hero-jab-text"
                  >
                    <span className="relative z-10">{sectionData.support_button_text}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Мобильная выдвижная карточка */}
      <div className={`absolute left-0 right-0 bottom-0 z-30 sm:hidden transform transition-transform duration-500 ease-out ${
        isMobileCardOpen ? 'translate-y-0' : isPeeking ? 'animate-peek' : 'translate-y-[calc(100%-120px)]'
      }`} style={{ 
        maxHeight: '100vh', 
        boxSizing: 'border-box',
        overflowAnchor: 'none'
      }}>
        <div className={`bg-black/90 rounded-t-3xl shadow-2xl w-full pb-6 transition-all duration-300 ${!isMobileCardOpen ? 'border-t border-red-500/20 hover:shadow-red-500/20 hover:shadow-2xl' : ''}`} style={{ 
          boxSizing: 'border-box'
        }}>
          {/* Индикатор для закрытия - показываем только когда карточка открыта */}
          {isMobileCardOpen && (
            <div className="flex justify-center pt-4 pb-2">
              <button
                onClick={toggleMobileCard}
                className="w-12 h-1 bg-white/30 rounded-full hover:bg-white/50 transition-colors duration-300"
              ></button>
            </div>
          )}

          {/* Заголовок - всегда видимый и кликабельный */}
          <div className="pt-4 pb-4 cursor-pointer group" onClick={toggleMobileCard}>
            {/* Индикатор стрелки - сверху над заголовком */}
            <div className="flex justify-center mb-2">
              <div className={`transition-all duration-300 ${isMobileCardOpen ? 'rotate-180' : 'animate-bounce'}`}>
                <svg 
                  className="w-5 h-5 text-white/60 group-hover:text-white/80 transition-colors duration-300"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </div>
            </div>
            <h2 className="hero-jab-title text-xl font-bold px-6">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 group-hover:from-red-300 group-hover:to-red-500 transition-all duration-300">
                {sectionData.title}
              </span>
            </h2>
          </div>

          {/* Остальной контент - показываем только когда карточка открыта */}
          {isMobileCardOpen && (
            <div className="px-6 pt-0" style={{ boxSizing: 'border-box' }}>
              {/* Подзаголовок */}
              <div className="pb-8">
                <div 
                  className="hero-jab-text text-base text-white leading-relaxed prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: cleanSubtitle }}
                  style={{
                    '--tw-prose-body': '#ffffff',
                    '--tw-prose-headings': '#ffffff',
                    '--tw-prose-links': '#ef4444',
                    '--tw-prose-bold': '#ffffff',
                    '--tw-prose-strong': '#ffffff'
                  } as React.CSSProperties}
                />
              </div>

              {/* Кнопки */}
              <div className="flex flex-col space-y-4 pb-4">
                {/* Кнопка "Связаться с нами" */}
                <Link
                  href={sectionData.contact_button_link}
                  className="group relative px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-lg rounded-lg overflow-hidden transition-all duration-300 hover:from-red-500 hover:to-red-600 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 text-center hero-jab-text"
                >
                  <span className="relative z-10">{sectionData.contact_button_text}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>

                {/* Кнопка "Поддержать" */}
                <Link
                  href={sectionData.support_button_link}
                  className="group relative px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-red-500 text-white font-bold text-lg rounded-lg overflow-hidden transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:border-red-400 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 text-center hero-jab-text"
                >
                  <span className="relative z-10">{sectionData.support_button_text}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
