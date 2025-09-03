'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [isRevealed, setIsRevealed] = useState(true); // Сразу показываем без анимации

  useEffect(() => {
    // Убираем анимацию появления для Hero секции
    // setIsRevealed(true);
  }, []);

  return (
    <section id="hero" className={`relative min-h-screen flex items-center overflow-hidden pt-20 ${isRevealed ? 'reveal-on' : 'reveal-prep'}`}>
      {/* Динамические элементы фона */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Красные и синие акценты как в боксе */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-red-600/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
        
        {/* Белые линии движения */}
        <div className="absolute top-32 left-20 w-16 h-0.5 bg-white/20 transform rotate-45"></div>
        <div className="absolute top-40 left-16 w-12 h-0.5 bg-white/20 transform rotate-45"></div>
        <div className="absolute bottom-32 right-20 w-20 h-0.5 bg-white/20 transform -rotate-45"></div>
        <div className="absolute bottom-40 right-16 w-14 h-0.5 bg-white/20 transform -rotate-45"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center" data-reveal-container>
        {/* Левая колонка - контент */}
        <div className="space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2" data-reveal>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="hero-jab-eyebrow inline-block rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 backdrop-blur-sm">
              БОКС И КИКБОКСИНГ
            </span>
          </div>
          
          {/* Заголовок */}
          <h1 className="hero-jab-title text-5xl md:text-7xl tracking-tight text-white leading-tight" data-reveal>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
              ШКОЛА ЕДИНОБОРСТВ JAB
            </span>
          </h1>
          
          {/* Описание */}
          <p className="hero-jab-text text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl" data-reveal>
            Группы по уровню. Первая тренировка - бесплатно
          </p>
          
          {/* Кнопка */}
          <div className="pt-4" data-reveal>
            <Link
              href="#contact"
              className="relative px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hero-jab-text text-center cursor-glove bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-red-500/25 hover:from-red-700 hover:to-red-800"
            >
              <span className="relative z-10">Записаться</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
          
          {/* Дополнительные элементы */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-8" data-reveal>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
              <span className="hero-jab-text text-gray-400 text-sm text-center sm:text-left">Первая тренировка бесплатно</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping" style={{animationDelay: '0.3s'}}></div>
              <span className="hero-jab-text text-gray-400 text-sm text-center sm:text-left">Группы по уровню</span>
            </div>
          </div>
        </div>

        {/* Правая колонка - изображение */}
        <div className="relative" data-reveal>
          <div className="relative group">
            {/* Плейсхолдер с анимацией */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl cursor-glove" style={{ aspectRatio: "16 / 10" }}>
              {/* Плейсхолдер с анимацией */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-6xl">🥊</span>
                  </div>
                  <p className="hero-jab-text text-gray-400 text-lg">ТРЕНИРОВОЧНЫЙ ЗАЛ</p>
                  <p className="hero-jab-text text-gray-500 text-sm mt-2">Современное оборудование</p>
                </div>
              </div>
              
              {/* Декоративные элементы - красный и синий углы */}
              <div className="absolute top-4 right-4 w-6 h-6 bg-red-500 rounded-full animate-bounce"></div>
              <div className="absolute bottom-4 left-4 w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
              
              {/* Рамка с анимацией */}
              <div className="absolute inset-0 rounded-2xl border-2 border-red-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Современные боксерские канаты */}
      <div className="absolute bottom-16 left-0 right-0 h-2 z-0">
        {/* Белый канат */}
        <div className="w-full h-full bg-gradient-to-b from-gray-200 via-white to-gray-200 rounded-sm shadow-sm"></div>
        {/* Световая анимация поверх каната */}
        <div className="absolute inset-0 w-full h-full animate-led-strip rounded-sm"></div>
      </div>
      <div className="absolute bottom-8 left-0 right-0 h-2 z-0">
        {/* Белый канат */}
        <div className="w-full h-full bg-gradient-to-b from-gray-200 via-white to-gray-200 rounded-sm shadow-sm"></div>
        {/* Световая анимация поверх каната */}
        <div className="absolute inset-0 w-full h-full animate-led-strip rounded-sm"></div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-2 z-0">
        {/* Белый канат */}
        <div className="w-full h-full bg-gradient-to-b from-gray-200 via-white to-gray-200 rounded-sm shadow-sm"></div>
        {/* Световая анимация поверх каната */}
        <div className="absolute inset-0 w-full h-full animate-led-strip rounded-sm"></div>
      </div>
      
      {/* Перемычки между канатами с надписью JAB */}
      <div className="absolute bottom-0 left-1/4 w-6 h-20 z-10">
        <div className="w-full h-full bg-red-500 rounded-sm shadow-md flex items-center justify-center">
          <span className="text-white font-bold text-sm tracking-wider transform -rotate-90" style={{textShadow: '1px 1px 0px rgba(0,0,0,0.3), -1px -1px 0px rgba(0,0,0,0.3), 1px -1px 0px rgba(0,0,0,0.3), -1px 1px 0px rgba(0,0,0,0.3)'}}>JAB</span>
        </div>
      </div>
      <div className="absolute bottom-0 right-1/4 w-6 h-20 z-10">
        <div className="w-full h-full bg-blue-500 rounded-sm shadow-md flex items-center justify-center">
          <span className="text-white font-bold text-sm tracking-wider transform -rotate-90" style={{textShadow: '1px 1px 0px rgba(0,0,0,0.3), -1px -1px 0px rgba(0,0,0,0.3), 1px -1px 0px rgba(0,0,0,0.3), -1px 1px 0px rgba(0,0,0,0.3)'}}>JAB</span>
        </div>
      </div>
      
      {/* Нижняя граница с градиентом */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
    </section>
  );
}
