'use client';

import { useEffect, useState } from 'react';
import { getTrainers, Trainer } from '@/lib/pocketbase';

export default function TrainersSection() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Принудительно используем моковые данные для демонстрации
    console.log('Loading mock trainers data...');
    
    const mockData = [
      {
        id: '1',
        name: 'Иван Петров',
        specialization: 'Бокс, ММА',
        experience: 12,
        description: 'Мастер спорта по боксу, чемпион России. Опыт тренерской работы 8 лет. Специализируется на технике ударов и тактике ведения боя.',
        photo: '/trainer1.jpg',
        achievements: [
          'Чемпион России по боксу 2018-2020',
          'Мастер спорта международного класса',
          'Сертифицированный тренер WBC',
          'Более 200 учеников'
        ],
        created: '',
        updated: ''
      },
      {
        id: '2',
        name: 'Алексей Сидоров',
        specialization: 'ММА, Кикбоксинг',
        experience: 10,
        description: 'Профессиональный боец ММА, участник турниров UFC. Специализируется на смешанных единоборствах и подготовке к соревнованиям.',
        photo: '/trainer2.jpg',
        achievements: [
          'Участник турниров UFC',
          'Чемпион Европы по ММА',
          'Мастер спорта по кикбоксингу',
          'Опыт в профессиональном спорте 10 лет'
        ],
        created: '',
        updated: ''
      },
      {
        id: '3',
        name: 'Мария Козлова',
        specialization: 'Кикбоксинг, Фитнес',
        experience: 8,
        description: 'Чемпионка мира по кикбоксингу, специалист по женскому фитнесу. Помогает девушкам обрести уверенность в себе через спорт.',
        photo: '/trainer3.jpg',
        achievements: [
          'Чемпионка мира по кикбоксингу 2021',
          'Мастер спорта международного класса',
          'Сертифицированный тренер по фитнесу',
          'Автор программы "Женский бокс"'
        ],
        created: '',
        updated: ''
      },
      {
        id: '4',
        name: 'Дмитрий Волков',
        specialization: 'Бокс, Самооборона',
        experience: 15,
        description: 'Ветеран спорта, тренер с большим опытом. Специализируется на самообороне и подготовке начинающих спортсменов.',
        photo: '/trainer4.jpg',
        achievements: [
          'Заслуженный тренер России',
          'Мастер спорта по боксу',
          'Инструктор по самообороне',
          'Опыт тренерской работы 15 лет'
        ],
        created: '',
        updated: ''
      }
    ];

    setTrainers(mockData);
    setLoading(false);
    console.log('Mock trainers data loaded:', mockData.length, 'records');
  }, []);

  const getSpecializationColor = (specialization: string) => {
    if (specialization.includes('Бокс')) {
      return 'bg-red-500/20 text-red-300 border-red-500/30';
    } else if (specialization.includes('ММА')) {
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    } else if (specialization.includes('Кикбоксинг')) {
      return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    } else {
      return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <section id="trainers" className="relative py-20 text-white overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Красные и синие акценты */}
        <div className="absolute top-10 right-20 w-24 h-24 bg-red-600/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-10 left-20 w-28 h-28 bg-blue-500/12 rounded-full blur-2xl animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-red-600/08 rounded-full blur-xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
        
        {/* Белые линии движения */}
        <div className="absolute top-16 right-32 w-12 h-0.5 bg-white/15 transform rotate-45"></div>
        <div className="absolute bottom-16 left-32 w-16 h-0.5 bg-white/15 transform -rotate-45"></div>
        <div className="absolute top-1/2 left-10 w-8 h-0.5 bg-white/10 transform rotate-45"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Заголовок секции */}
          <div className="text-center mb-16">
            <h2 className="hero-jab-title text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                НАШИ ТРЕНЕРЫ
              </span>
            </h2>
            <p className="hero-jab-text text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              ПРОФЕССИОНАЛЬНЫЕ ТРЕНЕРЫ С БОЛЬШИМ ОПЫТОМ. 
              КАЖДЫЙ ИЗ НАС - МАСТЕР СВОЕГО ДЕЛА
            </p>
          </div>

          {/* Карточки тренеров */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white/10 rounded-2xl p-6 animate-pulse">
                  <div className="w-full h-64 bg-white/20 rounded-xl mb-4"></div>
                  <div className="h-6 bg-white/20 rounded mb-2"></div>
                  <div className="h-4 bg-white/20 rounded mb-2"></div>
                  <div className="h-4 bg-white/20 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-white/20 rounded"></div>
                    <div className="h-3 bg-white/20 rounded"></div>
                    <div className="h-3 bg-white/20 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {trainers.map((trainer, index) => (
                <div 
                  key={trainer.id} 
                  className="group relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 cursor-glove flex flex-col h-full"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {/* Эффект при наведении */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Фото тренера */}
                    <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl mb-4 flex items-center justify-center group-hover:animate-pulse">
                      <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                        <span className="text-4xl">🥊</span>
                      </div>
                    </div>
                    
                    {/* Имя и специализация */}
                    <h3 className="hero-jab-text text-xl font-bold text-white mb-2 group-hover:text-red-300 transition-colors">
                      {trainer.name}
                    </h3>
                    
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium border hero-jab-text ${getSpecializationColor(trainer.specialization)} mb-3`}>
                      {trainer.specialization}
                    </div>
                    
                    {/* Опыт */}
                    <div className="hero-jab-text text-sm text-gray-400 mb-3">
                      Опыт: {trainer.experience} лет
                    </div>
                    
                    {/* Описание */}
                    <p className="hero-jab-text text-gray-300 text-sm leading-relaxed mb-4 flex-grow">
                      {trainer.description}
                    </p>
                    
                    {/* Достижения */}
                    <div className="space-y-2">
                      <h4 className="hero-jab-text text-sm font-semibold text-red-400">
                        Достижения:
                      </h4>
                      <ul className="space-y-1">
                        {trainer.achievements.slice(0, 2).map((achievement, idx) => (
                          <li key={idx} className="hero-jab-text text-xs text-gray-400 flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            {achievement}
                          </li>
                        ))}
                        {trainer.achievements.length > 2 && (
                          <li className="hero-jab-text text-xs text-gray-500">
                            +{trainer.achievements.length - 2} других достижений
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Дополнительная информация */}
          <div className="mt-16 text-center">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20">
              <h3 className="hero-jab-text text-2xl font-bold text-white mb-4">
                ХОТИТЕ ЗАНИМАТЬСЯ С НАШИМИ ТРЕНЕРАМИ?
              </h3>
              <p className="hero-jab-text text-gray-300 mb-6 max-w-2xl mx-auto">
                Запишитесь на первую бесплатную тренировку и познакомьтесь с нашими тренерами лично
              </p>
              <button className="btn-jab bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-glove hero-jab-text">
                Записаться на тренировку
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
