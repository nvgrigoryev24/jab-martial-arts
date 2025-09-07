/**
 * Утилиты для плавной прокрутки
 */

export interface ScrollOptions {
  duration?: number;
  easing?: 'easeInOutQuad' | 'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic';
  offset?: number;
}

// Функции плавности
const easingFunctions = {
  easeInOutQuad: (t: number): number => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t: number): number => t * t * t,
  easeOutCubic: (t: number): number => (--t) * t * t + 1,
  easeInOutCubic: (t: number): number => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
};

/**
 * Плавная прокрутка к элементу
 */
export function smoothScrollTo(
  target: string | HTMLElement,
  options: ScrollOptions = {}
): Promise<void> {
  return new Promise((resolve) => {
    const {
      duration = 800,
      easing = 'easeInOutQuad',
      offset = 0
    } = options;

    const targetElement = typeof target === 'string' 
      ? document.querySelector(target) 
      : target;

    if (!targetElement) {
      resolve();
      return;
    }

    const startPosition = window.pageYOffset;
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
    const distance = targetPosition - startPosition;
    const startTime = performance.now();

    function animation(currentTime: number) {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easingFunctions[easing](progress);
      
      const currentPosition = startPosition + distance * ease;
      window.scrollTo(0, currentPosition);

      if (progress < 1) {
        requestAnimationFrame(animation);
      } else {
        // Дополнительная проверка точности позиционирования
        if (targetElement) {
          const finalPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
          if (Math.abs(window.pageYOffset - finalPosition) > 5) {
            window.scrollTo(0, finalPosition);
          }
          
          // Дополнительная проверка для всех секций
          const importantSections = ['coaches', 'schedule', 'pricing', 'contact'];
          if (importantSections.includes(targetElement.id)) {
            const sectionElement = document.getElementById(targetElement.id);
            if (sectionElement) {
              const rect = sectionElement.getBoundingClientRect();
              // Если секция не видна полностью, корректируем позицию
              if (rect.top < offset) {
                const correctedPosition = sectionElement.offsetTop - offset;
                window.scrollTo(0, correctedPosition);
              }
            }
          }
        }
        
        resolve();
      }
    }

    requestAnimationFrame(animation);
  });
}

/**
 * Плавная прокрутка к началу страницы
 */
export function smoothScrollToTop(options: ScrollOptions = {}): Promise<void> {
  return smoothScrollTo(document.body, { ...options, offset: 0 });
}

/**
 * Плавная прокрутка к секции по ID
 */
export function smoothScrollToSection(
  sectionId: string, 
  options: ScrollOptions = {}
): Promise<void> {
  // Правильный offset для мобильных и десктопных устройств
  const offset = window.innerWidth <= 768 ? 100 : 120; // Положительный offset для правильного позиционирования
  return smoothScrollTo(`#${sectionId}`, { ...options, offset });
}

/**
 * Инициализация плавной прокрутки для всех якорных ссылок
 */
export function initSmoothScroll(): void {
  // Обработка всех ссылок с якорями
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const link = target.closest('a[href^="#"]') as HTMLAnchorElement;
    
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    
    event.preventDefault();
    
    const sectionId = href.substring(1);
    smoothScrollToSection(sectionId, {
      duration: 600,
      easing: 'easeInOutQuad'
    });
  });
}

/**
 * Плавная прокрутка с индикатором прогресса
 */
export function smoothScrollWithProgress(
  target: string | HTMLElement,
  options: ScrollOptions & { onProgress?: (progress: number) => void } = {}
): Promise<void> {
  return new Promise((resolve) => {
    const {
      duration = 800,
      easing = 'easeInOutQuad',
      offset = 0,
      onProgress
    } = options;

    const targetElement = typeof target === 'string' 
      ? document.querySelector(target) 
      : target;

    if (!targetElement) {
      resolve();
      return;
    }

    const startPosition = window.pageYOffset;
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
    const distance = targetPosition - startPosition;
    const startTime = performance.now();

    function animation(currentTime: number) {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easingFunctions[easing](progress);
      
      window.scrollTo(0, startPosition + distance * ease);
      
      // Вызов callback с прогрессом
      if (onProgress) {
        onProgress(progress);
      }

      if (progress < 1) {
        requestAnimationFrame(animation);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(animation);
  });
}

/**
 * Получение высоты Header
 */
export function getHeaderHeight(): number {
  const header = document.querySelector('header');
  if (!header) return 100; // Fallback значение
  
  const rect = header.getBoundingClientRect();
  return rect.height;
}

/**
 * Проверка поддержки плавной прокрутки
 */
export function supportsSmoothScroll(): boolean {
  return 'scrollBehavior' in document.documentElement.style;
}

/**
 * Fallback для браузеров без поддержки CSS scroll-behavior
 */
export function initSmoothScrollFallback(): void {
  if (!supportsSmoothScroll()) {
    initSmoothScroll();
  }
}
