export default function AboutSection() {
  return (
    <section id="about" className="relative py-20 text-white overflow-hidden">
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
        <div className="max-w-6xl mx-auto">
          {/* Заголовок секции */}
          <div className="text-center mb-16">
            <h2 className="hero-jab-title text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                О ШКОЛЕ JAB
              </span>
            </h2>
            <p className="hero-jab-text text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              МЫ СОЗДАЕМ ПРОСТРАНСТВО, ГДЕ КАЖДЫЙ МОЖЕТ РАСКРЫТЬ СВОЙ ПОТЕНЦИАЛ 
              И ДОСТИЧЬ НОВЫХ ВЫСОТ В ЕДИНОБОРСТВАХ
            </p>
          </div>

          {/* Три карточки преимуществ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Карточка 1 - Опытные тренеры */}
            <div className="group relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 cursor-glove flex flex-col h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:animate-pulse">
                  <span className="text-3xl">🥊</span>
                </div>
                
                <h3 className="hero-jab-text text-2xl font-bold text-white mb-4 group-hover:text-red-300 transition-colors">
                  ОПЫТНЫЕ ТРЕНЕРЫ
                </h3>
                
                <p className="hero-jab-text text-gray-300 leading-relaxed mb-6 flex-grow">
                  Мастера спорта с многолетним опытом преподавания. 
                  Каждый тренер прошел профессиональную подготовку и имеет 
                  сертификаты международного уровня.
                </p>
                
                <div className="flex items-center text-red-400 group-hover:text-red-300 transition-colors mt-auto">
                  <span className="hero-jab-text text-sm font-semibold">Узнать больше</span>
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Карточка 2 - Современный зал */}
            <div className="group relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 cursor-glove flex flex-col h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:animate-pulse">
                  <span className="text-3xl">🏟️</span>
                </div>
                
                <h3 className="hero-jab-text text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                  СОВРЕМЕННЫЙ ЗАЛ
                </h3>
                
                <p className="hero-jab-text text-gray-300 leading-relaxed mb-6 flex-grow">
                  Профессиональное оборудование и безопасная среда для тренировок. 
                  Зал оснащен всем необходимым для эффективного обучения 
                  единоборствам любого уровня.
                </p>
                
                <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors mt-auto">
                  <span className="hero-jab-text text-sm font-semibold">Узнать больше</span>
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Карточка 3 - Индивидуальный подход */}
            <div className="group relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 cursor-glove flex flex-col h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:animate-pulse">
                  <span className="text-3xl">🎯</span>
                </div>
                
                <h3 className="hero-jab-text text-2xl font-bold text-white mb-4 group-hover:text-red-300 transition-colors">
                  ИНДИВИДУАЛЬНЫЙ ПОДХОД
                </h3>
                
                <p className="hero-jab-text text-gray-300 leading-relaxed mb-6 flex-grow">
                  Программы обучения адаптированы под каждого ученика. 
                  Мы учитываем ваш уровень подготовки, цели и особенности, 
                  чтобы обеспечить максимальный результат.
                </p>
                
                <div className="flex items-center text-red-400 group-hover:text-red-300 transition-colors mt-auto">
                  <span className="hero-jab-text text-sm font-semibold">Узнать больше</span>
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Дополнительная информация */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-6 py-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="hero-jab-text text-red-400 font-semibold">
                ПЕРВАЯ ТРЕНИРОВКА БЕСПЛАТНО
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
