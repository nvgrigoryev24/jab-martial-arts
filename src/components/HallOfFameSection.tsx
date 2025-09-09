'use client';

import React, { useState, useEffect } from 'react';
import { 
  HallOfFame, 
  getHallOfFame, 
  getImageUrl, 
  getStatusIcon, 
  sanitizeHtmlForDisplay 
} from '@/lib/pocketbase';

const HallOfFameSection: React.FC = () => {
  const [athletes, setAthletes] = useState<HallOfFame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        setLoading(true);
        const data = await getHallOfFame();
        
        // Если данных нет, используем моковые данные для демонстрации
        if (data.length === 0) {
          const mockData: HallOfFame[] = [
            {
              id: '1',
              athlete_name: 'Александр Петров',
              sport_type: 'Бокс',
              achievements: '<p><strong>Чемпион России по боксу 2023</strong></p><p>Серебряный призер чемпионата мира 2022</p><p>Бронзовый призер Олимпийских игр 2021</p><p>Мастер спорта международного класса</p>',
              photo: 'mock-photo-1.jpg',
              rank: 1,
              years_active: '2018-настоящее время',
              current_status: 'Активный',
              special_mention: 'Непревзойденный боец с техникой мирового уровня',
              is_featured: true,
              is_active: true,
              sort_order: 1,
              created: '2025-01-15T00:00:00Z',
              updated: '2025-01-15T00:00:00Z'
            },
            {
              id: '2',
              athlete_name: 'Мария Сидорова',
              sport_type: 'Кикбоксинг',
              achievements: '<p><strong>Чемпионка Европы по кикбоксингу 2023</strong></p><p>Золотая медаль на чемпионате мира 2022</p><p>Чемпионка России 2021-2023</p><p>Мастер спорта России</p>',
              photo: 'mock-photo-2.jpg',
              rank: 2,
              years_active: '2019-настоящее время',
              current_status: 'Активный',
              special_mention: 'Королева кикбоксинга с невероятной скоростью',
              is_featured: true,
              is_active: true,
              sort_order: 2,
              created: '2025-01-15T00:00:00Z',
              updated: '2025-01-15T00:00:00Z'
            },
            {
              id: '3',
              athlete_name: 'Дмитрий Волков',
              sport_type: 'Смешанные единоборства',
              achievements: '<p><strong>Чемпион России по ММА 2022</strong></p><p>Победитель турнира "Битва чемпионов" 2023</p><p>Мастер спорта по самбо</p><p>Кандидат в мастера спорта по боксу</p>',
              photo: 'mock-photo-3.jpg',
              rank: 3,
              years_active: '2017-2024',
              current_status: 'Тренер',
              special_mention: 'Универсальный боец с железной волей',
              is_featured: false,
              is_active: true,
              sort_order: 3,
              created: '2025-01-15T00:00:00Z',
              updated: '2025-01-15T00:00:00Z'
            },
            {
              id: '4',
              athlete_name: 'Анна Козлова',
              sport_type: 'Бокс',
              achievements: '<p><strong>Чемпионка России по боксу 2021-2022</strong></p><p>Серебряный призер чемпионата Европы 2021</p><p>Мастер спорта России</p><p>Победительница 15 профессиональных боев</p>',
              photo: 'mock-photo-4.jpg',
              rank: 4,
              years_active: '2016-2023',
              current_status: 'Завершил карьеру',
              special_mention: 'Легенда женского бокса',
              is_featured: false,
              is_active: true,
              sort_order: 4,
              created: '2025-01-15T00:00:00Z',
              updated: '2025-01-15T00:00:00Z'
            },
            {
              id: '5',
              athlete_name: 'Сергей Морозов',
              sport_type: 'Кикбоксинг',
              achievements: '<p><strong>Чемпион мира по кикбоксингу 2020</strong></p><p>Золотая медаль на чемпионате Европы 2019</p><p>Мастер спорта международного класса</p><p>Тренер сборной России</p>',
              photo: 'mock-photo-5.jpg',
              rank: 5,
              years_active: '2015-настоящее время',
              current_status: 'Тренер',
              special_mention: 'Мудрый наставник и великий боец',
              is_featured: false,
              is_active: true,
              sort_order: 5,
              created: '2025-01-15T00:00:00Z',
              updated: '2025-01-15T00:00:00Z'
            },
            {
              id: '6',
              athlete_name: 'Елена Новикова',
              sport_type: 'Бокс',
              achievements: '<p><strong>Чемпионка России по боксу 2020</strong></p><p>Бронзовая медаль на чемпионате мира 2019</p><p>Мастер спорта России</p><p>Победительница 12 профессиональных боев</p>',
              photo: 'mock-photo-6.jpg',
              rank: 6,
              years_active: '2018-2022',
              current_status: 'Завершил карьеру',
              special_mention: 'Техничный боец с безупречной защитой',
              is_featured: false,
              is_active: true,
              sort_order: 6,
              created: '2025-01-15T00:00:00Z',
              updated: '2025-01-15T00:00:00Z'
            },
            {
              id: '7',
              athlete_name: 'Андрей Соколов',
              sport_type: 'Смешанные единоборства',
              achievements: '<p><strong>Чемпион России по ММА 2021</strong></p><p>Победитель турнира "Сибирский тигр" 2022</p><p>Мастер спорта по дзюдо</p><p>Кандидат в мастера спорта по кикбоксингу</p>',
              photo: 'mock-photo-7.jpg',
              rank: 7,
              years_active: '2019-настоящее время',
              current_status: 'Активный',
              special_mention: 'Молодой талант с большим потенциалом',
              is_featured: false,
              is_active: true,
              sort_order: 7,
              created: '2025-01-15T00:00:00Z',
              updated: '2025-01-15T00:00:00Z'
            },
            {
              id: '8',
              athlete_name: 'Ольга Белова',
              sport_type: 'Кикбоксинг',
              achievements: '<p><strong>Чемпионка России по кикбоксингу 2022</strong></p><p>Серебряная медаль на чемпионате Европы 2023</p><p>Мастер спорта России</p><p>Победительница 8 профессиональных боев</p>',
              photo: 'mock-photo-8.jpg',
              rank: 8,
              years_active: '2020-настоящее время',
              current_status: 'Активный',
              special_mention: 'Быстрая и точная, как молния',
              is_featured: false,
              is_active: true,
              sort_order: 8,
              created: '2025-01-15T00:00:00Z',
              updated: '2025-01-15T00:00:00Z'
            }
          ];
          setAthletes(mockData);
        } else {
          setAthletes(data);
        }
      } catch (err) {
        console.error('Error fetching hall of fame:', err);
        setError('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    fetchAthletes();
  }, []);

  if (loading) {
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

  if (error) {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-4 text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
          <p className="text-gray-400">Попробуйте обновить страницу</p>
        </div>
      </section>
    );
  }

  if (athletes.length === 0) {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-4 text-center">
          <h2 className="hero-jab-title text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
              ЗАЛ СЛАВЫ
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Скоро здесь появятся наши чемпионы!
          </p>
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
