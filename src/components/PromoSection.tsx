'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { getPromoSection, PromoSection as PromoSectionType, getImageUrl } from '@/lib/pocketbase';

export default function PromoSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [promoData, setPromoData] = useState<PromoSectionType | null>(null);
  const [loading, setLoading] = useState(true);
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
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${isVisible ? 'reveal-on' : 'reveal-prep'}`}
    >
      {/* Фоновое изображение */}
      <div className="absolute inset-0">
        {/* Изображение для десктопа */}
        <Image
          src={backgroundImageUrl}
          alt="Дети занимаются спортом"
          fill
          className="object-cover hidden sm:block"
          priority
        />
        {/* Изображение для мобильных */}
        <Image
          src={backgroundImageUrlMobile}
          alt="Дети занимаются спортом"
          fill
          className="object-cover block sm:hidden"
          priority
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
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end lg:items-center min-h-screen py-12">
            {/* Левая карточка с текстом */}
            <div className={`w-full max-w-md lg:max-w-lg ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 lg:p-10 border border-red-500/20 shadow-2xl">
                {/* Заголовок */}
                <div className="mb-8">
                  <h2 className="hero-jab-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">{sectionData.title}</span>
                  </h2>
                </div>

                {/* Подзаголовок */}
                <div className={`mb-10 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
                  <div 
                    className="hero-jab-text text-lg sm:text-xl text-gray-200 leading-relaxed prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: cleanSubtitle }}
                    style={{
                      '--tw-prose-body': '#e5e7eb',
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
    </section>
  );
}
