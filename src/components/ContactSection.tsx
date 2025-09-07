'use client';

import { useState, useEffect } from 'react';
import { submitContact } from '@/lib/pocketbase';

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
        // Также пытаемся сохранить в PocketBase (опционально)
        try {
          await submitContact({
            name: formData.name,
            phone: formData.phone,
            contact_methods: formData.contactMethods.join(', '),
            message: formData.message || undefined
          });
        } catch (pocketbaseError) {
        }

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Форма записи */}
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

            {/* Контактная информация */}
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h3 className="hero-jab-text text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">Контакты</h3>
                
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-br from-gray-900/30 to-black/30 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-red-500/30 transition-all duration-300 cursor-glove">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="hero-jab-text font-semibold text-base sm:text-lg text-white">Телефон</h4>
                      <p className="hero-jab-text text-gray-300 text-sm sm:text-base">+7 (XXX) XXX-XX-XX</p>
                      <p className="hero-jab-text text-gray-400 text-xs sm:text-sm">Пн-Вс: 7:00 - 22:00</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-br from-gray-900/30 to-black/30 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-red-500/30 transition-all duration-300 cursor-glove">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="hero-jab-text font-semibold text-base sm:text-lg text-white">Email</h4>
                      <p className="hero-jab-text text-gray-300 text-sm sm:text-base">info@jab-martial-arts.ru</p>
                      <p className="hero-jab-text text-gray-400 text-xs sm:text-sm">Ответим в течение часа</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-br from-gray-900/30 to-black/30 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-red-500/30 transition-all duration-300 cursor-glove">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="hero-jab-text font-semibold text-base sm:text-lg text-white">Адрес</h4>
                      <p className="hero-jab-text text-gray-300 text-sm sm:text-base">Адрес школы единоборств</p>
                      <p className="hero-jab-text text-gray-400 text-xs sm:text-sm">Удобная парковка</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Социальные сети */}
              <div>
                <h3 className="hero-jab-text text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Мы в соцсетях</h3>
                <div className="flex space-x-3 sm:space-x-4">
                  <a href="#" className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-900/50 to-black/50 hover:from-red-500/20 hover:to-red-600/20 rounded-xl flex items-center justify-center transition-all duration-300 border border-gray-600/50 hover:border-red-500/50 cursor-glove shadow-lg hover:shadow-red-500/25">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 hover:text-red-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-900/50 to-black/50 hover:from-red-500/20 hover:to-red-600/20 rounded-xl flex items-center justify-center transition-all duration-300 border border-gray-600/50 hover:border-red-500/50 cursor-glove shadow-lg hover:shadow-red-500/25">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 hover:text-red-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-900/50 to-black/50 hover:from-red-500/20 hover:to-red-600/20 rounded-xl flex items-center justify-center transition-all duration-300 border border-gray-600/50 hover:border-red-500/50 cursor-glove shadow-lg hover:shadow-red-500/25">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 hover:text-red-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
