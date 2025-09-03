'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function CTABanner() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 1.0) {
          setIsVisible(true);
        }
      },
      {
        threshold: 1.0 // 100% viewport
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
  return (
    <section ref={sectionRef} className="relative py-16 text-white overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Красные и синие акценты */}
        <div className="absolute top-16 left-16 w-20 h-20 bg-red-600/12 rounded-full blur-xl animate-pulse" style={{animationDelay: '2.5s'}}></div>
        <div className="absolute bottom-16 right-16 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '3.5s'}}></div>
        <div className="absolute top-1/4 left-1/3 w-16 h-16 bg-red-600/08 rounded-full blur-lg animate-pulse" style={{animationDelay: '1.8s'}}></div>
        
        {/* Белые линии движения */}
        <div className="absolute top-24 left-24 w-10 h-0.5 bg-white/12 transform rotate-45"></div>
        <div className="absolute bottom-24 right-24 w-14 h-0.5 bg-white/12 transform -rotate-45"></div>
        <div className="absolute top-1/2 right-16 w-6 h-0.5 bg-white/08 transform rotate-45"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-center">
            
            {/* Левая часть - CTA карточка */}
            <div className="flex justify-center lg:justify-start">
              <div className="bg-black/90 backdrop-blur-sm rounded-2xl border border-red-500/30 p-14 max-w-xl w-full shadow-2xl">
                <h2 className="hero-jab-title text-2xl md:text-3xl font-bold text-white mb-4 text-center">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                    ЗАПИШИСЬ НА
                  </span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                    ПРОБНОЕ
                  </span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                    ЗАНЯТИЕ
                  </span>
                </h2>
                <p className="hero-jab-text text-lg text-white mb-6 text-center font-bold">
                  БЕСПЛАТНО!
                </p>
                
                <div className="text-center">
                  <Link
                    href="#contact"
                    className="relative px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hero-jab-text text-center cursor-glove bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-red-500/25 hover:from-red-700 hover:to-red-800 inline-block w-full"
                  >
                    <span className="relative z-10">БОКСИРОВАТЬ</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Правая часть - Изображение */}
            <div className="relative">
              <div className={`transform transition-all duration-1200 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-x-0 scale-100 rotate-0' 
                  : 'opacity-0 translate-x-12 scale-75 rotate-2'
              }`}>
                <Image 
                  src="/20250902_0624_Указующий мультяшный стиль_remix_01k4476rjre9naxk7ndrhevksy.png"
                  alt="Тренер JAB указывает на кнопку"
                  width={600}
                  height={600}
                  className="w-full h-auto object-contain drop-shadow-xl"
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
