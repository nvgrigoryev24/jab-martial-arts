'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        // В самом верху страницы - всегда показываем
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Скроллим вниз и прошли больше 100px - скрываем
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Скроллим вверх - показываем
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible || isHovered 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-full opacity-0'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
                priority
              />
            </div>
          </Link>

          {/* Десктопное меню */}
          <nav className="hidden md:flex space-x-8">
            <Link href="#about" className="hero-jab-text text-white hover:text-red-400 transition-all duration-300 cursor-glove relative group">
              <span className="relative z-10">О школе</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link href="#trainers" className="hero-jab-text text-white hover:text-red-400 transition-all duration-300 cursor-glove relative group">
              <span className="relative z-10">Тренеры</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link href="#pricing" className="hero-jab-text text-white hover:text-red-400 transition-all duration-300 cursor-glove relative group">
              <span className="relative z-10">Абонементы</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link href="#schedule" className="hero-jab-text text-white hover:text-red-400 transition-all duration-300 cursor-glove relative group">
              <span className="relative z-10">Расписание</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link href="#contact" className="hero-jab-text text-white hover:text-red-400 transition-all duration-300 cursor-glove relative group">
              <span className="relative z-10">Контакты</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
          </nav>

          {/* Кнопка записи */}
          <div className="hidden md:block">
            <Link
              href="#contact"
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 hero-jab-text cursor-glove shadow-lg hover:shadow-red-500/25 transform hover:scale-105"
            >
              Записаться
            </Link>
          </div>

          {/* Мобильное меню */}
          <button
            className="md:hidden cursor-glove p-2 rounded-lg bg-gray-800/50 hover:bg-red-500/20 transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Мобильное меню */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-700/50 pt-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="#about"
                className="hero-jab-text text-white hover:text-red-400 transition-all duration-300 cursor-glove py-2 px-4 rounded-lg hover:bg-red-500/10"
                onClick={() => setIsMenuOpen(false)}
              >
                О школе
              </Link>
              <Link
                href="#trainers"
                className="hero-jab-text text-white hover:text-red-400 transition-all duration-300 cursor-glove py-2 px-4 rounded-lg hover:bg-red-500/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Тренеры
              </Link>
              <Link
                href="#pricing"
                className="hero-jab-text text-white hover:text-red-400 transition-all duration-300 cursor-glove py-2 px-4 rounded-lg hover:bg-red-500/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Абонементы
              </Link>
              <Link
                href="#schedule"
                className="hero-jab-text text-white hover:text-red-400 transition-all duration-300 cursor-glove py-2 px-4 rounded-lg hover:bg-red-500/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Расписание
              </Link>
              <Link
                href="#contact"
                className="hero-jab-text text-white hover:text-red-400 transition-all duration-300 cursor-glove py-2 px-4 rounded-lg hover:bg-red-500/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Контакты
              </Link>
              <Link
                href="#contact"
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl transition-all duration-300 hero-jab-text text-center cursor-glove shadow-lg hover:shadow-red-500/25 transform hover:scale-105 mt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Записаться
              </Link>
            </div>
          </nav>
        )}
      </div>
      </div>
    </header>
  );
}
