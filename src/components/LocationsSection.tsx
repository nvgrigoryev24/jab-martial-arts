'use client';

import React, { useState, useEffect } from 'react';
import { Location, getLocations, getImageUrl } from '@/lib/pocketbase';
import UnderMaintenance from './UnderMaintenance';
import { useUnderMaintenance } from '@/hooks/useUnderMaintenance';

const LocationsSection: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const {
    isUnderMaintenance,
    retryCount,
    canRetry,
    showMaintenance,
    hideMaintenance,
    retry
  } = useUnderMaintenance({ 
    sectionName: 'локации',
    maxRetries: 3,
    retryDelay: 2000
  });

  const loadLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLocations();
      
      if (data.length > 0) {
        console.log('Locations loaded from PocketBase:', data.length, 'records');
        setLocations(data);
        hideMaintenance();
      } else {
        console.log('No active locations found in PocketBase');
        showMaintenance();
      }
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError('Ошибка загрузки данных');
      showMaintenance();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const handleRetry = () => {
    retry(loadLocations);
  };

  if (loading && !isUnderMaintenance) {
    return (
      <section id="locations" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-700 rounded-lg mb-4 mx-auto w-96"></div>
              <div className="h-6 bg-gray-700 rounded-lg mb-8 mx-auto w-64"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-800/50 rounded-2xl p-6 h-96 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isUnderMaintenance) {
    return (
      <section id="locations" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="hero-jab-title text-4xl sm:text-5xl md:text-7xl text-white mb-6 sm:mb-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600">
                НАШИ ЗАЛЫ
              </span>
            </h2>
          </div>
          <UnderMaintenance 
            sectionName="локации"
            message={`Информация о залах временно недоступна. Попытка ${retryCount + 1} из 3.`}
            showRetry={canRetry}
            onRetry={handleRetry}
          />
        </div>
      </section>
    );
  }

  return (
    <section id="locations" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Заголовок секции - стиль JAB */}
        <div className="text-center mb-16 sm:mb-20 relative">
          <div className="relative z-10">
            <h2 className="hero-jab-title text-4xl sm:text-5xl md:text-7xl text-white mb-6 sm:mb-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600">
                НАШИ ЗАЛЫ
              </span>
            </h2>
            <p className="hero-jab-text text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Выберите удобный зал для тренировок
            </p>

          </div>
        </div>

        {/* Сетка залов - стиль JAB */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((location, index) => {
            // Определяем стиль для каждого зала в стиле JAB
            const getLocationStyle = (locationName: string) => {
              const styles = {
                'Центральный зал': {
                  gradient: 'from-red-600 via-red-700 to-red-800',
                  icon: '🥊',
                  accent: 'from-red-500 to-red-600',
                  border: 'border-red-500/30'
                },
                'Зал "Север"': {
                  gradient: 'from-blue-600 via-blue-700 to-blue-800',
                  icon: '❄️',
                  accent: 'from-blue-500 to-blue-600',
                  border: 'border-blue-500/30'
                },
                'Зал "Юг"': {
                  gradient: 'from-red-600 via-red-700 to-red-800',
                  icon: '🌿',
                  accent: 'from-red-500 to-red-600',
                  border: 'border-red-500/30'
                },
                'Зал "Локомотив"': {
                  gradient: 'from-gray-600 via-gray-700 to-gray-800',
                  icon: '🚂',
                  accent: 'from-gray-500 to-gray-600',
                  border: 'border-gray-500/30'
                }
              };
              return styles[locationName as keyof typeof styles] || {
                gradient: 'from-red-600 via-red-700 to-red-800',
                icon: '🏟️',
                accent: 'from-red-500 to-red-600',
                border: 'border-red-500/30'
              };
            };

            const style = getLocationStyle(location.name);

            return (
              <div
                key={location.id}
                className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer border border-gray-800/50 hover:border-red-500/50"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                {/* Основная карточка с градиентом JAB */}
                <div className={`relative h-80 ${location.name.includes('Сопка') || location.name.includes('Локомотив') ? 'bg-gray-900' : `bg-gradient-to-br ${style.gradient}`} p-8 flex flex-col justify-between overflow-hidden`}>
                  {/* Фоновое изображение для зала "Сопка" */}
                  {location.name.includes('Сопка') && (
                    <div className="absolute inset-0">
                      <img
                        src={(() => {
                          const imageUrl = location.photo ? getImageUrl(location, location.photo) : null;
                          return imageUrl && imageUrl.trim() !== '' ? imageUrl : "/sopka.webp";
                        })()}
                        alt={`Зал ${location.name}`}
                        className="w-full h-full object-cover"
                      />
                      <div 
                        className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10"
                        style={{
                          background: `linear-gradient(to top, rgba(0,0,0,${(location.overlay_opacity || 70) / 100}) 0%, rgba(0,0,0,${(location.overlay_opacity || 70) / 200}) 50%, rgba(0,0,0,${(location.overlay_opacity || 70) / 400}) 100%)`
                        }}
                      ></div>
                    </div>
                  )}
                  
                  {/* Фоновое изображение для зала "Локомотив" */}
                  {location.name.includes('Локомотив') && (
                    <div className="absolute inset-0">
                      <img
                        src={(() => {
                          const imageUrl = location.photo ? getImageUrl(location, location.photo) : null;
                          return imageUrl && imageUrl.trim() !== '' ? imageUrl : "/loco.jpg";
                        })()}
                        alt={`Зал ${location.name}`}
                        className="w-full h-full object-cover"
                      />
                      <div 
                        className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10"
                        style={{
                          background: `linear-gradient(to top, rgba(0,0,0,${(location.overlay_opacity || 70) / 100}) 0%, rgba(0,0,0,${(location.overlay_opacity || 70) / 200}) 50%, rgba(0,0,0,${(location.overlay_opacity || 70) / 400}) 100%)`
                        }}
                      ></div>
                    </div>
                  )}
                  
                  {/* Декоративные элементы в стиле JAB */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl transform -translate-x-6 translate-y-6 group-hover:scale-125 transition-transform duration-700"></div>
                  
                  {/* Легкий оверлей для лучшей читаемости текста */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-transparent"
                    style={{
                      background: `linear-gradient(to top, rgba(0,0,0,${(location.overlay_opacity || 20) / 100}) 0%, rgba(0,0,0,${(location.overlay_opacity || 20) / 200}) 50%, transparent 100%)`
                    }}
                  ></div>
                  
                  {/* Верхняя часть - название и статус */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="hero-jab-title text-2xl text-white">
                        {location.name}
                      </h3>
                    </div>
                    
                  </div>

                  {/* Нижняя часть - информация */}
                  <div className="relative z-10 space-y-3">
                    {/* Адрес */}
                    <div className="flex items-center gap-2 text-white/90 group-hover:opacity-0 transition-opacity duration-300">
                      <span className="text-sm">📍</span>
                      <span className="hero-jab-text text-sm">{location.address}</span>
                    </div>
                    
                    
                    {/* Описание зала */}
                    {location.description && (
                      <div className="text-white/70">
                        <span className="hero-jab-text text-xs leading-relaxed">{location.description}</span>
                      </div>
                    )}
                    
                  </div>

                  {/* Теги удобств при hover */}
                  {location.facilities && (
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex flex-wrap justify-start" style={{ lineHeight: '1', maxHeight: '120px', overflow: 'hidden' }}>
                      {location.facilities.split(', ').map((facility, index) => (
                        <span 
                          key={index}
                          className="bg-white/10 text-white/80 px-2 py-1 rounded text-xs hero-jab-text inline-block mr-1 mb-1"
                          style={{ lineHeight: '1.2' }}
                        >
                          {facility.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Hover эффект в стиле JAB */}
                  <div className="absolute inset-0 bg-gradient-to-t from-red-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Нижняя панель с кнопкой в стиле JAB */}
                <div className="bg-gray-900 p-6 border-t border-gray-800">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1 text-center sm:text-left">
                      <p className="hero-jab-text text-sm text-gray-300 font-medium mb-1">Выберите этот зал</p>
                      <p className="hero-jab-text text-xs text-gray-400">Нажмите для записи</p>
                    </div>
                    <button 
                      onClick={() => {
                        // Переходим к расписанию с фильтром по локации
                        const scheduleElement = document.getElementById('schedule');
                        if (scheduleElement) {
                          // Прокручиваем к расписанию
                          scheduleElement.scrollIntoView({ behavior: 'smooth' });
                          
                          // Устанавливаем фильтр по локации через URL параметры
                          const url = new URL(window.location.href);
                          url.searchParams.set('location', location.name);
                          window.history.pushState({}, '', url.toString());
                          
                          // Диспатчим событие для обновления фильтра в расписании
                          window.dispatchEvent(new CustomEvent('locationFilter', { 
                            detail: { locationName: location.name } 
                          }));
                        }
                      }}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-red-500/25 w-full sm:w-auto"
                    >
                      {location.button_text || 'Записаться'}
                      <span className="text-xs">→</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Призыв к действию - стиль JAB */}
        <div className="text-center mt-20 relative">
          <div className="relative z-10">
            <h3 className="hero-jab-title text-3xl sm:text-4xl text-white mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                Начните тренировки
              </span>
            </h3>
            <p className="hero-jab-text text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Запишитесь на первую бесплатную тренировку в любом из залов
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="group relative px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 flex items-center gap-2"
              >
                <span>🥊</span>
                Записаться на тренировку
                <span className="text-sm">→</span>
              </a>
              <a
                href="#schedule"
                className="group relative px-8 py-4 border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <span>📅</span>
                Посмотреть расписание
                <span className="text-sm">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CSS анимации */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default LocationsSection;
