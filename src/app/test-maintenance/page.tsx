'use client';

import { useState } from 'react';
import Link from 'next/link';
import UnderMaintenance from '@/components/UnderMaintenance';

export default function TestMaintenance() {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    // Симулируем загрузку
    setTimeout(() => {
      setIsRetrying(false);
    }, 2000);
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      {/* Декоративные элементы фона */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-red-500/10 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-blue-500/10 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 h-full w-full flex flex-col justify-center items-center px-4">
        {/* Кнопка возврата - наверху */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <Link 
            href="/"
            className="inline-block bg-red-500 hover:bg-red-600 text-white px-2 sm:px-4 lg:px-6 py-1 sm:py-2 lg:py-3 rounded-lg font-bold uppercase tracking-wider transition-all duration-300 hero-jab-text cursor-glove transform hover:scale-105 text-xs sm:text-sm lg:text-base whitespace-nowrap"
          >
            ← Главная
          </Link>
        </div>

        {/* Основной контент - центрированный */}
        <div className="w-full max-w-5xl mx-auto">
          {/* Заголовок страницы */}
          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <h1 className="hero-jab-title text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-4 whitespace-nowrap">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                ТЕХНИЧЕСКОЕ ОБСЛУЖИВАНИЕ
              </span>
            </h1>
            <p className="hero-jab-text text-xs xs:text-sm sm:text-base lg:text-lg text-gray-300 px-2">
              Ведется плановое техническое обслуживание системы
            </p>
          </div>

          {/* Счетчик попыток */}
          <div className="text-center mb-3 sm:mb-4 lg:mb-6">
            <div className="inline-block bg-red-500/20 border border-red-500/30 rounded-lg px-2 sm:px-4 py-1 sm:py-2">
              <span className="text-red-300 font-medium text-xs sm:text-sm whitespace-nowrap">
                Попыток: {retryCount} | Статус: {isRetrying ? 'Загрузка...' : 'Готово'}
              </span>
            </div>
          </div>

          {/* Основной компонент maintenance */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <UnderMaintenance 
              sectionName="система"
              message="🚧 Ведется техническое обслуживание системы. Ожидаемое время восстановления: 30 минут. Спасибо за понимание! 🚧"
              showRetry={true}
              onRetry={handleRetry}
            />
          </div>

          {/* Информация о статусе */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-3 sm:p-4 lg:p-6">
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-2 sm:mb-4 text-center">
                📊 Статус системы
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-gray-300">
                <div className="text-center">
                  <div className="text-lg sm:text-xl lg:text-2xl mb-1 sm:mb-2">🔧</div>
                  <div className="font-semibold text-red-400 text-xs sm:text-sm lg:text-base">Обслуживание</div>
                  <div className="text-xs sm:text-sm">В процессе</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg sm:text-xl lg:text-2xl mb-1 sm:mb-2">⏱️</div>
                  <div className="font-semibold text-yellow-400 text-xs sm:text-sm lg:text-base">Время</div>
                  <div className="text-xs sm:text-sm">~30 минут</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg sm:text-xl lg:text-2xl mb-1 sm:mb-2">👨‍💻</div>
                  <div className="font-semibold text-blue-400 text-xs sm:text-sm lg:text-base">Команда</div>
                  <div className="text-xs sm:text-sm">Работает</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
