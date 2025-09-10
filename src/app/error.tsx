'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Логируем ошибку для отладки
    console.error('Critical error:', error);
  }, [error]);

  const handleRetry = () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    // Симулируем задержку перед retry
    setTimeout(() => {
      setIsRetrying(false);
      reset();
    }, 2000);
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center relative overflow-hidden">
      {/* Декоративные элементы фона */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-red-600/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-red-500/10 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-red-600/10 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Сетка */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className={`relative z-10 text-center max-w-4xl mx-auto px-6 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* Персонаж maintenance */}
        <div className="mb-8 flex justify-center">
          <div className="relative group">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center border-2 border-red-500/30 group-hover:scale-110 transition-transform duration-300">
              <img 
                src="/maintenace.png" 
                alt="Maintenance Character" 
                className="w-16 h-16 object-contain"
              />
            </div>
            {/* Анимированные точки вокруг персонажа */}
            <div className="absolute -inset-4">
              <div className="absolute top-0 left-1/2 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-red-500 rounded-full animate-ping delay-500"></div>
              <div className="absolute left-0 top-1/2 w-2 h-2 bg-red-500 rounded-full animate-ping delay-1000"></div>
              <div className="absolute right-0 top-1/2 w-2 h-2 bg-red-500 rounded-full animate-ping delay-1500"></div>
            </div>
          </div>
        </div>

        {/* Заголовок */}
        <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600 mb-6 tracking-wider">
          ОШИБКА
        </h1>

        {/* Подзаголовок */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-wide">
          Критическая ошибка сервера
        </h2>

        {/* Описание */}
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Произошла критическая ошибка системы. Наши инженеры уже работают над решением проблемы. 
          Пожалуйста, попробуйте обновить страницу или вернуться позже.
        </p>

        {/* Статус системы */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-8 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2 text-red-300">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Система недоступна</span>
          </div>
        </div>

        {/* Счетчик попыток */}
        {retryCount > 0 && (
          <div className="text-center mb-6">
            <div className="inline-block bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-2">
              <span className="text-red-300 font-medium">
                Попыток: {retryCount} | Статус: {isRetrying ? 'Загрузка...' : 'Готово'}
              </span>
            </div>
          </div>
        )}

        {/* Кнопки действий */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={handleRetry}
            disabled={isRetrying}
            className="group relative px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 disabled:scale-100 disabled:shadow-none flex items-center gap-2"
          >
            {isRetrying ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Загрузка...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Попробовать снова
              </>
            )}
          </button>

          <button 
            onClick={handleGoHome}
            className="group relative px-8 py-4 border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            На главную
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

        {/* Техническая информация (только в development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-800/50 rounded-lg text-left max-w-2xl mx-auto">
            <h3 className="text-red-400 font-bold mb-2">Техническая информация:</h3>
            <pre className="text-xs text-gray-300 overflow-auto">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </div>
        )}
      </div>

      {/* Декоративные элементы */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-red-400 rounded-full animate-ping delay-500"></div>
      <div className="absolute bottom-32 left-16 w-1.5 h-1.5 bg-red-600 rounded-full animate-ping delay-1000"></div>
      <div className="absolute bottom-20 right-20 w-2 h-2 bg-red-500 rounded-full animate-ping delay-700"></div>
    </div>
  );
}
