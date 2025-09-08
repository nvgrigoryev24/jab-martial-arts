# 📋 Инструкция по реализации системы check-in тренировок

**Дата создания:** 9 января 2025  
**Приоритет:** 2 (вторая задача)  
**Статус:** Ожидает реализации

## 🎯 Цель

Реализовать систему check-in тренировок для школы единоборств JAB Martial Arts, включающую QR-код генерацию, мобильную авторизацию, сканирование и интерактивные уведомления с персонализированными сообщениями.

## 📝 Контекст проекта

- **Проект:** JAB Martial Arts - сайт школы единоборств
- **Технологии:** Next.js 15.5.2, React, TypeScript, Tailwind CSS
- **Интеграция:** PocketBase для хранения данных
- **Стиль:** Кастомный курсор (боксерская перчатка), градиенты, анимации
- **Целевая аудитория:** Участники тренировок, тренеры, администраторы

## 🔧 Задачи для реализации

### **1. Система ролей пользователей**

#### **Требования:**
- **Участник** - обычный пользователь для check-in
- **Тренер** - доступ к дашборду и статистике
- **QR-генератор** - специальная роль только для генерации QR-кодов

#### **Структура пользователя:**
```typescript
interface User {
  id: string;
  phone: string;
  name: string;
  role: 'participant' | 'trainer' | 'qr_generator';
  created_date: string;
  last_login?: string;
}
```

### **2. База данных (PocketBase коллекции)**

#### **Коллекция: qr_sessions**
```typescript
interface QRSession {
  id: string;
  qr_code: string; // уникальный код
  generated_by: string; // ID пользователя с ролью qr_generator
  generated_at: string;
  expires_at: string; // например, через 2 часа
  is_active: boolean;
  location?: string; // "Зал 1", "Зал 2" и т.д.
  display_device_id?: string; // ID устройства для отображения
  current_message?: string; // текущее сообщение на экране
  message_expires_at?: string; // когда скрыть сообщение
}
```

#### **Коллекция: check_ins**
```typescript
interface CheckIn {
  id: string;
  user_phone: string;
  user_name?: string; // кэшированное имя
  qr_session_id: string;
  check_in_time: string;
  status: 'success' | 'duplicate' | 'cooldown' | 'expired';
  device_info?: string;
}
```

#### **Коллекция: user_stats**
```typescript
interface UserStats {
  id: string;
  user_phone: string;
  total_trainings: number;
  last_check_in: string;
  streak_days: number; // подряд дней тренировок
  favorite_time?: string; // любимое время тренировок
  created_date: string;
}
```

### **3. QR-генератор интерфейс**

#### **Требования:**
- Простой интерфейс с одной кнопкой "Записать тренировку"
- Генерация QR-кода при нажатии
- Отображение QR-кода на экране
- Кнопка "Завершить тренировку" для деактивации
- Автоматическое истечение через 2 часа

#### **Компонент QR-генератора:**
```typescript
const QRGeneratorPage = () => {
  const [currentQR, setCurrentQR] = useState<QRSession | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateNewQR = async () => {
    setIsGenerating(true);
    
    try {
      const qrSession = await pb.collection('qr_sessions').create({
        qr_code: generateQRCode(),
        generated_by: pb.authStore.model?.id,
        generated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 часа
        is_active: true,
        location: 'Основной зал',
        display_device_id: 'main_display'
      });

      setCurrentQR(qrSession);
    } catch (error) {
      console.error('Ошибка генерации QR:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const deactivateQR = async () => {
    if (currentQR) {
      await pb.collection('qr_sessions').update(currentQR.id, {
        is_active: false
      });
      setCurrentQR(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          QR-генератор тренировок
        </h1>
        
        {!currentQR ? (
          <button
            onClick={generateNewQR}
            disabled={isGenerating}
            className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xl cursor-glove disabled:opacity-50"
          >
            {isGenerating ? 'Генерация...' : 'Записать тренировку'}
          </button>
        ) : (
          <div className="text-center">
            <div className="bg-white p-6 rounded-lg mb-6">
              <QRCodeSVG value={currentQR.qr_code} size={250} />
              <p className="mt-4 text-gray-600">
                Активен до: {new Date(currentQR.expires_at).toLocaleTimeString()}
              </p>
            </div>
            
            <button
              onClick={deactivateQR}
              className="w-full py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg cursor-glove"
            >
              Завершить тренировку
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
```

### **4. Мобильная авторизация через Telegram**

#### **Требования:**
- Авторизация через Telegram бота
- Поделиться контактом или использовать код
- Проверка кода и создание сессии
- Сохранение авторизации на устройстве

#### **Компонент авторизации:**
```typescript
const MobileAuth = () => {
  const [authMethod, setAuthMethod] = useState<'telegram' | 'phone'>('telegram');

  const handleTelegramAuth = () => {
    // Открываем Telegram бота
    const botUrl = `https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}`;
    window.open(botUrl, '_blank');
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

          {/* Ввод кода из бота */}
          <TelegramCodeInput />
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
```

### **5. Сканирование QR-кода**

#### **Требования:**
- Использование камеры устройства
- Считывание QR-кода
- Валидация формата
- Обработка ошибок

#### **Компонент сканера:**
```typescript
const QRScanner = () => {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (data: string) => {
    try {
      const qrData = JSON.parse(atob(data));
      
      if (qrData.type === 'training_checkin') {
        const result = await checkInToTraining(qrData.qr_code);
        setScannedData(result.message);
        setIsScanning(false);
      }
    } catch (error) {
      setError('Неверный QR-код');
      setIsScanning(false);
    }
  };

  const handleError = (error: any) => {
    console.error('Ошибка сканера:', error);
    setError('Ошибка камеры');
    setIsScanning(false);
  };

  return (
    <div className="scanner-container">
      <QrScanner
        onScan={handleScan}
        onError={handleError}
        style={{ width: '100%', height: '300px' }}
      />
      
      {scannedData && (
        <div className="result-message bg-green-600 text-white p-4 rounded-lg mt-4">
          {scannedData}
        </div>
      )}
      
      {error && (
        <div className="result-message bg-red-600 text-white p-4 rounded-lg mt-4">
          {error}
        </div>
      )}
    </div>
  );
};
```

### **6. Логика check-in с cooldown**

#### **Требования:**
- Проверка cooldown (6 часов между отметками)
- Валидация QR-кода
- Обновление статистики пользователя
- Отправка уведомления на устройство с QR-кодом

#### **Функция check-in:**
```typescript
const checkInToTraining = async (qrCode: string) => {
  const user = pb.authStore.model;
  if (!user) return { success: false, message: 'Необходима авторизация' };

  // Поиск активной QR-сессии
  const qrSession = await pb.collection('qr_sessions').getList(1, 1, {
    filter: `qr_code = "${qrCode}" && is_active = true && expires_at > "${new Date().toISOString()}"`
  });

  if (qrSession.items.length === 0) {
    return { success: false, message: 'QR-код неактивен или истек' };
  }

  const session = qrSession.items[0];

  // Проверка cooldown (6 часов)
  const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
  const lastCheckIn = await pb.collection('check_ins').getList(1, 1, {
    filter: `user_phone = "${user.phone}" && check_in_time > "${sixHoursAgo.toISOString()}"`,
    sort: '-check_in_time'
  });

  if (lastCheckIn.items.length > 0) {
    const lastCheckInTime = new Date(lastCheckIn.items[0].check_in_time);
    const timeUntilNext = new Date(lastCheckInTime.getTime() + 6 * 60 * 60 * 1000);
    const hoursLeft = Math.ceil((timeUntilNext.getTime() - Date.now()) / (1000 * 60 * 60));
    
    return { 
      success: false, 
      message: `Следующая отметка возможна через ${hoursLeft} часов` 
    };
  }

  // Получение/создание статистики пользователя
  const userStats = await pb.collection('user_stats').getList(1, 1, {
    filter: `user_phone = "${user.phone}"`
  });

  let stats = userStats.items[0];
  if (!stats) {
    stats = await pb.collection('user_stats').create({
      user_phone: user.phone,
      total_trainings: 1,
      last_check_in: new Date().toISOString(),
      streak_days: 1
    });
  } else {
    const lastCheckIn = new Date(stats.last_check_in);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24));
    
    await pb.collection('user_stats').update(stats.id, {
      total_trainings: stats.total_trainings + 1,
      last_check_in: new Date().toISOString(),
      streak_days: daysDiff === 1 ? stats.streak_days + 1 : 1
    });
    
    stats.total_trainings += 1;
    stats.streak_days = daysDiff === 1 ? stats.streak_days + 1 : 1;
  }

  // Создание check-in
  const checkIn = await pb.collection('check_ins').create({
    user_phone: user.phone,
    user_name: user.name,
    qr_session_id: session.id,
    check_in_time: new Date().toISOString(),
    status: 'success'
  });

  // Отправка уведомления на устройство с QR-кодом
  await sendMessageToDisplayDevice(session.id, user.name, stats);

  return { success: true, message: 'Успешно отмечены на тренировке!' };
};
```

### **7. Интерактивные уведомления**

#### **Требования:**
- Персонализированные сообщения
- Отображение статистики пользователя
- Анимации и переходы
- Автоматическое скрытие через 8 секунд

#### **Генерация сообщений:**
```typescript
const generatePersonalizedMessage = (userName: string, stats: UserStats): string => {
  const messages = [
    `Рады видеть тебя, ${userName}! У тебя уже ${stats.total_trainings} тренировка в нашем клубе, так держать!`,
    `Привет, ${userName}! Это твоя ${stats.total_trainings} тренировка. Продолжай в том же духе!`,
    `${userName}, отлично! ${stats.total_trainings} тренировок - это серьезный результат!`,
    `Добро пожаловать, ${userName}! Твоя ${stats.total_trainings} тренировка в JAB!`,
    `${userName}, ты на правильном пути! Уже ${stats.total_trainings} тренировок!`
  ];

  // Добавляем информацию о серии тренировок
  if (stats.streak_days > 1) {
    const streakMessages = [
      ` И это уже ${stats.streak_days} день подряд!`,
      ` Твоя серия: ${stats.streak_days} дней!`,
      ` ${stats.streak_days} дней подряд - это круто!`
    ];
    return messages[Math.floor(Math.random() * messages.length)] + 
           streakMessages[Math.floor(Math.random() * streakMessages.length)];
  }

  return messages[Math.floor(Math.random() * messages.length)];
};

const sendMessageToDisplayDevice = async (sessionId: string, userName: string, stats: UserStats) => {
  const message = generatePersonalizedMessage(userName, stats);
  const messageExpiresAt = new Date(Date.now() + 8 * 1000); // 8 секунд

  await pb.collection('qr_sessions').update(sessionId, {
    current_message: message,
    message_expires_at: messageExpiresAt.toISOString()
  });
};
```

### **8. Устройство с QR-кодом (Display Device)**

#### **Требования:**
- Отображение QR-кода
- Получение уведомлений о check-in
- Показ персонализированных сообщений
- Автоматическое переключение между QR и сообщением

#### **Компонент устройства:**
```typescript
const QRDisplayDevice = () => {
  const [currentSession, setCurrentSession] = useState<QRSession | null>(null);
  const [isShowingMessage, setIsShowingMessage] = useState(false);

  useEffect(() => {
    // Подключение к WebSocket или polling для получения обновлений
    const interval = setInterval(async () => {
      if (currentSession) {
        const updatedSession = await pb.collection('qr_sessions').getOne(currentSession.id);
        
        if (updatedSession.current_message && updatedSession.message_expires_at) {
          const expiresAt = new Date(updatedSession.message_expires_at);
          const now = new Date();
          
          if (now < expiresAt) {
            setIsShowingMessage(true);
            setCurrentSession(updatedSession);
            
            // Автоматически скрыть сообщение через 8 секунд
            setTimeout(() => {
              setIsShowingMessage(false);
            }, 8000);
          }
        }
      }
    }, 1000); // проверка каждую секунду

    return () => clearInterval(interval);
  }, [currentSession]);

  const generateNewQR = async () => {
    const qrSession = await pb.collection('qr_sessions').create({
      qr_code: generateQRCode(),
      generated_by: pb.authStore.model?.id,
      generated_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      is_active: true,
      location: 'Основной зал',
      display_device_id: 'main_display'
    });

    setCurrentSession(qrSession);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
      <div className="max-w-lg mx-auto p-6 text-center">
        {!currentSession ? (
          <button
            onClick={generateNewQR}
            className="py-4 px-8 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xl cursor-glove"
          >
            Начать тренировку
          </button>
        ) : (
          <div className="space-y-6">
            {isShowingMessage && currentSession.current_message ? (
              // Показ персонализированного сообщения
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 rounded-lg shadow-2xl animate-pulse">
                <h2 className="text-3xl font-bold text-white mb-4">
                  {currentSession.current_message}
                </h2>
                <div className="text-white/80 text-lg">
                  Продолжай тренироваться!
                </div>
              </div>
            ) : (
              // Показ QR-кода
              <div className="bg-white p-8 rounded-lg shadow-2xl">
                <QRCodeSVG value={currentSession.qr_code} size={300} />
                <p className="mt-4 text-gray-600 text-lg">
                  Отсканируйте для отметки на тренировке
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Активен до: {new Date(currentSession.expires_at).toLocaleTimeString()}
                </p>
              </div>
            )}
            
            <button
              onClick={() => setCurrentSession(null)}
              className="py-2 px-6 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg cursor-glove"
            >
              Завершить тренировку
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
```


### **10. Утилиты и вспомогательные функции**

#### **Генерация QR-кода:**
```typescript
const generateQRCode = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const qrData = {
    type: 'training_checkin',
    timestamp,
    random,
    version: '1.0'
  };
  return btoa(JSON.stringify(qrData));
};

const validateQRCode = (qrCode: string): boolean => {
  try {
    const data = JSON.parse(atob(qrCode));
    return data.type === 'training_checkin' && data.version === '1.0';
  } catch {
    return false;
  }
};
```

#### **Генерация кода авторизации:**
```typescript
const generateAuthCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
```

## 🎨 Стилизация

### **Классы для состояний:**
```css
/* Анимации для сообщений */
@keyframes messageAppear {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes messagePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.message-animation {
  animation: messageAppear 0.5s ease-out, messagePulse 2s ease-in-out infinite;
}

/* Переходы между QR и сообщением */
.qr-transition {
  transition: all 0.3s ease-in-out;
}

/* Стили для состояний check-in */
.checkin-success {
  @apply bg-green-600 text-white p-4 rounded-lg;
}

.checkin-error {
  @apply bg-red-600 text-white p-4 rounded-lg;
}

.checkin-cooldown {
  @apply bg-yellow-600 text-white p-4 rounded-lg;
}
```

## 🔗 Интеграция с PocketBase

### **Настройка коллекций:**
1. **users** - пользователи с ролями
2. **qr_sessions** - активные QR-сессии
3. **check_ins** - записи о посещениях
4. **user_stats** - статистика пользователей
5. **sms_codes** - коды подтверждения

### **Права доступа:**
- **participant** - чтение/запись check_ins, чтение user_stats
- **trainer** - чтение всех данных, доступ к дашборду
- **qr_generator** - создание/обновление qr_sessions

## 📋 План реализации

### **Этап 1: Подготовка**
1. Создать типы для всех интерфейсов
2. Настроить PocketBase коллекции
3. Создать утилиты для генерации QR и SMS

### **Этап 2: Система ролей**
1. Обновить интерфейс User
2. Создать middleware для проверки ролей
3. Настроить права доступа в PocketBase

### **Этап 3: QR-генератор**
1. Создать страницу QR-генератора
2. Реализовать генерацию QR-кодов
3. Добавить автоматическое истечение

### **Этап 4: Мобильная авторизация**
1. Создать компонент MobileAuth
2. Реализовать отправку SMS
3. Добавить проверку кодов

### **Этап 5: Сканирование QR**
1. Создать компонент QRScanner
2. Интегрировать камеру устройства
3. Добавить валидацию QR-кодов

### **Этап 6: Логика check-in**
1. Реализовать checkInToTraining
2. Добавить cooldown проверку
3. Создать систему статистики

### **Этап 7: Интерактивные уведомления**
1. Создать генератор сообщений
2. Реализовать отправку на устройство
3. Добавить анимации

### **Этап 8: Display Device**
1. Создать компонент QRDisplayDevice
2. Реализовать polling для обновлений
3. Добавить переключение между QR и сообщением

### **Этап 9: Тестирование и интеграция**
1. Протестировать все сценарии
2. Проверить работу на разных устройствах
3. Оптимизировать производительность

## 🧪 Тестирование

### **Сценарии тестирования:**

1. **QR-генерация:**
   - Создание новой QR-сессии
   - Автоматическое истечение через 2 часа
   - Деактивация QR-кода

2. **Авторизация:**
   - Отправка SMS на номер телефона
   - Проверка кода подтверждения
   - Создание сессии пользователя

3. **Check-in:**
   - Сканирование активного QR-кода
   - Проверка cooldown (6 часов)
   - Обновление статистики пользователя

4. **Интерактивные уведомления:**
   - Отправка сообщения на устройство
   - Отображение персонализированного сообщения
   - Автоматическое скрытие через 8 секунд

5. **Интеграция:**
   - Работа всех компонентов вместе
   - Проверка производительности
   - Тестирование на разных устройствах

6. **Безопасность:**
   - Проверка ролей пользователей
   - Валидация QR-кодов
   - Защита от дублирования check-in

## 📚 Связанные файлы

- `src/components/QRGeneratorPage.tsx` - генератор QR-кодов
- `src/components/MobileAuth.tsx` - мобильная авторизация
- `src/components/QRScanner.tsx` - сканирование QR-кодов
- `src/components/QRDisplayDevice.tsx` - устройство с QR-кодом
- `src/components/Navigation.tsx` - навигация
- `src/lib/pocketbase.ts` - интерфейсы и функции
- `src/utils/qrUtils.ts` - утилиты для QR-кодов
- `src/utils/telegramUtils.ts` - утилиты для Telegram
- `src/app/globals.css` - стили и анимации

## ⚠️ Важные замечания

1. **Совместимость:** Сохранить существующий функционал сайта
2. **Производительность:** Оптимизировать polling для обновлений
3. **Безопасность:** Защита от злоупотреблений и дублирования
4. **Доступность:** Поддержка screen readers и мобильных устройств
5. **Стиль:** Соответствие дизайну JAB Martial Arts
6. **Масштабируемость:** Возможность добавления новых функций

## 🔧 Зависимости

### **Новые пакеты:**
```json
{
  "qrcode": "^1.5.3",
  "qrcode.react": "^3.1.0",
  "react-qr-scanner": "^1.0.0-alpha.11"
}
```

### **Типы:**
```json
{
  "@types/qrcode": "^1.5.5"
}
```

---

**Следующий шаг:** Начать с Этапа 1 - создания типов и настройки PocketBase коллекций.
