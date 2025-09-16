'use client';

import { useState, useEffect, useRef } from 'react';
import { getPreloaderSettings, getImageUrl, type PreloaderSettings } from '@/lib/pocketbase';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [settings, setSettings] = useState<PreloaderSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoadingText, setShowLoadingText] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Загружаем настройки прелоудера
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await getPreloaderSettings(abortController.signal);
        setSettings(data);
      } catch (error) {
        console.error('Error loading preloader settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();

    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    // Завершаем через 3 секунды
    const timeout = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 3000);
    
    return () => {
      clearTimeout(timeout);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  // Если загружаем настройки, показываем индикатор загрузки
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center px-4">
        <div className="flex items-center gap-2 xs:gap-3">
          <div className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="hero-jab-text text-white text-sm xs:text-base sm:text-lg whitespace-nowrap">Загрузка...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-500 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}
         style={{ backgroundColor: settings?.background_color || '#000000' }}>

      {/* Видео контейнер */}
      <div className="relative w-full h-full flex items-center justify-center">
        {settings?.video_file ? (
          <video
            ref={videoRef}
            className="max-w-full max-h-full object-contain"
            muted
            playsInline
            preload="auto"
          >
            <source src={getImageUrl(settings, settings.video_file)} type="video/mp4" />
            Ваш браузер не поддерживает видео.
          </video>
        ) : (
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
        )}

        {/* Логотип JAB поверх видео */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
          <div className="text-center">
            <h1 className="hero-jab-title text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-2 xs:mb-3 sm:mb-4 drop-shadow-2xl"
                style={{ color: settings?.text_color || '#ffffff' }}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                JAB
              </span>
            </h1>
            <p className="hero-jab-text text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl drop-shadow-lg whitespace-nowrap"
               style={{ color: settings?.text_color || '#d1d5db' }}>
              БОКСЕРСКАЯ ШКОЛА
            </p>
          </div>
        </div>

        {/* Кнопка пропуска - адаптивное позиционирование */}
        <button
          onClick={() => {
            setIsVisible(false);
            onComplete();
          }}
          className="absolute top-4 xs:top-6 sm:top-8 md:top-12 lg:top-24 left-1/2 transform -translate-x-1/2 xs:translate-x-8 sm:translate-x-12 md:translate-x-16 lg:translate-x-24 px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 hover:text-white border border-white/60 hover:border-white/80 rounded-lg transition-all duration-300 cursor-glove hero-jab-text text-xs xs:text-sm font-medium hover:scale-105 whitespace-nowrap"
          style={{ 
            color: settings?.text_color || 'rgba(255, 255, 255, 0.8)',
            borderColor: settings?.text_color || 'rgba(255, 255, 255, 0.6)'
          }}
        >
          Пропустить
        </button>

        {/* Индикатор загрузки */}
        {showLoadingText && (
          <div className="absolute bottom-4 xs:bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 px-4">
            <div className="flex items-center gap-2 xs:gap-3">
              <div className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="hero-jab-text text-sm xs:text-base sm:text-lg whitespace-nowrap"
                    style={{ color: settings?.text_color || '#ffffff' }}>
                {settings?.loading_text || 'Загрузка...'}
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
