'use client';

import { useState } from 'react';

const pricingPlans = [
  {
    id: 'beginners',
    title: 'Новички',
    price: '4 500',
    period: 'в месяц',
    features: [
      'любое количество тренировок в любое время по расписанию'
    ],
    isPopular: true,
    buttonText: 'Купить',
    buttonStyle: 'bg-red-500 hover:bg-red-600 text-white'
  },
  {
    id: 'experienced',
    title: 'Опытные',
    price: '5 900',
    period: 'в месяц',
    features: [
      'неограниченное количество тренировок в любое время по расписанию'
    ],
    isPopular: false,
    buttonText: 'Купить',
    buttonStyle: 'bg-transparent border border-white text-white hover:bg-white hover:text-black'
  },
  {
    id: 'individual',
    title: 'Индивидуально',
    price: '5 000',
    period: 'за 10 занятий',
    features: [
      'всего 500 рублей за занятие'
    ],
    isPopular: false,
    buttonText: 'Купить',
    buttonStyle: 'bg-transparent border border-white text-white hover:bg-white hover:text-black'
  }
];

export default function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState('beginners');

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Красные и синие круги */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-red-500/10 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-blue-500/10 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        
        {/* Белые линии */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Заголовок секции */}
        <div className="text-center mb-16">
          <h2 className="hero-jab-title text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
              АБОНЕМЕНТЫ
            </span>
          </h2>
          <p className="hero-jab-text text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Выберите подходящий абонемент для достижения ваших целей в боксе
          </p>
        </div>

        {/* Селектор тарифов */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-blue-500 rounded-full transition-all duration-300"
                style={{
                  width: selectedPlan === 'beginners' ? '33.33%' : 
                         selectedPlan === 'experienced' ? '66.66%' : '100%',
                  marginLeft: selectedPlan === 'beginners' ? '0%' : 
                              selectedPlan === 'experienced' ? '33.33%' : '66.66%'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Карточки тарифов */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative group bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl border transition-all duration-300 cursor-glove flex flex-col h-full ${
                plan.isPopular 
                  ? 'border-red-500/40 shadow-lg shadow-red-500/20' 
                  : 'border-gray-700/50 hover:border-gray-600/50'
              }`}
              onMouseEnter={() => setSelectedPlan(plan.id)}
            >
              {/* Бейдж "ВЫГОДНО" для популярного тарифа */}
              {plan.isPopular && (
                <div className="absolute -top-3 -right-3 bg-red-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider hero-jab-text">
                  ВЫГОДНО
                </div>
              )}

              <div className="p-8 flex flex-col h-full">
                {/* Заголовок тарифа */}
                <h3 className="hero-jab-text text-2xl font-bold text-white mb-4">
                  {plan.title}
                </h3>

                {/* Цена */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="hero-jab-text text-4xl font-bold text-red-500">
                      {plan.price}
                    </span>
                    <span className="hero-jab-text text-lg text-gray-300">
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* Особенности */}
                <div className="mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3 mb-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="hero-jab-text text-gray-300 leading-relaxed">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Кнопка покупки */}
                <button
                  className={`w-full py-4 px-6 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 hero-jab-text mt-auto ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Дополнительная информация */}
        <div className="text-center mt-16">
          <p className="hero-jab-text text-gray-400 text-lg">
            Все абонементы включают доступ к залу, оборудованию и групповым тренировкам
          </p>
        </div>
      </div>
    </section>
  );
}
