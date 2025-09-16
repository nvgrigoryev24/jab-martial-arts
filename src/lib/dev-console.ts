// Настройки консоли для dev режима
// Подавляет определенные типы логов в development

if (process.env.NODE_ENV === 'development') {
  // Сохраняем оригинальные методы консоли
  const originalWarn = console.warn;
  const originalLog = console.log;
  
  // Список паттернов для подавления
  const suppressPatterns = [
    /multi-tabs\.js.*Injected CSS loaded successfully/,
    /Fast Refresh.*rebuilding/,
    /Fast Refresh.*done in \d+ms/,
    /use client/,
    /use server/,
    /webpack-internal/,
    /react-refresh-runtime/,
    /app-bootstrap/,
    /Please replace pb\.files\.getUrl\(\) with pb\.files\.getURL\(\)/
  ];
  
  // Переопределяем console.warn
  console.warn = (...args: any[]) => {
    const message = args.join(' ');
    const shouldSuppress = suppressPatterns.some(pattern => pattern.test(message));
    
    if (!shouldSuppress) {
      originalWarn.apply(console, args);
    }
  };
  
  // Переопределяем console.log для подавления определенных сообщений
  console.log = (...args: any[]) => {
    const message = args.join(' ');
    const shouldSuppress = suppressPatterns.some(pattern => pattern.test(message));
    
    if (!shouldSuppress) {
      originalLog.apply(console, args);
    }
  };
}

export {};

