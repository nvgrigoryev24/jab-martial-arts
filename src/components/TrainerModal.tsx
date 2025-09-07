'use client';

import { useEffect, useState, useRef } from 'react';
import { Trainer, getImageUrl, sanitizeHtmlForDisplay } from '@/lib/pocketbase';

interface TrainerModalProps {
  trainer: Trainer | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TrainerModal({ trainer, isOpen, onClose }: TrainerModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);

  useEffect(() => {
    if (isOpen) {
      // Сохраняем текущую позицию скролла
      scrollPositionRef.current = window.scrollY;
      
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.top = 'unset';
      document.body.style.width = 'unset';
      
      // Восстанавливаем позицию скролла
      window.scrollTo(0, scrollPositionRef.current);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.top = 'unset';
      document.body.style.width = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };


  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);


  if (!isOpen || !trainer) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      {/* Улучшенный фон с градиентами и акцентами */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-900/90 backdrop-blur-sm">
        {/* Декоративные элементы фона */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Градиентные полосы */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
          
          {/* Плавающие акценты */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-500/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-red-500/6 rounded-full blur-2xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-1/3 left-1/3 w-28 h-28 bg-blue-500/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
          
          {/* Дополнительные акценты */}
          <div className="absolute top-8 right-8 w-16 h-16 bg-red-500/15 rounded-full blur-xl animate-pulse" style={{animationDelay: '3s'}}></div>
          <div className="absolute bottom-8 left-8 w-20 h-20 bg-blue-500/12 rounded-full blur-xl animate-pulse" style={{animationDelay: '2.5s'}}></div>
        </div>
      </div>
      
      {/* Модальное окно - ТОЛЬКО ОДНА прокрутка */}
      <div
        ref={modalRef}
        className={`relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-gray-800/95 to-black/95 backdrop-blur-xl border border-red-500/30 rounded-3xl shadow-2xl shadow-red-500/20 transform transition-all duration-500 overflow-y-auto modal-scrollbar ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'
        }`}
      >
        {/* Декоративные элементы модального окна */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          {/* Внутренние градиенты */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
          
          {/* Внутренние акценты */}
          <div className="absolute top-4 right-4 w-12 h-12 bg-red-500/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-blue-500/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2.5s'}}></div>
        </div>

        {/* Кнопка закрытия - ВСЕГДА ВИДНА при прокрутке */}
        <div className="sticky top-0 left-0 w-full h-0 z-30 pointer-events-none">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-12 h-12 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 rounded-full flex items-center justify-center transition-all duration-300 cursor-glove group backdrop-blur-sm shadow-lg pointer-events-auto"
          >
            <span className="text-white text-2xl group-hover:scale-110 transition-transform duration-200">×</span>
          </button>
        </div>

        {/* Контент */}
        <div className="relative z-10">
          {/* Фото тренера - сверху */}
          <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
            {trainer.photo ? (
              <img 
                src={getImageUrl(trainer, trainer.photo)} 
                alt={trainer.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-6xl">🥊</span>
                </div>
              </div>
            )}
            
            {/* Декоративная рамка для фото */}
            <div className="absolute inset-0 border-2 border-red-500/30 pointer-events-none"></div>
            
            {/* Градиентный оверлей на фото */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            {/* Информация поверх фото */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <h2 className="hero-jab-title text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600">
                  {trainer.name}
                </span>
              </h2>
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium border hero-jab-text bg-red-500/20 text-red-300 border-red-500/30 backdrop-blur-sm`}>
                {trainer.specialization}
              </div>
              <div className="hero-jab-text text-base text-gray-300 mt-2">
                Опыт: {trainer.experience_years} лет
              </div>
            </div>
          </div>

          {/* Информация - снизу */}
          <div className="p-6 space-y-6">
            {/* Краткая биография */}
            {trainer.short_bio && (
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 shadow-xl">
                <h3 className="hero-jab-text text-xl font-bold text-red-400 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Краткая информация
                </h3>
                <p className="hero-jab-text text-gray-300 leading-relaxed text-lg">
                  {trainer.short_bio}
                </p>
              </div>
            )}

            {/* Подробное описание */}
            {trainer.description && (
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 shadow-xl">
                <h3 className="hero-jab-text text-xl font-bold text-red-400 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  О тренере
                </h3>
                <div 
                  className="hero-jab-text text-gray-300 leading-relaxed prose prose-invert prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtmlForDisplay(trainer.description) }}
                />
              </div>
            )}

            {/* Достижения */}
            {trainer.achievements && (
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 shadow-xl">
                <h3 className="hero-jab-text text-xl font-bold text-red-400 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Достижения
                </h3>
                <div 
                  className="hero-jab-text text-gray-300 leading-relaxed prose prose-invert prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtmlForDisplay(trainer.achievements) }}
                />
              </div>
            )}

            {/* Кнопка записи */}
            <div className="flex justify-center pt-4">
              <a
                href="#contact"
                onClick={onClose}
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-300 cursor-glove text-center shadow-lg hover:shadow-red-500/25 transform hover:scale-105"
              >
                Записаться на тренировку
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}