'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { getCTABanner, CTABanner as CTABannerType, getImageUrl } from '@/lib/pocketbase';

export default function CTABanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [ctaBanner, setCtaBanner] = useState<CTABannerType | null>(null);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  // Загрузка данных CTA баннера из PocketBase
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchCTABanner = async () => {
      try {
        const banner = await getCTABanner(abortController.signal);
        setCtaBanner(banner);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching CTA banner:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCTABanner();

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
      <section ref={sectionRef} className="relative py-12 sm:py-16 text-white overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Если нет данных из PocketBase, используем дефолтные значения
  const bannerData = ctaBanner || {
    title: "ЗАПИШИСЬ НА ПРОБНОЕ ЗАНЯТИЕ",
    subtitle: "БЕСПЛАТНО!",
    button_text: "БОКСИРОВАТЬ",
    button_link: "#contact",
    character_image: null
  };

  // Формируем URL изображения персонажа
  const characterImageUrl = bannerData.character_image && ctaBanner 
    ? getImageUrl(ctaBanner, bannerData.character_image)
    : "/20250902_0624_Указующий мультяшный стиль_remix_01k4476rjre9naxk7ndrhevksy.png";

  return (
    <section ref={sectionRef} className="relative py-12 sm:py-16 text-white overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Красные и синие акценты - адаптивные размеры */}
        <div className="absolute top-8 sm:top-16 left-8 sm:left-16 w-12 h-12 sm:w-20 sm:h-20 bg-red-600/12 rounded-full blur-xl animate-pulse" style={{animationDelay: '2.5s'}}></div>
        <div className="absolute bottom-8 sm:bottom-16 right-8 sm:right-16 w-16 h-16 sm:w-24 sm:h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '3.5s'}}></div>
        <div className="absolute top-1/4 left-1/4 sm:left-1/3 w-10 h-10 sm:w-16 sm:h-16 bg-red-600/08 rounded-full blur-lg animate-pulse" style={{animationDelay: '1.8s'}}></div>
        
        {/* Белые линии движения - адаптивные позиции */}
        <div className="absolute top-12 sm:top-24 left-12 sm:left-24 w-6 h-0.5 sm:w-10 sm:h-0.5 bg-white/12 transform rotate-45"></div>
        <div className="absolute bottom-12 sm:bottom-24 right-12 sm:right-24 w-8 h-0.5 sm:w-14 sm:h-0.5 bg-white/12 transform -rotate-45"></div>
        <div className="absolute top-1/2 right-8 sm:right-16 w-4 h-0.5 sm:w-6 sm:h-0.5 bg-white/08 transform rotate-45"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* На мобильных: баннер и персонаж рядом, на десктопе: в две колонки */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:gap-8 items-center">
            
            {/* CTA карточка */}
            <div className="flex justify-center lg:justify-start order-1 sm:order-1">
              <div className="bg-black/90 backdrop-blur-sm rounded-2xl border border-red-500/30 p-3 sm:p-6 md:p-8 lg:p-14 w-full shadow-2xl">
                <h2 className="hero-jab-title text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3 md:mb-4 text-center">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                    {bannerData.title}
                  </span>
                </h2>
                <p className="hero-jab-text text-xs sm:text-base md:text-lg text-white mb-2 sm:mb-4 md:mb-6 text-center font-bold">
                  {bannerData.subtitle}
                </p>
                
                <div className="text-center">
                  <Link
                    href={bannerData.button_link}
                    className="relative px-3 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-xl font-bold text-xs sm:text-base md:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hero-jab-text text-center cursor-glove bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-red-500/25 hover:from-red-700 hover:to-red-800 inline-block w-full smooth-scroll"
                  >
                    <span className="relative z-10">{bannerData.button_text}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Персонаж - рядом с баннером на мобильных */}
            <div className="relative order-2 sm:order-2 lg:order-2 flex items-center justify-center">
              <div className={`transform transition-all duration-1200 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-x-0 scale-100 rotate-0' 
                  : 'opacity-0 translate-x-12 scale-75 rotate-2'
              }`}>
                <Image 
                  src={characterImageUrl}
                  alt="Тренер JAB указывает на кнопку"
                  width={600}
                  height={600}
                  style={{ width: "auto", height: "auto" }}
                  className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain drop-shadow-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
