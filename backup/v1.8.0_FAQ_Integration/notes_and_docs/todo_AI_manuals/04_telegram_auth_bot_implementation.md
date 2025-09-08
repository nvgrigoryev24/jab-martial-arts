# 📋 Инструкция по реализации Telegram бота для аутентификации

**Дата создания:** 9 января 2025  
**Приоритет:** 1 (первая задача)  
**Статус:** Ожидает реализации

## 🎯 Цель

Реализовать Telegram бота для аутентификации пользователей в системе JAB Martial Arts, заменив дорогую SMS аутентификацию на удобный и бесплатный способ входа через Telegram.

## 📝 Контекст проекта

- **Проект:** JAB Martial Arts - сайт школы единоборств
- **Технологии:** Next.js 15.5.2, React, TypeScript, Tailwind CSS
- **Интеграция:** PocketBase для хранения данных, Telegram Bot API
- **Стиль:** Кастомный курсор (боксерская перчатка), градиенты, анимации
- **Целевая аудитория:** Все пользователи системы (участники, тренеры, QR-генераторы)
- **Зависимости:** Базовое приложение должно быть готово

## 🔧 Задачи для реализации

### **1. Создание Telegram бота**

#### **Требования:**
- Создать бота через @BotFather
- Настроить webhook для получения обновлений
- Реализовать обработку команд и кнопок
- Интеграция с PocketBase для проверки пользователей

#### **Настройка бота через BotFather:**
```
1. Написать @BotFather в Telegram
2. Команда: /newbot
3. Имя бота: JAB Martial Arts Auth
4. Username: jab_martial_arts_auth_bot
5. Получить токен бота
6. Настроить команды:
   - /start - Начать аутентификацию
   - /help - Помощь
   - /status - Статус аутентификации
```

#### **Команды бота:**
```typescript
const BOT_COMMANDS = [
  { command: 'start', description: 'Начать аутентификацию' },
  { command: 'help', description: 'Помощь по использованию бота' },
  { command: 'status', description: 'Проверить статус аутентификации' },
  { command: 'logout', description: 'Выйти из системы' }
];
```

### **2. Структура базы данных**

#### **Коллекция: telegram_auth_sessions**
```typescript
interface TelegramAuthSession {
  id: string;
  user_id: string; // ID пользователя в PocketBase
  telegram_user_id: number; // ID пользователя в Telegram
  telegram_username?: string;
  telegram_first_name?: string;
  telegram_last_name?: string;
  phone_number?: string; // если пользователь поделился контактом
  auth_code: string; // уникальный код для аутентификации
  expires_at: string; // время истечения сессии
  is_active: boolean;
  created_at: string;
  last_used: string;
}
```

#### **Обновление коллекции users:**
```typescript
interface User {
  id: string;
  phone: string;
  name: string;
  role: 'participant' | 'trainer' | 'qr_generator';
  telegram_user_id?: number; // привязка к Telegram
  telegram_username?: string;
  created_date: string;
  last_login?: string;
  auth_method: 'telegram' | 'phone'; // способ аутентификации
}
```

### **3. Backend для бота (Node.js/Express)**

#### **Требования:**
- Обработка webhook от Telegram
- Генерация уникальных кодов аутентификации
- Интеграция с PocketBase
- Валидация пользователей

#### **Структура проекта бота:**
```
telegram-bot/
├── src/
│   ├── bot/
│   │   ├── handlers/
│   │   │   ├── startHandler.ts
│   │   │   ├── helpHandler.ts
│   │   │   ├── statusHandler.ts
│   │   │   └── contactHandler.ts
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts
│   │   │   └── validationMiddleware.ts
│   │   ├── services/
│   │   │   ├── pocketbaseService.ts
│   │   │   ├── authService.ts
│   │   │   └── codeGenerator.ts
│   │   └── bot.ts
│   ├── types/
│   │   └── telegram.ts
│   └── server.ts
├── package.json
└── .env
```

#### **Основной файл бота:**
```typescript
// src/bot/bot.ts
import { Telegraf, Context } from 'telegraf';
import { startHandler } from './handlers/startHandler';
import { helpHandler } from './handlers/helpHandler';
import { statusHandler } from './handlers/statusHandler';
import { contactHandler } from './handlers/contactHandler';
import { authMiddleware } from './middleware/authMiddleware';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

// Middleware для логирования
bot.use((ctx, next) => {
  console.log(`Update from ${ctx.from?.id}: ${ctx.message?.text || 'callback'}`);
  return next();
});

// Обработчики команд
bot.start(startHandler);
bot.help(helpHandler);
bot.command('status', statusHandler);
bot.command('logout', authMiddleware, async (ctx) => {
  // Логика выхода
});

// Обработка контактов
bot.on('contact', contactHandler);

// Обработка callback queries (кнопки)
bot.on('callback_query', async (ctx) => {
  const data = ctx.callbackQuery?.data;
  if (!data) return;

  switch (data) {
    case 'auth_confirm':
      await handleAuthConfirm(ctx);
      break;
    case 'auth_cancel':
      await handleAuthCancel(ctx);
      break;
    default:
      await ctx.answerCbQuery('Неизвестная команда');
  }
});

export { bot };
```

### **4. Обработчики команд**

#### **Обработчик команды /start:**
```typescript
// src/bot/handlers/startHandler.ts
import { Context } from 'telegraf';
import { authService } from '../services/authService';

export const startHandler = async (ctx: Context) => {
  const telegramUser = ctx.from;
  if (!telegramUser) return;

  try {
    // Проверяем, есть ли пользователь в системе
    const existingUser = await authService.findUserByTelegramId(telegramUser.id);
    
    if (existingUser) {
      // Пользователь уже зарегистрирован
      await ctx.reply(
        `Привет, ${telegramUser.first_name}! 👋\n\n` +
        `Вы уже авторизованы в системе JAB Martial Arts.\n` +
        `Ваша роль: ${getRoleDisplayName(existingUser.role)}\n\n` +
        `Используйте /status для проверки статуса или /logout для выхода.`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🔍 Проверить статус', callback_data: 'check_status' },
                { text: '🚪 Выйти', callback_data: 'logout' }
              ],
              [
                { text: '🌐 Открыть сайт', url: process.env.WEBSITE_URL }
              ]
            ]
          }
        }
      );
    } else {
      // Новый пользователь - предлагаем авторизацию
      const authCode = await authService.generateAuthCode(telegramUser);
      
      await ctx.reply(
        `Добро пожаловать в JAB Martial Arts! 🥊\n\n` +
        `Для входа в систему поделитесь контактом или используйте код авторизации.\n\n` +
        `Код авторизации: \`${authCode}\`\n\n` +
        `Этот код действителен 10 минут.`,
        {
          reply_markup: {
            keyboard: [
              [{ text: '📱 Поделиться контактом', request_contact: true }]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
          },
          parse_mode: 'Markdown'
        }
      );
    }
  } catch (error) {
    console.error('Error in start handler:', error);
    await ctx.reply('Произошла ошибка. Попробуйте позже.');
  }
};

const getRoleDisplayName = (role: string) => {
  const roleNames = {
    'participant': 'Участник',
    'trainer': 'Тренер',
    'qr_generator': 'QR-генератор'
  };
  return roleNames[role as keyof typeof roleNames] || 'Неизвестно';
};
```

#### **Обработчик контактов:**
```typescript
// src/bot/handlers/contactHandler.ts
import { Context } from 'telegraf';
import { authService } from '../services/authService';

export const contactHandler = async (ctx: Context) => {
  const contact = ctx.message?.contact;
  const telegramUser = ctx.from;
  
  if (!contact || !telegramUser) return;

  try {
    // Проверяем, есть ли пользователь с таким номером телефона
    const existingUser = await authService.findUserByPhone(contact.phone_number);
    
    if (existingUser) {
      // Привязываем Telegram к существующему пользователю
      await authService.linkTelegramToUser(existingUser.id, telegramUser, contact.phone_number);
      
      await ctx.reply(
        `✅ Успешно! Ваш Telegram привязан к аккаунту.\n\n` +
        `Имя: ${existingUser.name}\n` +
        `Роль: ${getRoleDisplayName(existingUser.role)}\n` +
        `Телефон: ${contact.phone_number}\n\n` +
        `Теперь вы можете входить в систему через Telegram!`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🌐 Открыть сайт', url: process.env.WEBSITE_URL }
              ]
            ]
          }
        }
      );
    } else {
      // Создаем нового пользователя
      const newUser = await authService.createUserFromTelegram(telegramUser, contact.phone_number);
      
      await ctx.reply(
        `🎉 Добро пожаловать в JAB Martial Arts!\n\n` +
        `Ваш аккаунт создан:\n` +
        `Имя: ${newUser.name}\n` +
        `Телефон: ${contact.phone_number}\n` +
        `Роль: Участник\n\n` +
        `Теперь вы можете пользоваться всеми возможностями системы!`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🌐 Открыть сайт', url: process.env.WEBSITE_URL }
              ]
            ]
          }
        }
      );
    }
  } catch (error) {
    console.error('Error in contact handler:', error);
    await ctx.reply('Произошла ошибка при обработке контакта. Попробуйте позже.');
  }
};
```

#### **Обработчик команды /help:**
```typescript
// src/bot/handlers/helpHandler.ts
import { Context } from 'telegraf';

export const helpHandler = async (ctx: Context) => {
  await ctx.reply(
    `🤖 *JAB Martial Arts - Помощь*\n\n` +
    `*Доступные команды:*\n` +
    `/start - Начать аутентификацию\n` +
    `/help - Показать эту справку\n` +
    `/status - Проверить статус авторизации\n` +
    `/logout - Выйти из системы\n\n` +
    `*Как пользоваться:*\n` +
    `1. Нажмите /start для начала\n` +
    `2. Поделитесь контактом или используйте код\n` +
    `3. Перейдите на сайт для использования системы\n\n` +
    `*Поддержка:*\n` +
    `Если у вас проблемы, обратитесь к администратору.`,
    { parse_mode: 'Markdown' }
  );
};
```

### **5. Сервисы для работы с PocketBase**

#### **Сервис аутентификации:**
```typescript
// src/bot/services/authService.ts
import { PocketBase } from 'pocketbase';
import { generateAuthCode } from './codeGenerator';

const pb = new PocketBase(process.env.POCKETBASE_URL);

export class AuthService {
  async findUserByTelegramId(telegramId: number) {
    try {
      const user = await pb.collection('users').getFirstListItem(
        `telegram_user_id = ${telegramId}`
      );
      return user;
    } catch (error) {
      return null;
    }
  }

  async findUserByPhone(phone: string) {
    try {
      const user = await pb.collection('users').getFirstListItem(
        `phone = "${phone}"`
      );
      return user;
    } catch (error) {
      return null;
    }
  }

  async generateAuthCode(telegramUser: any) {
    const code = generateAuthCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 минут

    await pb.collection('telegram_auth_sessions').create({
      telegram_user_id: telegramUser.id,
      telegram_username: telegramUser.username,
      telegram_first_name: telegramUser.first_name,
      telegram_last_name: telegramUser.last_name,
      auth_code: code,
      expires_at: expiresAt.toISOString(),
      is_active: true
    });

    return code;
  }

  async linkTelegramToUser(userId: string, telegramUser: any, phone: string) {
    await pb.collection('users').update(userId, {
      telegram_user_id: telegramUser.id,
      telegram_username: telegramUser.username,
      auth_method: 'telegram'
    });

    // Создаем сессию
    await pb.collection('telegram_auth_sessions').create({
      user_id: userId,
      telegram_user_id: telegramUser.id,
      telegram_username: telegramUser.username,
      telegram_first_name: telegramUser.first_name,
      telegram_last_name: telegramUser.last_name,
      phone_number: phone,
      auth_code: generateAuthCode(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 дней
      is_active: true
    });
  }

  async createUserFromTelegram(telegramUser: any, phone: string) {
    const user = await pb.collection('users').create({
      phone: phone,
      name: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim(),
      role: 'participant',
      telegram_user_id: telegramUser.id,
      telegram_username: telegramUser.username,
      auth_method: 'telegram'
    });

    // Создаем сессию
    await pb.collection('telegram_auth_sessions').create({
      user_id: user.id,
      telegram_user_id: telegramUser.id,
      telegram_username: telegramUser.username,
      telegram_first_name: telegramUser.first_name,
      telegram_last_name: telegramUser.last_name,
      phone_number: phone,
      auth_code: generateAuthCode(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true
    });

    return user;
  }

  async validateAuthCode(code: string) {
    try {
      const session = await pb.collection('telegram_auth_sessions').getFirstListItem(
        `auth_code = "${code}" && is_active = true && expires_at > "${new Date().toISOString()}"`
      );
      return session;
    } catch (error) {
      return null;
    }
  }

  async getUserByAuthCode(code: string) {
    const session = await this.validateAuthCode(code);
    if (!session || !session.user_id) return null;

    try {
      const user = await pb.collection('users').getOne(session.user_id);
      return user;
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();
```

#### **Генератор кодов:**
```typescript
// src/bot/services/codeGenerator.ts
export const generateAuthCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
```

### **6. Frontend интеграция**

#### **Компонент авторизации через Telegram:**
```typescript
// src/components/TelegramAuth.tsx
import { useState, useEffect } from 'react';
import { pb } from '@/lib/pocketbase';

const TelegramAuth = () => {
  const [authCode, setAuthCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTelegramAuth = () => {
    // Открываем Telegram бота
    const botUrl = `https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}`;
    window.open(botUrl, '_blank');
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Проверяем код через API
      const response = await fetch('/api/auth/telegram/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: authCode }),
      });

      const data = await response.json();

      if (data.success) {
        // Авторизуем пользователя
        await pb.collection('users').authWithPassword(data.user.phone, data.user.id);
        window.location.reload();
      } else {
        setError(data.message || 'Неверный код авторизации');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('Ошибка авторизации. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
      <div className="max-w-md mx-auto p-6">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🤖</div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Вход через Telegram
          </h1>
          <p className="text-gray-300">
            Быстрый и безопасный способ входа в систему
          </p>
        </div>

        <div className="space-y-6">
          {/* Кнопка открытия бота */}
          <button
            onClick={handleTelegramAuth}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg cursor-glove transition-colors flex items-center justify-center space-x-3"
          >
            <span className="text-2xl">📱</span>
            <span>Открыть Telegram бота</span>
          </button>

          <div className="text-center text-gray-400">
            или
          </div>

          {/* Ввод кода */}
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <div>
              <label className="block text-white mb-2">
                Код авторизации из бота:
              </label>
              <input
                type="text"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value.toUpperCase())}
                placeholder="Введите код"
                className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none cursor-glove text-center text-lg font-mono tracking-widest"
                maxLength={6}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || authCode.length !== 6}
              className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg cursor-glove disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Проверка...' : 'Войти'}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>Не знаете как пользоваться ботом?</p>
          <button className="text-blue-400 hover:text-blue-300 underline">
            Инструкция по использованию
          </button>
        </div>
      </div>
    </div>
  );
};

export default TelegramAuth;
```

### **7. API endpoints**

#### **Валидация кода авторизации:**
```typescript
// pages/api/auth/telegram/validate.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { authService } from '@/lib/telegram/authService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Code is required' });
  }

  try {
    const user = await authService.getUserByAuthCode(code);
    
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Неверный или истекший код авторизации' 
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        telegram_user_id: user.telegram_user_id
      }
    });
  } catch (error) {
    console.error('Validation error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера' 
    });
  }
}
```

### **8. Обновление существующих компонентов**

#### **Обновление MobileAuth компонента:**
```typescript
// src/components/MobileAuth.tsx (обновленная версия)
import { useState } from 'react';
import TelegramAuth from './TelegramAuth';

const MobileAuth = () => {
  const [authMethod, setAuthMethod] = useState<'telegram' | 'phone'>('telegram');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
      <div className="max-w-md mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Вход в систему
          </h1>
          <p className="text-gray-300">
            Выберите способ авторизации
          </p>
        </div>

        {/* Выбор метода авторизации */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setAuthMethod('telegram')}
            className={`py-3 px-4 rounded-lg font-medium transition-colors ${
              authMethod === 'telegram'
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <div className="text-2xl mb-1">🤖</div>
            <div>Telegram</div>
          </button>
          
          <button
            onClick={() => setAuthMethod('phone')}
            className={`py-3 px-4 rounded-lg font-medium transition-colors ${
              authMethod === 'phone'
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <div className="text-2xl mb-1">📱</div>
            <div>Телефон</div>
          </button>
        </div>

        {/* Рендер выбранного метода */}
        {authMethod === 'telegram' ? (
          <TelegramAuth />
        ) : (
          <div className="text-center text-gray-400">
            <p>Авторизация по телефону временно недоступна.</p>
            <p className="mt-2">Используйте Telegram для входа в систему.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileAuth;
```

## 🎨 Стилизация

### **Стили для Telegram авторизации:**
```css
/* Стили для кнопок Telegram */
.telegram-button {
  @apply bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg cursor-glove transition-colors;
}

.telegram-button:active {
  @apply bg-blue-800;
}

/* Стили для поля ввода кода */
.auth-code-input {
  @apply w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none cursor-glove text-center text-lg font-mono tracking-widest;
}

/* Анимации для загрузки */
.telegram-loading {
  @apply animate-pulse;
}

/* Стили для уведомлений */
.telegram-notification {
  @apply bg-blue-600/20 border border-blue-500 text-blue-300 px-4 py-3 rounded-lg;
}
```

## 🔗 Интеграция с PocketBase

### **Настройка коллекций:**
1. **users** - обновить с полями Telegram
2. **telegram_auth_sessions** - новые сессии авторизации

### **Права доступа:**
- **telegram_auth_sessions** - только создание и чтение собственных записей
- **users** - обновление собственных данных

## 📋 План реализации

### **Этап 1: Создание бота**
1. Создать бота через @BotFather
2. Получить токен и настроить команды
3. Настроить webhook

### **Этап 2: Backend бота**
1. Создать структуру проекта
2. Реализовать обработчики команд
3. Интегрировать с PocketBase

### **Этап 3: База данных**
1. Создать коллекцию telegram_auth_sessions
2. Обновить коллекцию users
3. Настроить права доступа

### **Этап 4: Frontend интеграция**
1. Создать компонент TelegramAuth
2. Обновить MobileAuth
3. Создать API endpoints

### **Этап 5: Тестирование**
1. Протестировать все сценарии авторизации
2. Проверить работу на разных устройствах
3. Оптимизировать производительность

## 🧪 Тестирование

### **Сценарии тестирования:**

1. **Новый пользователь:**
   - Открытие бота
   - Поделиться контактом
   - Создание аккаунта
   - Вход в систему

2. **Существующий пользователь:**
   - Привязка Telegram к аккаунту
   - Авторизация через бота
   - Проверка ролей

3. **Авторизация по коду:**
   - Получение кода в боте
   - Ввод кода на сайте
   - Валидация кода

4. **Ошибки:**
   - Неверный код
   - Истекший код
   - Проблемы с сетью

## 📚 Связанные файлы

- `telegram-bot/` - папка с кодом бота
- `src/components/TelegramAuth.tsx` - компонент авторизации
- `src/components/MobileAuth.tsx` - обновленный компонент
- `src/lib/telegram/` - сервисы для работы с Telegram
- `pages/api/auth/telegram/` - API endpoints
- `src/types/telegram.ts` - типы для Telegram

## ⚠️ Важные замечания

1. **Безопасность:** Коды авторизации должны быть уникальными и иметь ограниченное время жизни
2. **Производительность:** Оптимизировать запросы к PocketBase
3. **Пользовательский опыт:** Простой и понятный интерфейс
4. **Совместимость:** Работа на всех устройствах с Telegram
5. **Масштабируемость:** Возможность добавления новых функций

## 🔧 Зависимости

### **Для бота:**
```json
{
  "telegraf": "^4.15.0",
  "pocketbase": "^0.26.2",
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1"
}
```

### **Для фронтенда:**
```json
{
  "axios": "^1.6.0"
}
```

---

**Следующий шаг:** Начать с Этапа 1 - создания бота через @BotFather и настройки базовой структуры.
