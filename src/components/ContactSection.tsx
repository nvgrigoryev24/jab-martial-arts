'use client';

import { useState, useEffect } from 'react';

interface ContactSectionProps {
  promoCode?: string;
}

export default function ContactSection({ promoCode }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    contactMethods: [] as string[],
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Добавляем промокод в сообщение при его получении
  useEffect(() => {
    if (promoCode) {
      setFormData(prev => ({
        ...prev,
        message: prev.message ? `${prev.message}\n\nПромокод: ${promoCode}` : `Промокод: ${promoCode}`
      }));
    }
  }, [promoCode]);

  // Автоматически скрываем статус через 4 секунды
  useEffect(() => {
    if (submitStatus === 'success' || submitStatus === 'error') {
      const timer = setTimeout(() => {
        setSubmitStatus('idle');
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const contactMethodOptions = [
    { value: 'phone', label: 'Телефон' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'telegram', label: 'Telegram' },
    { value: 'max', label: 'MAX' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Отправляем в Telegram
      const telegramResponse = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          contactMethods: formData.contactMethods,
          additionalInfo: formData.message
        }),
      });

      if (telegramResponse.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          phone: '',
          contactMethods: [],
          message: ''
        });
      } else {
        const errorData = await telegramResponse.json();
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleContactMethodChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      contactMethods: prev.contactMethods.includes(value)
        ? prev.contactMethods.filter(method => method !== value)
        : [...prev.contactMethods, value]
    }));
  };

  return (
    <section id="contact" className="relative py-12 sm:py-16 md:py-20 text-white overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Красные и синие акценты - адаптивные размеры */}
        <div className="absolute top-12 sm:top-16 left-8 sm:left-16 w-16 h-16 sm:w-24 sm:h-24 bg-red-600/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '5s'}}></div>
        <div className="absolute bottom-12 sm:bottom-16 right-8 sm:right-16 w-12 h-12 sm:w-20 sm:h-20 bg-blue-500/08 rounded-full blur-xl animate-pulse" style={{animationDelay: '5.5s'}}></div>
        <div className="absolute top-1/4 right-1/4 w-10 h-10 sm:w-16 sm:h-16 bg-red-600/06 rounded-full blur-lg animate-pulse" style={{animationDelay: '2.8s'}}></div>
        
        {/* Белые линии движения - адаптивные позиции */}
        <div className="absolute top-16 sm:top-20 left-12 sm:left-20 w-3 h-0.5 sm:w-6 sm:h-0.5 bg-white/10 transform rotate-45"></div>
        <div className="absolute bottom-16 sm:bottom-20 right-12 sm:right-20 w-5 h-0.5 sm:w-10 sm:h-0.5 bg-white/10 transform -rotate-45"></div>
        <div className="absolute top-1/2 right-1/3 w-2 h-0.5 sm:w-4 sm:h-0.5 bg-white/06 transform rotate-45"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Заголовок секции */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="hero-jab-title text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                ЗАПИСАТЬСЯ НА ТРЕНИРОВКУ
              </span>
            </h2>
            <p className="hero-jab-text text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
              ГОТОВЫ НАЧАТЬ СВОЙ ПУТЬ В ЕДИНОБОРСТВАХ? 
              ЗАПОЛНИТЕ ФОРМУ НИЖЕ, И МЫ СВЯЖЕМСЯ С ВАМИ ДЛЯ ЗАПИСИ НА ПЕРВУЮ ТРЕНИРОВКУ
            </p>
          </div>

          {/* Форма записи - занимает всю ширину */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-red-500/20 shadow-lg shadow-red-500/10">
              <h3 className="hero-jab-text text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">Форма записи</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="name" className="block hero-jab-text text-sm font-medium mb-1 sm:mb-2 text-gray-300">
                    Имя *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/40 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500/50 text-white placeholder-gray-400 hero-jab-text transition-all duration-300 cursor-glove text-sm sm:text-base"
                    placeholder="Ваше имя"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block hero-jab-text text-sm font-medium mb-1 sm:mb-2 text-gray-300">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/40 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500/50 text-white placeholder-gray-400 hero-jab-text transition-all duration-300 cursor-glove text-sm sm:text-base"
                    placeholder="+7 (XXX) XXX-XX-XX"
                  />
                </div>

                <div>
                  <label className="block hero-jab-text text-sm font-medium mb-2 sm:mb-3 text-gray-300">
                    Предпочитаемый способ связи *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {contactMethodOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 bg-black/40 border rounded-xl transition-all duration-300 cursor-glove ${
                          formData.contactMethods.includes(option.value)
                            ? 'border-red-500/70 bg-red-500/10'
                            : 'border-gray-600/50 hover:border-red-500/50'
                        }`}
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={formData.contactMethods.includes(option.value)}
                            onChange={() => handleContactMethodChange(option.value)}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 sm:w-5 sm:h-5 border-2 rounded transition-all duration-200 ${
                            formData.contactMethods.includes(option.value)
                              ? 'bg-red-500 border-red-500'
                              : 'bg-transparent border-gray-500 hover:border-red-400'
                          }`}>
                            {formData.contactMethods.includes(option.value) && (
                              <svg 
                                className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white absolute top-0.5 left-0.5" 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path 
                                  fillRule="evenodd" 
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                  clipRule="evenodd" 
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className={`hero-jab-text text-xs sm:text-sm transition-colors ${
                          formData.contactMethods.includes(option.value)
                            ? 'text-red-300'
                            : 'text-white'
                        }`}>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block hero-jab-text text-sm font-medium mb-1 sm:mb-2 text-gray-300">
                    Дополнительная информация
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/40 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500/50 text-white placeholder-gray-400 hero-jab-text transition-all duration-300 cursor-glove resize-none text-sm sm:text-base"
                    placeholder="Расскажите о своем опыте, целях или задайте вопросы..."
                  />
                </div>

                {/* Статус отправки */}
                {submitStatus === 'success' && (
                  <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-green-500/20 border border-green-500/50 text-green-300 rounded-xl hero-jab-text animate-in fade-in-0 slide-in-from-top-2 duration-300 text-sm sm:text-base">
                    ✅ Спасибо за заявку! Мы свяжемся с вами в ближайшее время.
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-xl hero-jab-text animate-in fade-in-0 slide-in-from-top-2 duration-300 text-sm sm:text-base">
                    ❌ Произошла ошибка при отправке заявки. Попробуйте еще раз или свяжитесь с нами по телефону.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300 hero-jab-text cursor-glove shadow-lg hover:shadow-red-500/25 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                >
                  {isSubmitting ? 'Отправляем...' : 'Записаться на тренировку'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
