'use client';

import { useState, useEffect } from 'react';
import { getPricingPlans, PricingPlan, stripHtmlTags } from '@/lib/pocketbase';

export default function PricingSection() {
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  useEffect(() => {
    const loadPricingPlans = async () => {
      try {
        const plans = await getPricingPlans();
        setPricingPlans(plans);
        if (plans.length > 0) {
          setSelectedPlan(plans[0].id);
        }
      } catch (error) {
        setPricingPlans([]);
      } finally {
        setLoading(false);
      }
    };

    loadPricingPlans();
  }, []);

  const formatPrice = (price: number): string => {
    return price.toLocaleString('ru-RU');
  };

  const parseFeatures = (featuresHtml: string): string[] => {
    const cleanText = stripHtmlTags(featuresHtml);
    return cleanText.split('\n').filter(line => line.trim().length > 0);
  };

  return (
    <section id="pricing" className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Красные и синие круги - адаптивные размеры */}
        <div className="absolute top-12 sm:top-20 left-4 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 bg-red-500/10 rounded-full animate-pulse"></div>
        <div className="absolute top-24 sm:top-40 right-8 sm:right-20 w-16 h-16 sm:w-24 sm:h-24 bg-blue-500/10 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-12 sm:bottom-20 left-1/4 w-12 h-12 sm:w-20 sm:h-20 bg-red-500/10 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-24 sm:bottom-40 right-1/3 w-16 h-16 sm:w-28 sm:h-28 bg-blue-500/10 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Заголовок секции */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="hero-jab-title text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
              АБОНЕМЕНТЫ
            </span>
          </h2>
          <p className="hero-jab-text text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
            Выберите подходящий абонемент для достижения ваших целей в боксе
          </p>
        </div>

        {/* Селектор тарифов */}
        {pricingPlans.length > 1 && (
          <div className="flex justify-center mb-8 sm:mb-12">
            <div className="relative">
              <div className="w-48 sm:w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-blue-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${100 / pricingPlans.length}%`,
                    marginLeft: `${(pricingPlans.findIndex(plan => plan.id === selectedPlan) * 100) / pricingPlans.length}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Карточки тарифов */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/10 rounded-2xl p-4 sm:p-6 md:p-8 animate-pulse">
                <div className="h-6 bg-white/20 rounded mb-3 sm:mb-4"></div>
                <div className="h-8 bg-white/20 rounded mb-4 sm:mb-6"></div>
                <div className="space-y-2 mb-6 sm:mb-8">
                  <div className="h-4 bg-white/20 rounded"></div>
                  <div className="h-4 bg-white/20 rounded"></div>
                  <div className="h-4 bg-white/20 rounded"></div>
                </div>
                <div className="h-12 bg-white/20 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={plan.id}
                className={`relative group bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl border transition-all duration-500 cursor-glove flex flex-col h-full hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 ${
                  plan.is_popular 
                    ? 'border-red-500/40 shadow-lg shadow-red-500/20 hover:border-red-500/60 hover:shadow-red-500/30' 
                    : 'border-gray-700/50 hover:border-blue-500/40'
                }`}
                onMouseEnter={() => setSelectedPlan(plan.id)}
              >
                {/* Бейдж для популярного тарифа */}
                {plan.is_popular && (
                  <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-red-500 text-white px-2 sm:px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider hero-jab-text">
                    {plan.popular_badge_text || 'ВЫГОДНО'}
                  </div>
                )}

                <div className="p-4 sm:p-6 md:p-8 flex flex-col h-full">
                  {/* Заголовок тарифа */}
                  <h3 className="hero-jab-text text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                    {plan.name}
                  </h3>

                  {/* Цена */}
                  <div className="mb-4 sm:mb-6">
                    <div className="flex items-baseline gap-1 sm:gap-2">
                      <span className="hero-jab-text text-3xl sm:text-4xl font-bold text-red-500">
                        {formatPrice(plan.price)}
                      </span>
                      <span className="hero-jab-text text-base sm:text-lg text-gray-300">
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  {/* Особенности */}
                  <div className="mb-6 sm:mb-8 flex-grow">
                    {parseFeatures(plan.features).map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                        <p className="hero-jab-text text-gray-300 leading-relaxed text-sm sm:text-base">
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Кнопка покупки */}
                  {plan.payment_link ? (
                    <a
                      href={plan.payment_link}
                      target={plan.link_target || '_self'}
                      rel={plan.link_target === '_blank' ? 'noopener noreferrer' : undefined}
                      className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 hero-jab-text mt-auto text-sm sm:text-base cursor-glove text-center block ${
                        plan.is_popular 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-transparent border border-white text-white hover:bg-white hover:text-black'
                      }`}
                    >
                      {plan.button_text}
                    </a>
                  ) : (
                    <button
                      className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 hero-jab-text mt-auto text-sm sm:text-base cursor-glove ${
                        plan.is_popular 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-transparent border border-white text-white hover:bg-white hover:text-black'
                      }`}
                    >
                      {plan.button_text}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Дополнительная информация */}
        <div className="text-center mt-12 sm:mt-16">
          <p className="hero-jab-text text-gray-400 text-sm sm:text-base md:text-lg px-4">
            Все абонементы включают доступ к залу, оборудованию и групповым тренировкам
          </p>
        </div>
      </div>
    </section>
  );
}
