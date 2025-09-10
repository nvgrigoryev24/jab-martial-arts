'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-400/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Сетка */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* Две картинки: слева 404, справа персонаж */}
        <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-16 mb-3 sm:mb-4 lg:mb-8">
          {/* Правая сторона - персонаж с сообщением */}
          <div className="flex-shrink-0">
            <img 
              src="/404_msg.png" 
              alt="404" 
              className="w-24 h-24 xs:w-28 xs:h-28 sm:w-40 sm:h-40 lg:w-56 lg:h-56 object-contain"
              style={{
                filter: 'none',
                outline: 'none',
                border: 'none',
                boxShadow: 'none',
                background: 'none',
                backgroundColor: 'transparent'
              }}
            />
          </div>

          {/* Левая сторона - большая цифра 404 */}
          <div className="flex-shrink-0">
            <img 
              src="/404.png" 
              alt="Character with message" 
              className="w-28 h-28 xs:w-32 xs:h-32 sm:w-48 sm:h-48 lg:w-80 lg:h-80 object-contain"
              style={{
                filter: 'none',
                outline: 'none',
                border: 'none',
                boxShadow: 'none',
                background: 'none',
                backgroundColor: 'transparent'
              }}
            />
          </div>
        </div>

        {/* Подзаголовок */}
        <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 lg:mb-4 tracking-wide text-center">
          Страница не найдена
        </h2>

        {/* Анимированные элементы */}
        <div className="flex justify-center space-x-3 sm:space-x-4 mb-3 sm:mb-4 lg:mb-8">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-bounce"></div>
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-bounce delay-200"></div>
        </div>

        {/* Кнопки действий */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 justify-center items-center">
          <Link 
            href="/"
            className="group relative px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm lg:text-base"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Вернуться на главную
          </Link>

          <button 
            onClick={() => window.history.back()}
            className="group relative px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm lg:text-base"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Назад
          </button>
        </div>

      </div>

      {/* Декоративные элементы */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-red-400 rounded-full animate-ping delay-500"></div>
      <div className="absolute bottom-32 left-16 w-1.5 h-1.5 bg-red-600 rounded-full animate-ping delay-1000"></div>
      <div className="absolute bottom-20 right-20 w-2 h-2 bg-red-500 rounded-full animate-ping delay-700"></div>
    </div>
  );
}
