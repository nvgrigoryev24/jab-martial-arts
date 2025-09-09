'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getNavigationLinks, getHeaderContent, NavigationLink, HeaderContent, getImageUrl } from '@/lib/pocketbase';
import { useSocialLinks } from '@/contexts/SocialLinksContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [navigationLinks, setNavigationLinks] = useState<NavigationLink[]>([]);
  const [headerContent, setHeaderContent] = useState<HeaderContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Используем контекст для социальных ссылок
  const { socialLinks, isLoading: socialLinksLoading } = useSocialLinks();
  
  // Роутер для навигации
  const router = useRouter();
  
  // Флаг для восстановления позиции скролла
  const shouldRestoreRef = useRef(true);

  // Загрузка данных из PocketBase
  useEffect(() => {
    const abortController = new AbortController();
    
    const loadHeaderData = async () => {
      try {
        const [navLinks, headerData] = await Promise.all([
          getNavigationLinks(abortController.signal),
          getHeaderContent(abortController.signal)
        ]);
        
        setNavigationLinks(navLinks);
        setHeaderContent(headerData);
      } catch (error) {
        console.error('Error loading header data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHeaderData();
    
    return () => {
      abortController.abort();
    };
  }, [socialLinks]);

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

  // Функция для прокрутки к якорю
  const scrollToId = (id: string) => {
    // Закрываем меню без восстановления предыдущей позиции
    shouldRestoreRef.current = false;
    setIsMenuOpen(false);

    const headerHeight = 80;
    // Ждём пока применятся стили после закрытия (body перестанет быть fixed)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - headerHeight;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
        // Вернём дефолт на будущее
        shouldRestoreRef.current = true;
      });
    });
  };

  // Обработка клика по ссылке
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rawHref = e.currentTarget.getAttribute('href') || '';
    const isHash = rawHref.startsWith('#');

    if (!isHash) {
      // Внутренний роутинг или внешний переход
      // Если это внутренний путь — используем router.push:
      if (rawHref.startsWith('/')) {
        e.preventDefault();
        setIsMenuOpen(false);
        router.push(rawHref);
      }
      // иначе (http/https) ничего не трогаем — пусть откроется как обычно
      return;
    }

    // Якорная ссылка: перехватываем и скроллим
    e.preventDefault();
    scrollToId(rawHref.substring(1));
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


  // Убираем динамическое вычисление высоты Header (используем фиксированные значения в CSS)
  
  // Функция для блокировки прокрутки
  const lockScroll = () => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const scrollY = window.scrollY;
    
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
    
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  };

  // Функция для разблокировки прокрутки
  const unlockScroll = () => {
    const scrollY = document.body.style.top;
    
    document.documentElement.style.overflow = '';
    document.documentElement.style.paddingRight = '';
    
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    
    // ВАЖНО: восстанавливаем позицию ТОЛЬКО если это обычное закрытие,
    // а не переход по ссылке
    if (shouldRestoreRef.current && scrollY) {
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  };

  // Блокируем прокрутку при открытом меню
  useEffect(() => {
    if (isMenuOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }
    
    return () => {
      // Очищаем стили при размонтировании компонента
      document.documentElement.style.overflow = '';
      document.documentElement.style.paddingRight = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 translate-y-0 opacity-100">
        <div className="bg-gradient-to-r from-black/95 via-gray-900/95 to-black/95 backdrop-blur-md border-b border-red-500/30 shadow-lg shadow-red-500/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Логотип */}
              <Link href="/" className="group cursor-glove w-15 h-15 flex items-center justify-center">
                <div className="transition-all duration-300 transform group-hover:scale-105">
                  {headerContent?.logo_url ? (
                    <Image
                      src={getImageUrl(headerContent, headerContent.logo_url)}
                      alt={headerContent.logo_alt || "JAB Martial Arts"}
                      width={60}
                      height={60}
                      className="w-15 h-15 object-contain"
                      priority
                    />
                  ) : (
                    <div className="w-15 h-15 flex items-center justify-center bg-gradient-to-br from-red-600 to-red-700 rounded-xl">
                      <span className="text-2xl font-bold text-white">JAB</span>
                    </div>
                  )}
                </div>
              </Link>

              {/* Десктопное меню - скрыто, используем бургер для всех */}
              <nav className="hidden">
                {isLoading ? (
                  // Показываем заглушку во время загрузки
                  <>
                    <div className="h-6 w-16 bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-6 w-20 bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-6 w-16 bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-6 w-20 bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-6 w-16 bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-6 w-20 bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-6 w-16 bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-6 w-12 bg-gray-700 rounded animate-pulse"></div>
                  </>
                ) : navigationLinks.length > 0 ? (
                  // Показываем ссылки из PocketBase
                  navigationLinks.map((link) => (
                    <a 
                      key={link.id} 
                      href={link.href} 
                      onClick={handleLinkClick} 
                      className={getLinkClasses(link.href.replace('#', ''))}
                    >
                      <span className="relative z-10">{link.title}</span>
                      <div className={getUnderlineClasses(link.href.replace('#', ''))}></div>
                    </a>
                  ))
                ) : (
                  // Fallback ссылки, если данные не загрузились
                  <>
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
                  </>
                )}
              </nav>

              {/* Социальные сети по центру */}
              <div className="flex items-center justify-center flex-1">
                {/* Социальные сети */}
                <div className="flex items-center space-x-3">
                  {isLoading || socialLinksLoading ? (
                    // Показываем заглушки во время загрузки
                    <div className="flex space-x-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-10 h-10 bg-gray-700/50 rounded-xl animate-pulse"></div>
                      ))}
                    </div>
                  ) : socialLinks.length > 0 ? (
                    // Социальные сети из PocketBase
                    socialLinks.map((social) => {
                      // Проверяем, есть ли иконка и это файл
                      const hasIcon = social.icon && social.icon.trim() !== '';
                      const imageUrl = hasIcon ? getImageUrl(social, social.icon) : '';
                      
                      return (
                        <a
                          key={social.id}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 cursor-glove group"
                          title={social.title}
                        >
                          {hasIcon && (
                            <Image
                              src={imageUrl}
                              alt={social.title}
                              width={20}
                              height={20}
                              className="w-5 h-5 object-contain filter brightness-0 invert group-hover:brightness-0 group-hover:invert group-hover:hue-rotate-[320deg] group-hover:scale-110 transition-all duration-300"
                              onError={(e) => {
                                console.error('Image load error for', social.title, ':', e);
                              }}
                            />
                          )}
                        </a>
                      );
                    })
                  ) : null}
                </div>
              </div>

              {/* Бургер-кнопка - показываем на всех устройствах */}
              <button
                className={`burger-btn w-15 h-15 flex items-center justify-center ${isMenuOpen ? 'open' : ''}`}
                onClick={() => {
                  if (!isMenuOpen) {
                    lockScroll();
                  } else {
                    unlockScroll();
                  }
                  setIsMenuOpen(!isMenuOpen);
                }}
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
          <h2 className="mobile-menu-title">{headerContent?.mobile_title || "JAB MARTIAL ARTS"}</h2>
        </div>

        {/* Навигационные ссылки */}
        <nav className="pt-4">
          {isLoading ? (
            // Заглушки во время загрузки
            <>
              <div className="h-8 w-24 bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="h-8 w-20 bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="h-8 w-16 bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="h-8 w-20 bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="h-8 w-16 bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="h-8 w-20 bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="h-8 w-20 bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="h-8 w-12 bg-gray-700 rounded animate-pulse mb-4"></div>
            </>
          ) : navigationLinks.length > 0 ? (
            // Ссылки из PocketBase
            navigationLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={handleLinkClick}
                className={`mobile-nav-link mobile-menu-item ${
                  activeSection === link.href.replace('#', '') ? 'active' : ''
                }`}
              >
                {link.title}
              </a>
            ))
          ) : (
            // Fallback ссылки
            <>
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
            </>
          )}
          
          {/* Социальные сети */}
          <div className="mobile-menu-item flex items-center justify-center space-x-4 py-4">
            {isLoading || socialLinksLoading ? (
              // Заглушки во время загрузки
              <>
                <div className="w-12 h-12 bg-gray-700 rounded-xl animate-pulse"></div>
                <div className="w-12 h-12 bg-gray-700 rounded-xl animate-pulse"></div>
              </>
            ) : socialLinks.length > 0 ? (
              // Социальные сети из PocketBase
              socialLinks.map((social) => {
                // Проверяем, есть ли иконка и это файл
                const hasIcon = social.icon && social.icon.trim() !== '';
                const imageUrl = hasIcon ? getImageUrl(social, social.icon) : '';
                
                
                return (
                  <a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 cursor-glove group"
                    title={social.title}
                  >
                    {hasIcon && (
                      <Image
                        src={imageUrl}
                        alt={social.title}
                        width={24}
                        height={24}
                        className="w-6 h-6 object-contain filter brightness-0 invert group-hover:brightness-0 group-hover:invert group-hover:hue-rotate-[320deg] group-hover:scale-110 transition-all duration-300"
                        onError={(e) => {
                          console.error('Mobile Image load error for', social.title, ':', e);
                        }}
                      />
                    )}
                  </a>
                );
              })
            ) : null}
          </div>
          
          {/* Кнопка записи */}
          <a
            href={headerContent?.cta_button_href || "#contact"}
            onClick={handleLinkClick}
            className="mobile-cta-button mobile-menu-item"
          >
            {headerContent?.cta_button_text || "Записаться на тренировку"}
          </a>
        </nav>
      </div>
    </>
  );
}


