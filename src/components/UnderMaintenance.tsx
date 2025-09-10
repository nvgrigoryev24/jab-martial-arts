'use client';

import { useEffect, useState } from 'react';

interface UnderMaintenanceProps {
  sectionName?: string;
  message?: string;
  showRetry?: boolean;
  onRetry?: () => void;
  className?: string;
}

export default function UnderMaintenance({ 
  sectionName = "секция",
  message,
  showRetry = true,
  onRetry,
  className = ""
}: UnderMaintenanceProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const defaultMessage = `Данные для ${sectionName} временно недоступны. Мы обновляем информацию, пожалуйста, зайдите позже.`;

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm ${className}`}>
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-red-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-red-400/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Сетка */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.03)_1px,transparent_1px)] bg-[size:30px_30px]"></div>

      <div className={`relative z-10 p-8 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        {/* Персонаж и контент в flex контейнере */}
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Персонаж - слева на десктопе, сверху на мобильных */}
          <div className="flex-shrink-0 order-1 lg:order-1">
            <div className="relative group">
              <div className="w-32 h-32 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center border-2 border-red-500/30 group-hover:scale-110 transition-transform duration-300">
                <img 
                  src="/maintenace.png" 
                  alt="Maintenance Character" 
                  className="w-24 h-24 object-contain"
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

          {/* Текстовый контент - справа на десктопе, снизу на мобильных */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-2">
            {/* Иконка инструментов */}
            <div className="mb-4">
              <div className="inline-block relative">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center text-red-400 text-xl font-bold shadow-lg">
                  🔧
                </div>
                <div className="absolute -inset-1 bg-red-500/10 rounded-full blur-lg animate-ping"></div>
              </div>
            </div>

            {/* Заголовок */}
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              На ремонте
            </h3>

            {/* Сообщение */}
            <p className="text-gray-300 mb-6 leading-relaxed text-sm sm:text-base">
              {message || defaultMessage}
            </p>

            {/* Анимированные точки загрузки */}
            <div className="flex justify-center lg:justify-start space-x-2 mb-6">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce delay-200"></div>
            </div>

            {/* Кнопка повтора */}
            {showRetry && onRetry && (
              <button 
                onClick={onRetry}
                className="group relative px-6 py-3 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 font-medium rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto lg:mx-0"
              >
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Попробовать снова
              </button>
            )}

            {/* Дополнительная информация */}
            <div className="mt-4 text-xs text-gray-500">
              <p>Обновление данных в процессе</p>
            </div>
          </div>
        </div>
      </div>

      {/* Декоративные элементы */}
      <div className="absolute top-4 left-4 w-1 h-1 bg-red-500 rounded-full animate-ping"></div>
      <div className="absolute top-6 right-6 w-0.5 h-0.5 bg-red-400 rounded-full animate-ping delay-500"></div>
      <div className="absolute bottom-4 left-6 w-1 h-1 bg-red-600 rounded-full animate-ping delay-1000"></div>
      <div className="absolute bottom-6 right-4 w-0.5 h-0.5 bg-red-500 rounded-full animate-ping delay-700"></div>
    </div>
  );
}
