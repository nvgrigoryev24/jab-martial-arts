'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaVk } from 'react-icons/fa';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Отслеживание активной секции при скролле
  useEffect(() => {
    const sections = ['about', 'hall-of-fame', 'coaches', 'pricing', 'news', 'schedule', 'locations', 'faq', 'contact'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Проверяем при загрузке

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Закрытие меню при клике на оверлей
  const handleOverlayClick = () => {
    setIsMenuOpen(false);
  };

  // Обработка клика по ссылке с плавной прокруткой
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsMenuOpen(false);
    
    const href = e.currentTarget.getAttribute('href');
    if (href && href.startsWith('#')) {
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const headerHeight = 80; // Высота хедера
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  // Функция для генерации классов ссылок
  const getLinkClasses = (sectionId: string) => {
    return `hero-jab-text transition-all duration-300 cursor-glove relative group flex items-center space-x-1 ${
      activeSection === sectionId 
        ? 'text-red-400' 
        : 'text-white hover:text-red-400'
    }`;
  };

  // Функция для генерации классов подчеркивания
  const getUnderlineClasses = (sectionId: string) => {
    return `absolute bottom-0 left-0 h-0.5 bg-red-500 transition-all duration-300 ${
      activeSection === sectionId 
        ? 'w-full' 
        : 'w-0 group-hover:w-full'
    }`;
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

  // Убираем динамическое вычисление высоты Header (используем фиксированные значения в CSS)

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
              <nav className="hidden lg:flex space-x-6">
                <a href="#about" onClick={handleLinkClick} className={getLinkClasses('about')}>
                  <span className="relative z-10">О школе</span>
                  <div className={getUnderlineClasses('about')}></div>
                </a>
                <a href="#hall-of-fame" onClick={handleLinkClick} className={getLinkClasses('hall-of-fame')}>
                  <span className="relative z-10">Зал славы</span>
                  <div className={getUnderlineClasses('hall-of-fame')}></div>
                </a>
                <a href="#coaches" onClick={handleLinkClick} className={getLinkClasses('coaches')}>
                  <span className="relative z-10">Тренеры</span>
                  <div className={getUnderlineClasses('coaches')}></div>
                </a>
                <a href="#pricing" onClick={handleLinkClick} className={getLinkClasses('pricing')}>
                  <span className="relative z-10">Абонементы</span>
                  <div className={getUnderlineClasses('pricing')}></div>
                </a>
                <a href="#news" onClick={handleLinkClick} className={getLinkClasses('news')}>
                  <span className="relative z-10">Новости</span>
                  <div className={getUnderlineClasses('news')}></div>
                </a>
                <a href="#schedule" onClick={handleLinkClick} className={getLinkClasses('schedule')}>
                  <span className="relative z-10">Расписание</span>
                  <div className={getUnderlineClasses('schedule')}></div>
                </a>
                <a href="#locations" onClick={handleLinkClick} className={getLinkClasses('locations')}>
                  <span className="relative z-10">Залы</span>
                  <div className={getUnderlineClasses('locations')}></div>
                </a>
                <a href="#faq" onClick={handleLinkClick} className={getLinkClasses('faq')}>
                  <span className="relative z-10">FAQ</span>
                  <div className={getUnderlineClasses('faq')}></div>
                </a>
              </nav>

              {/* Социальные сети и кнопка записи */}
              <div className="hidden md:flex items-center space-x-4">
                {/* Социальные сети */}
                <div className="flex items-center space-x-3">
                  <a
                    href="https://t.me/jab_martial_arts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gradient-to-br from-gray-900/50 to-black/50 hover:from-red-500/20 hover:to-red-600/20 rounded-xl flex items-center justify-center transition-all duration-300 cursor-glove shadow-lg hover:shadow-red-500/25 group"
                    title="Telegram"
                  >
                    <span className="text-lg">📱</span>
                  </a>
                  <a
                    href="https://vk.com/jab_martial_arts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gradient-to-br from-gray-900/50 to-black/50 hover:from-blue-500/20 hover:to-blue-600/20 rounded-xl flex items-center justify-center transition-all duration-300 cursor-glove shadow-lg hover:shadow-blue-500/25 group"
                    title="VKontakte"
                  >
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-blue-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1.01-1.49-.864-1.49-.864s-.525.033-.525.66c0 .66.033.99.033 1.49 0 .33-.198.66-.66.66h-1.49c-.33 0-.66-.198-.66-.66V9.66c0-.33.198-.66.66-.66h1.49c.33 0 .66.198.66.66v.66c0 .33.198.66.66.66h.66c.33 0 .66.198.66.66v1.49c0 .33-.198.66-.66.66h-.66c-.33 0-.66.198-.66.66v.66c0 .33.198.66.66.66h.66c.33 0 .66.198.66.66v1.49c0 .33-.198.66-.66.66z"/>
                    </svg>
                  </a>
                </div>

                {/* Кнопка записи */}
                <a
                  href="#contact"
                  onClick={handleLinkClick}
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
            onClick={handleLinkClick}
            className={`mobile-nav-link mobile-menu-item ${
              activeSection === 'about' ? 'active' : ''
            }`}
          >
            О школе
          </a>
          <a
            href="#hall-of-fame"
            onClick={handleLinkClick}
            className={`mobile-nav-link mobile-menu-item ${
              activeSection === 'hall-of-fame' ? 'active' : ''
            }`}
          >
            Зал славы
          </a>
          <a
            href="#coaches"
            onClick={handleLinkClick}
            className={`mobile-nav-link mobile-menu-item ${
              activeSection === 'coaches' ? 'active' : ''
            }`}
          >
            Тренеры
          </a>
          <a
            href="#pricing"
            onClick={handleLinkClick}
            className={`mobile-nav-link mobile-menu-item ${
              activeSection === 'pricing' ? 'active' : ''
            }`}
          >
            Абонементы
          </a>
          <a
            href="#news"
            onClick={handleLinkClick}
            className={`mobile-nav-link mobile-menu-item ${
              activeSection === 'news' ? 'active' : ''
            }`}
          >
            Новости
          </a>
          <a
            href="#schedule"
            onClick={handleLinkClick}
            className={`mobile-nav-link mobile-menu-item ${
              activeSection === 'schedule' ? 'active' : ''
            }`}
          >
            Расписание
          </a>
          <a
            href="#locations"
            onClick={handleLinkClick}
            className={`mobile-nav-link mobile-menu-item ${
              activeSection === 'locations' ? 'active' : ''
            }`}
          >
            Наши залы
          </a>
          <a
            href="#faq"
            onClick={handleLinkClick}
            className={`mobile-nav-link mobile-menu-item ${
              activeSection === 'faq' ? 'active' : ''
            }`}
          >
            FAQ
          </a>
          
          {/* Социальные сети */}
          <div className="mobile-menu-item flex items-center justify-center space-x-4 py-4">
            <a
              href="https://t.me/jab_martial_arts"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-gradient-to-br from-gray-900/50 to-black/50 hover:from-red-500/20 hover:to-red-600/20 rounded-xl flex items-center justify-center transition-all duration-300 border border-gray-600/50 hover:border-red-500/50 cursor-glove shadow-lg hover:shadow-red-500/25 group"
              title="Telegram"
            >
              <svg className="w-6 h-6 text-gray-300 group-hover:text-red-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </a>
            <a
              href="https://vk.com/jab_martial_arts"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-gradient-to-br from-gray-900/50 to-black/50 hover:from-blue-500/20 hover:to-blue-600/20 rounded-xl flex items-center justify-center transition-all duration-300 border border-gray-600/50 hover:border-blue-500/50 cursor-glove shadow-lg hover:shadow-blue-500/25 group"
              title="VKontakte"
            >
              <FaVk className="w-6 h-6 text-gray-300 group-hover:text-blue-300 transition-colors" />
            </a>
          </div>
          
          {/* Кнопка записи */}
          <a
            href="#contact"
            onClick={handleLinkClick}
            className="mobile-cta-button mobile-menu-item"
          >
            Записаться на тренировку
          </a>
        </nav>
      </div>
    </>
  );
}
