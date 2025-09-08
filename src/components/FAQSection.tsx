'use client';

import { useState, useEffect } from 'react';
import { getFAQCategories, getFAQs, FAQ, FAQCategory, getColorThemeStyles, sanitizeHtmlForDisplay } from '@/lib/pocketbase';

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [faqCategories, setFaqCategories] = useState<FAQCategory[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка данных FAQ из PocketBase
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchFAQData = async () => {
      try {
        const [categoriesData, faqsData] = await Promise.all([
          getFAQCategories(abortController.signal),
          getFAQs(abortController.signal)
        ]);
        
        setFaqCategories(categoriesData);
        setFaqs(faqsData);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching FAQ data:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFAQData();

    return () => {
      abortController.abort();
    };
  }, []);

  // Создаем категории для фильтрации (включая "Все вопросы")
  const categories = [
    { id: 'all', name: 'Все вопросы' },
    ...displayCategories.map(category => ({
      id: category.id,
      name: category.name
    }))
  ];

  const filteredFAQ = selectedCategory === 'all' 
    ? displayFAQs 
    : displayFAQs.filter(item => item.faq_category === selectedCategory);

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      // Если элемент уже открыт, закрываем его
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      // Если элемент закрыт, открываем только его (закрываем все остальные)
      return [id];
    });
  };

  const getCategoryColor = (faq: FAQ) => {
    const category = displayCategories.find(cat => cat.id === faq.faq_category);
    if (category?.expand?.color_theme) {
      const theme = category.expand.color_theme;
      // Используем простые цвета для начала
      switch (theme.name?.toLowerCase()) {
        case 'red':
          return 'bg-red-500/20 text-red-300 border-red-500/30';
        case 'blue':
          return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
        case 'green':
          return 'bg-green-500/20 text-green-300 border-green-500/30';
        case 'purple':
          return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
        case 'orange':
          return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
        case 'yellow':
          return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
        default:
          return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      }
    }
    return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getCategoryName = (faq: FAQ) => {
    const category = displayCategories.find(cat => cat.id === faq.faq_category);
    return category?.name || 'Без категории';
  };

  // Fallback данные если PocketBase не работает
  const fallbackFAQs: FAQ[] = [
    {
      id: 'fallback-1',
      question: 'Сколько стоит первая тренировка?',
      answer: 'Первая тренировка в нашей школе абсолютно бесплатна!',
      faq_category: 'fallback-pricing',
      is_active: true,
      sort_order: 1,
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    },
    {
      id: 'fallback-2',
      question: 'В каких залах проходят тренировки?',
      answer: 'У нас есть два спортивных зала: "Локомотив" и "Сопка".',
      faq_category: 'fallback-training',
      is_active: true,
      sort_order: 2,
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    }
  ];

  const fallbackCategories: FAQCategory[] = [
    {
      id: 'fallback-pricing',
      name: 'Цены и оплата',
      slug: 'pricing',
      description: 'Вопросы о стоимости',
      color_theme: 'red',
      is_active: true,
      sort_order: 1,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      expand: {
        color_theme: { name: 'red' } as any
      }
    },
    {
      id: 'fallback-training',
      name: 'Тренировки',
      slug: 'training',
      description: 'Вопросы о тренировках',
      color_theme: 'blue',
      is_active: true,
      sort_order: 2,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      expand: {
        color_theme: { name: 'blue' } as any
      }
    }
  ];

  // Используем fallback данные если нет данных из PocketBase
  const displayFAQs = faqs.length > 0 ? faqs : fallbackFAQs;
  const displayCategories = faqCategories.length > 0 ? faqCategories : fallbackCategories;

  // Показываем индикатор загрузки только если данные еще загружаются
  if (loading && faqs.length === 0) {
    return (
      <section id="faq" className="relative py-20 text-white overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="faq" className="relative py-20 text-white overflow-hidden">
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
        <div className="max-w-4xl mx-auto">
          {/* Заголовок секции */}
          <div className="text-center mb-16">
            <h2 className="hero-jab-title text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ
              </span>
            </h2>
            <p className="hero-jab-text text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              ОТВЕТЫ НА САМЫЕ ПОПУЛЯРНЫЕ ВОПРОСЫ О НАШЕЙ ШКОЛЕ. 
              ЕСЛИ НЕ НАШЛИ ОТВЕТ - СВЯЖИТЕСЬ С НАМИ
            </p>
          </div>

          {/* Фильтр по категориям */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-glove hero-jab-text ${
                    selectedCategory === category.id
                      ? 'bg-red-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>



          {/* FAQ список в две колонки */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            {filteredFAQ.map((item, index) => (
              <div 
                key={`faq-${item.id}-${index}`}
                className="group bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl border border-red-500/20 hover:border-red-500/40 transition-all duration-300 cursor-glove self-start"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-red-500/5 transition-colors duration-300 cursor-glove"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border hero-jab-text ${getCategoryColor(item)}`}>
                        {getCategoryName(item)}
                      </span>
                    </div>
                    <h3 className="hero-jab-text text-base font-semibold text-white group-hover:text-red-300 transition-colors">
                      {item.question}
                    </h3>
                  </div>
                  <div className={`ml-3 transform transition-transform duration-300 ${openItems.includes(item.id) ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${openItems.includes(item.id) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-4 pb-4">
                    <div className="border-t border-red-500/20 pt-3">
                      <div 
                        className="hero-jab-text text-gray-300 leading-relaxed text-sm"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtmlForDisplay(item.answer)
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Дополнительная информация */}
          <div className="mt-16 text-center">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20">
              <h3 className="hero-jab-text text-2xl font-bold text-white mb-4">
                НЕ НАШЛИ ОТВЕТ НА СВОЙ ВОПРОС?
              </h3>
              <p className="hero-jab-text text-gray-300 mb-6 max-w-2xl mx-auto">
                Свяжитесь с нами любым удобным способом, и мы с радостью ответим на все ваши вопросы
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="#contact"
                  className="btn-jab bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-glove hero-jab-text smooth-scroll inline-block text-center"
                >
                  Связаться с нами
                </a>
                <a 
                  href="#contact"
                  className="btn-jab border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 cursor-glove hero-jab-text smooth-scroll inline-block text-center"
                >
                  Записаться на тренировку
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
