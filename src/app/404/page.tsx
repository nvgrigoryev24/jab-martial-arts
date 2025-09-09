'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Page404() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-400/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Сетка */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className={`relative z-10 text-center max-w-4xl mx-auto px-6 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* Логотип/Иконка */}
        <div className="mb-8">
          <div className="inline-block relative">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-red-500/25 animate-pulse">
              JAB
            </div>
            <div className="absolute -inset-4 bg-red-500/20 rounded-full blur-xl animate-ping"></div>
          </div>
        </div>

        {/* Заголовок */}
        <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600 mb-6 tracking-wider">
          404
        </h1>

        {/* Подзаголовок */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-wide">
          Страница не найдена
        </h2>

        {/* Описание */}
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Похоже, вы заблудились в цифровом пространстве. Эта страница исчезла, 
          как тень в ночи. Но не волнуйтесь — мы поможем вам найти путь обратно.
        </p>

        {/* Анимированные элементы */}
        <div className="flex justify-center space-x-4 mb-8">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-200"></div>
        </div>

        {/* Кнопки действий */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/"
            className="group relative px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 flex items-center gap-2"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Вернуться на главную
          </Link>

          <button 
            onClick={() => window.history.back()}
            className="group relative px-8 py-4 border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <svg className="w-5 h-5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Назад
          </button>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-12 text-sm text-gray-500">
          <p>Если проблема повторяется, свяжитесь с нами</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="mailto:info@jab-martial-arts.ru" className="hover:text-red-400 transition-colors">
              info@jab-martial-arts.ru
            </a>
            <a href="tel:+7-xxx-xxx-xxxx" className="hover:text-red-400 transition-colors">
              +7 (xxx) xxx-xx-xx
            </a>
          </div>
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
