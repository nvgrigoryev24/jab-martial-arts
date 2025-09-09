'use client';

import { useEffect, useState, useRef } from 'react';
import { getTrainers, Trainer, getImageUrl } from '@/lib/pocketbase';
import TrainerModal from './TrainerModal';

export default function TrainersSection() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    // Предотвращаем двойное выполнение в режиме разработки
    if (isLoadingRef.current) return;
    
    const abortController = new AbortController();
    isLoadingRef.current = true;
    
    const loadTrainers = async () => {
      try {
        const trainersData = await getTrainers(abortController.signal);
        
        // Проверяем, не был ли компонент размонтирован
        if (!abortController.signal.aborted) {
          setTrainers(trainersData);
        }
      } catch (error) {
        // Игнорируем ошибки отмены запроса
        if (error.name === 'AbortError' || error.message?.includes('autocancelled')) {
          return;
        }
        // Fallback to empty array if PocketBase is not available
        if (!abortController.signal.aborted) {
          setTrainers([]);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
          isLoadingRef.current = false;
        }
      }
    };

    loadTrainers();
    
    // Cleanup function для отмены запроса при размонтировании
    return () => {
      abortController.abort();
      isLoadingRef.current = false;
    };
  }, []); // Пустой массив зависимостей

  const openModal = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTrainer(null);
  };

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
    <section id="coaches" className="relative py-12 sm:py-16 md:py-20 text-white overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Красные и синие акценты - адаптивные размеры */}
        <div className="absolute top-6 sm:top-10 right-8 sm:right-20 w-16 h-16 sm:w-24 sm:h-24 bg-red-600/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-6 sm:bottom-10 left-8 sm:left-20 w-20 h-20 sm:w-28 sm:h-28 bg-blue-500/12 rounded-full blur-2xl animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/3 right-1/4 sm:right-1/3 w-12 h-12 sm:w-20 sm:h-20 bg-red-600/08 rounded-full blur-xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
        
        {/* Белые линии движения - адаптивные позиции */}
        <div className="absolute top-12 sm:top-16 right-16 sm:right-32 w-6 h-0.5 sm:w-12 sm:h-0.5 bg-white/15 transform rotate-45"></div>
        <div className="absolute bottom-12 sm:bottom-16 left-16 sm:left-32 w-8 h-0.5 sm:w-16 sm:h-0.5 bg-white/15 transform -rotate-45"></div>
        <div className="absolute top-1/2 left-4 sm:left-10 w-4 h-0.5 sm:w-8 sm:h-0.5 bg-white/10 transform rotate-45"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Заголовок секции */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="hero-jab-title text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                НАШИ ТРЕНЕРЫ
              </span>
            </h2>
            <p className="hero-jab-text text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
              ПРОФЕССИОНАЛЬНЫЕ ТРЕНЕРЫ С БОЛЬШИМ ОПЫТОМ. 
              КАЖДЫЙ ИЗ НАС - МАСТЕР СВОЕГО ДЕЛА
            </p>
          </div>

          {/* Карточки тренеров */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white/10 rounded-2xl p-4 sm:p-6 animate-pulse">
                  <div className="w-full h-48 sm:h-56 md:h-64 bg-white/20 rounded-xl mb-3 sm:mb-4"></div>
                  <div className="h-5 sm:h-6 bg-white/20 rounded mb-2"></div>
                  <div className="h-3 sm:h-4 bg-white/20 rounded mb-2"></div>
                  <div className="h-3 sm:h-4 bg-white/20 rounded mb-3 sm:mb-4"></div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="h-2.5 sm:h-3 bg-white/20 rounded"></div>
                    <div className="h-2.5 sm:h-3 bg-white/20 rounded"></div>
                    <div className="h-2.5 sm:h-3 bg-white/20 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Мобильная версия - горизонтальные карточки */}
              <div className="block sm:hidden space-y-4">
              {trainers.map((trainer, index) => (
                <div 
                  key={trainer.id} 
                  className="group relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl p-4 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 cursor-pointer flex min-h-36"
                  style={{animationDelay: `${index * 0.1}s`}}
                  onClick={() => openModal(trainer)}
                >
                  {/* Эффект при наведении */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 flex w-full items-center">
                    {/* Фото тренера - слева */}
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl mr-4 flex-shrink-0 flex items-center justify-center group-hover:animate-pulse overflow-hidden">
                      {trainer.photo ? (
                        <img 
                          src={getImageUrl(trainer, trainer.photo)} 
                          alt={trainer.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                          <span className="text-xl">🥊</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Информация - справа */}
                    <div className="flex flex-col flex-grow min-w-0">
                      {/* Имя */}
                      <h3 className="hero-jab-text text-base font-bold text-white mb-2 group-hover:text-red-300 transition-colors">
                        {trainer.name}
                      </h3>
                      
                      {/* Специализация */}
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium border hero-jab-text ${getSpecializationColor(trainer.specialization)} mb-2`}>
                        {trainer.specialization}
                      </div>
                      
                      {/* Опыт */}
                      <div className="hero-jab-text text-xs text-gray-400 mb-2">
                        Опыт: {trainer.experience_years} лет
                      </div>
                      
                      {/* Краткая биография */}
                      {trainer.short_bio && (
                        <div>
                          <p className="hero-jab-text text-gray-300 text-xs leading-relaxed line-clamp-2">
                            {trainer.short_bio}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              </div>

            {/* Десктопная версия - вертикальные карточки */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {trainers.map((trainer, index) => (
                <div 
                  key={trainer.id} 
                  className="group relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 cursor-pointer flex flex-col h-full"
                  style={{animationDelay: `${index * 0.1}s`}}
                  onClick={() => openModal(trainer)}
                >
                  {/* Эффект при наведении */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Фото тренера */}
                    <div className="w-full h-40 md:h-56 lg:h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl mb-2 sm:mb-3 md:mb-4 flex items-center justify-center group-hover:animate-pulse overflow-hidden">
                      {trainer.photo ? (
                        <img 
                          src={getImageUrl(trainer, trainer.photo)} 
                          alt={trainer.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                          <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">🥊</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Имя и специализация */}
                    <h3 className="hero-jab-text text-base sm:text-lg md:text-xl font-bold text-white mb-1 sm:mb-2 group-hover:text-red-300 transition-colors">
                      {trainer.name}
                    </h3>
                    
                    <div className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium border hero-jab-text ${getSpecializationColor(trainer.specialization)} mb-1 sm:mb-2`}>
                      {trainer.specialization}
                    </div>
                    
                    {/* Опыт */}
                    <div className="hero-jab-text text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">
                      Опыт: {trainer.experience_years} лет
                    </div>
                    
                    {/* Краткая биография */}
                    {trainer.short_bio && (
                      <div className="flex-grow mb-3 sm:mb-4">
                        <p className="hero-jab-text text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-3">
                          {trainer.short_bio}
                        </p>
                      </div>
                    )}
                    
                  </div>
                </div>
              ))}
              </div>

            </>
          )}
        </div>

        {/* Кнопка записи */}
        <div className="text-center mt-8 sm:mt-12">
          <a 
            href="#contact" 
            className="btn-jab bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-glove hero-jab-text w-full sm:w-auto inline-block text-center"
          >
            Записаться на тренировку
          </a>
        </div>
      </div>

      {/* Модальное окно тренера */}
      <TrainerModal
        trainer={selectedTrainer}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  );
}