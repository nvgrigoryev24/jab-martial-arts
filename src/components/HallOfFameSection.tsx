'use client';

import React, { useState, useEffect } from 'react';
import { 
  HallOfFame, 
  getHallOfFame, 
  getImageUrl, 
  getStatusIcon, 
  sanitizeHtmlForDisplay 
} from '@/lib/pocketbase';
import UnderMaintenance from './UnderMaintenance';
import { useUnderMaintenance } from '@/hooks/useUnderMaintenance';

const HallOfFameSection: React.FC = () => {
  const [athletes, setAthletes] = useState<HallOfFame[]>([]);
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
    sectionName: 'зал славы',
    maxRetries: 3,
    retryDelay: 2000
  });

  const loadAthletes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHallOfFame();
      
      if (data.length > 0) {
        console.log('Hall of fame loaded from PocketBase:', data.length, 'records');
        setAthletes(data);
        hideMaintenance();
      } else {
        console.log('No hall of fame data found in PocketBase');
        showMaintenance();
      }
    } catch (err) {
      console.error('Error fetching hall of fame:', err);
      setError('Ошибка загрузки данных');
      showMaintenance();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAthletes();
  }, []);

  const handleRetry = () => {
    retry(loadAthletes);
  };

  if (loading && !isUnderMaintenance) {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-700 rounded-lg mb-4 mx-auto w-96"></div>
              <div className="h-6 bg-gray-700 rounded-lg mb-8 mx-auto w-64"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    <div className="h-64 bg-gray-700 rounded-xl mb-4"></div>
                    <div className="h-6 bg-gray-700 rounded-lg mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded-lg"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isUnderMaintenance) {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="hero-jab-title text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                ЗАЛ СЛАВЫ
              </span>
            </h2>
          </div>
          <UnderMaintenance 
            sectionName="зал славы"
            message={`Информация о спортсменах временно недоступна. Попытка ${retryCount + 1} из 3.`}
            showRetry={canRetry}
            onRetry={handleRetry}
          />
        </div>
      </section>
    );
  }

  return (
    <section id="hall-of-fame" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Заголовок секции */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="hero-jab-title text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
              ЗАЛ СЛАВЫ
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Наши легенды, которые прославили школу JAB своими достижениями
          </p>
          
          {/* Индикатор демо-данных */}
          {athletes.length > 0 && athletes[0].photo?.startsWith('mock-photo') && (
            <div className="mt-4 inline-block bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-2">
              <span className="text-yellow-300 text-sm font-medium">
                🎭 Демо-данные для предварительного просмотра
              </span>
            </div>
          )}
        </div>

        {/* Сетка спортсменов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {athletes.map((athlete, index) => (
            <div
              key={athlete.id}
              className={`group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 hover:scale-105 ${
                athlete.is_featured 
                  ? 'border-yellow-400/50' 
                  : 'border-gray-700/50 hover:border-red-500/50'
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >

              {/* Фотография */}
              <div className="relative mb-6 overflow-hidden rounded-xl">
                {athlete.photo && !athlete.photo.startsWith('mock-photo') ? (
                  <img
                    src={getImageUrl(athlete, athlete.photo)}
                    alt={athlete.athlete_name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center relative">
                    {/* Плейсхолдер с эмодзи и именем */}
                    <div className="text-center">
                      <div className="text-6xl text-gray-400 mb-2">🥊</div>
                      <div className="text-sm text-gray-500 font-medium">
                        {athlete.athlete_name.split(' ')[0]}
                      </div>
                    </div>
                    {/* Декоративная рамка */}
                    <div className="absolute inset-0 border-2 border-red-500/20 rounded-xl"></div>
                  </div>
                )}
                
                {/* Статус */}
                <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <span className="text-lg">{getStatusIcon(athlete.current_status)}</span>
                  <span className="text-xs text-white font-medium">{athlete.current_status}</span>
                </div>

                {/* Особое упоминание */}
                {athlete.special_mention && (
                  <div className="absolute top-2 left-2 bg-red-500/90 backdrop-blur-sm rounded-lg px-2 py-1">
                    <span className="text-xs text-white font-medium">⭐ {athlete.special_mention}</span>
                  </div>
                )}
              </div>

              {/* Информация о спортсмене */}
              <div className="space-y-3">
                {/* Имя */}
                <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors duration-300">
                  {athlete.athlete_name}
                </h3>

                {/* Вид спорта */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Вид спорта:</span>
                  <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-sm font-medium">
                    {athlete.sport_type}
                  </span>
                </div>

                {/* Годы активности */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Активность:</span>
                  <span className="text-sm text-gray-300">
                    {athlete.years_active}
                  </span>
                </div>

                {/* Достижения */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-300">Достижения:</h4>
                  <div 
                    className="text-sm text-gray-400 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: sanitizeHtmlForDisplay(athlete.achievements) 
                    }}
                  />
                </div>
              </div>

              {/* Hover эффект */}
              <div className="absolute inset-0 bg-gradient-to-t from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </div>
          ))}
        </div>

        {/* Призыв к действию */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-white mb-4">
            Стань частью легенды JAB!
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Присоединяйся к нашей школе и начни свой путь к спортивным вершинам. 
            Возможно, именно твое имя будет следующим в Зале славы!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors duration-300"
            >
              Записаться на тренировку
            </a>
            <a
              href="#schedule"
              className="px-6 py-3 border-2 border-red-500 text-red-400 font-bold rounded-lg hover:bg-red-500 hover:text-white transition-colors duration-300"
            >
              Посмотреть расписание
            </a>
          </div>
        </div>
      </div>

      {/* CSS анимации */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
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

export default HallOfFameSection;
