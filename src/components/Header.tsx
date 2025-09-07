'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { smoothScrollToSection, getHeaderHeight } from '@/lib/smoothScroll';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Отслеживание активной секции
  useEffect(() => {
    const sections = ['about', 'coaches', 'pricing', 'schedule', 'contact'];
    
    const handleSectionChange = () => {
      const headerOffset = window.innerWidth <= 768 ? 160 : 180;
      const scrollPosition = window.scrollY + headerOffset;
      
      let foundActiveSection = '';
      
      // Проверяем, находимся ли мы в hero-секции (до первой секции)
      const heroElement = document.getElementById('hero');
      if (heroElement) {
        const heroBottom = heroElement.offsetTop + heroElement.offsetHeight;
        if (scrollPosition < heroBottom) {
          // Мы в hero-секции, не устанавливаем активную секцию
          setActiveSection('');
          return;
        }
      }
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            foundActiveSection = section;
            break;
          }
        }
      }
      
      // Устанавливаем активную секцию только если мы действительно находимся в одной из секций
      setActiveSection(foundActiveSection);
    };

    window.addEventListener('scroll', handleSectionChange, { passive: true });
    handleSectionChange(); // Проверяем при загрузке
    
    return () => window.removeEventListener('scroll', handleSectionChange);
  }, []);

  // Закрытие меню при клике на оверлей
  const handleOverlayClick = () => {
    setIsMenuOpen(false);
  };

  // Обработка клика по ссылке с плавной прокруткой
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    
    // Плавная прокрутка к секции
    smoothScrollToSection(sectionId, {
      duration: 600,
      easing: 'easeInOutQuad'
    });
  };

  // Блокировка скролла при открытом меню
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Динамическое вычисление высоты Header
  useEffect(() => {
    const updateHeaderHeight = () => {
      const headerHeight = getHeaderHeight();
      document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    };

    // Обновляем при загрузке
    updateHeaderHeight();

    // Обновляем при изменении размера окна
    window.addEventListener('resize', updateHeaderHeight);

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 translate-y-0 opacity-100">
        <div className="bg-gradient-to-r from-black/95 via-gray-900/95 to-black/95 backdrop-blur-md border-b border-red-500/30 shadow-lg shadow-red-500/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Логотип */}
              <Link href="/" className="group cursor-glove">
                <div className="transition-all duration-300 transform group-hover:scale-105">
                  <Image
                    src="/jablogo.jpg"
                    alt="JAB Martial Arts"
                    width={60}
                    height={60}
                    className="rounded-full shadow-lg group-hover:shadow-red-500/25"
                    style={{ width: "auto", height: "auto" }}
                    priority
                  />
                </div>
              </Link>

              {/* Десктопное меню */}
              <nav className="hidden md:flex space-x-8">
                <a href="#about" onClick={(e) => handleLinkClick(e, 'about')} className="hero-jab-text text-white hover:text-red-400 transition-all duration-300 cursor-glove relative group">
                  <span className="relative z-10">О школе</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></div>
                </a>
                <a href="#coaches" onClick={(e) => handleLinkClick(e, 'coaches')} className="hero-jab-text text-white hover:text-red-400 transition-all duration-300 cursor-glove relative group">
                  <span className="relative z-10">Тренеры</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></div>
                </a>
                <a href="#pricing" onClick={(e) => handleLinkClick(e, 'pricing')} className="hero-jab-text text-white hover:text-red-400 transition-all duration-300 cursor-glove relative group">
                  <span className="relative z-10">Абонементы</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></div>
                </a>
                <a href="#schedule" onClick={(e) => handleLinkClick(e, 'schedule')} className="hero-jab-text text-white hover:text-red-400 transition-all duration-300 cursor-glove relative group">
                  <span className="relative z-10">Расписание</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></div>
                </a>
                <a href="#contact" onClick={(e) => handleLinkClick(e, 'contact')} className="hero-jab-text text-white hover:text-red-400 transition-all duration-300 cursor-glove relative group">
                  <span className="relative z-10">Контакты</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></div>
                </a>
              </nav>

              {/* Кнопка записи */}
              <div className="hidden md:block">
                <a
                  href="#contact"
                  onClick={(e) => handleLinkClick(e, 'contact')}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 hero-jab-text cursor-glove shadow-lg hover:shadow-red-500/25 transform hover:scale-105"
                >
                  Записаться
                </a>
              </div>

              {/* Бургер-кнопка */}
              <button
                className={`burger-btn md:hidden ${isMenuOpen ? 'open' : ''}`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Открыть меню"
              >
                <div className="burger-line"></div>
                <div className="burger-line"></div>
                <div className="burger-line"></div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Оверлей для мобильного меню */}
      <div 
        className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}
        onClick={handleOverlayClick}
      />

      {/* Мобильное меню */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        {/* Заголовок меню */}
        <div className="mobile-menu-header">
          <h2 className="mobile-menu-title">JAB MARTIAL ARTS</h2>
        </div>

        {/* Навигационные ссылки */}
        <nav className="pt-4">
          <a
            href="#about"
            onClick={(e) => handleLinkClick(e, 'about')}
            className={`mobile-nav-link mobile-menu-item ${
              activeSection === 'about' ? 'active' : ''
            }`}
          >
            О школе
          </a>
          <a
            href="#coaches"
            onClick={(e) => handleLinkClick(e, 'coaches')}
            className={`mobile-nav-link mobile-menu-item ${
              activeSection === 'coaches' ? 'active' : ''
            }`}
          >
            Тренеры
          </a>
          <a
            href="#pricing"
            onClick={(e) => handleLinkClick(e, 'pricing')}
            className={`mobile-nav-link mobile-menu-item ${
              activeSection === 'pricing' ? 'active' : ''
            }`}
          >
            Абонементы
          </a>
          <a
            href="#schedule"
            onClick={(e) => handleLinkClick(e, 'schedule')}
            className={`mobile-nav-link mobile-menu-item ${
              activeSection === 'schedule' ? 'active' : ''
            }`}
          >
            Расписание
          </a>
          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, 'contact')}
            className={`mobile-nav-link mobile-menu-item ${
              activeSection === 'contact' ? 'active' : ''
            }`}
          >
            Контакты
          </a>
          
          {/* Кнопка записи */}
          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, 'contact')}
            className="mobile-cta-button mobile-menu-item"
          >
            Записаться на тренировку
          </a>
        </nav>
      </div>
    </>
  );
}
