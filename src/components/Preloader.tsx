'use client';

import { useState, useEffect, useRef } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Таймаут для автоматического завершения прелоадера через 3 секунды
    const timeout = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 3000);

    const video = videoRef.current;
    if (!video) {
      clearTimeout(timeout);
      return;
    }

    const handleVideoLoad = () => {
      setIsVideoLoaded(true);
    };

    const handleVideoEnd = () => {
      clearTimeout(timeout);
      setIsVisible(false);
      onComplete();
    };

    const handleVideoError = () => {
      // Если видео не загрузилось, пропускаем прелоадер
      clearTimeout(timeout);
      setIsVisible(false);
      onComplete();
    };

    video.addEventListener('loadeddata', handleVideoLoad);
    video.addEventListener('ended', handleVideoEnd);
    video.addEventListener('error', handleVideoError);

    // Автоматически запускаем видео
    video.play().catch(() => {
      // Если автовоспроизведение заблокировано, пропускаем прелоадер
      clearTimeout(timeout);
      setIsVisible(false);
      onComplete();
    });

    return () => {
      clearTimeout(timeout);
      video.removeEventListener('loadeddata', handleVideoLoad);
      video.removeEventListener('ended', handleVideoEnd);
      video.removeEventListener('error', handleVideoError);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 bg-black transition-opacity duration-500 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>

      {/* Видео контейнер */}
      <div className="relative w-full h-full flex items-center justify-center">
        <video
          ref={videoRef}
          className="max-w-full max-h-full object-contain"
          muted
          playsInline
          preload="auto"
        >
          <source src="/intro.mp4" type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>

        {/* Логотип JAB поверх видео */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <h1 className="hero-jab-title text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-2xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                JAB
              </span>
            </h1>
            <p className="hero-jab-text text-xl md:text-2xl text-gray-300 drop-shadow-lg">
              БОКСЕРСКАЯ ШКОЛА
            </p>
          </div>
        </div>

        {/* Кнопка пропуска - НАД видео, справа от центра */}
        <button
          onClick={() => {
            setIsVisible(false);
            onComplete();
          }}
          className="absolute top-24 left-1/2 transform translate-x-24 px-4 py-2 text-white/80 hover:text-white border border-white/60 hover:border-white/80 rounded-lg transition-all duration-300 cursor-glove hero-jab-text text-sm font-medium hover:scale-105"
        >
          Пропустить
        </button>

        {/* Индикатор загрузки */}
        {!isVideoLoaded && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="hero-jab-text text-white text-lg">Загрузка...</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
