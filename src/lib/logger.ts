// Утилита для логирования с поддержкой разных уровней в dev/prod

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const isDev = process.env.NODE_ENV === 'development';
const logLevel = process.env.NEXT_PUBLIC_LOG_LEVEL || (isDev ? 'info' : 'error');

const logLevels: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const shouldLog = (level: LogLevel): boolean => {
  return logLevels[level] <= logLevels[logLevel as LogLevel];
};

export const logger = {
  error: (...args: any[]) => {
    if (shouldLog('error')) {
      console.error('[ERROR]', ...args);
    }
  },
  warn: (...args: any[]) => {
    if (shouldLog('warn')) {
      console.warn('[WARN]', ...args);
    }
  },
  info: (...args: any[]) => {
    if (shouldLog('info')) {
      console.log('[INFO]', ...args);
    }
  },
  debug: (...args: any[]) => {
    if (shouldLog('debug')) {
      console.log('[DEBUG]', ...args);
    }
  },
};

export default logger;

