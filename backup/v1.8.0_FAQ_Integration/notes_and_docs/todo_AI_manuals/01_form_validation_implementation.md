# 📋 Инструкция по реализации валидации полей формы

**Дата создания:** 9 января 2025  
**Приоритет:** 1 (первая задача)  
**Статус:** Ожидает реализации

## 🎯 Цель

Реализовать умную валидацию полей формы в секции контактов (`ContactSection.tsx`) для минимизации ошибок пользователя при вводе данных.

## 📝 Контекст проекта

- **Проект:** JAB Martial Arts - сайт школы единоборств
- **Технологии:** Next.js 15.5.2, React, TypeScript, Tailwind CSS
- **Компонент:** `src/components/ContactSection.tsx`
- **Стиль:** Кастомный курсор (боксерская перчатка), градиенты, анимации
- **Интеграция:** PocketBase для хранения данных

## 🔧 Задачи для реализации

### **1. Валидация поля телефона**

#### **Требования:**
- Только российские номера (+7)
- Автоматическая подстановка +7 при вводе любой другой цифры
- Игнорирование ввода +7 или 7 в начале (избежание дублирования)
- Маска ввода: `+7 (XXX) XXX-XX-XX`
- Валидация формата в реальном времени

#### **Логика обработки ввода:**
```javascript
// Пример логики для обработки ввода телефона
const handlePhoneInput = (value) => {
  // Убираем все нецифровые символы
  const digits = value.replace(/\D/g, '');
  
  // Если начинается с 7, заменяем на +7
  if (digits.startsWith('7')) {
    return formatPhoneNumber('7' + digits.slice(1));
  }
  
  // Если начинается с 8, заменяем на +7
  if (digits.startsWith('8')) {
    return formatPhoneNumber('7' + digits.slice(1));
  }
  
  // Если начинается с любой другой цифры, добавляем +7
  if (digits.length > 0 && !digits.startsWith('7')) {
    return formatPhoneNumber('7' + digits);
  }
  
  // Если пустое, возвращаем пустую строку
  if (digits.length === 0) {
    return '';
  }
  
  // Форматируем номер
  return formatPhoneNumber(digits);
};

const formatPhoneNumber = (digits) => {
  // Логика форматирования: +7 (XXX) XXX-XX-XX
  if (digits.length <= 1) return '+7';
  if (digits.length <= 4) return `+7 (${digits.slice(1)}`;
  if (digits.length <= 7) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4)}`;
  if (digits.length <= 9) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
};
```

#### **Валидация:**
- Проверка на 11 цифр (включая код страны)
- Проверка корректности формата
- Отображение ошибок в реальном времени

### **2. Поле социальных сетей**

#### **Требования:**
- Выбор мессенджера из списка: Telegram, MAX
- Поле для ввода логина/username
- Возможность выбора нескольких мессенджеров
- Валидация формата логина для каждого мессенджера

#### **Структура данных:**
```typescript
interface SocialMedia {
  platform: 'telegram' | 'max';
  username: string;
}

// В форме будет массив SocialMedia[]
```

#### **UI компонент:**
```jsx
// Пример структуры компонента
<div className="space-y-4">
  <label className="block hero-jab-text text-sm font-medium text-gray-300">
    Социальные сети
  </label>
  
  {/* Telegram */}
  <div className="flex items-center space-x-3">
    <input
      type="checkbox"
      id="telegram-checkbox"
      checked={socialMedia.some(sm => sm.platform === 'telegram')}
      onChange={handleTelegramToggle}
      className="cursor-glove"
    />
    <label htmlFor="telegram-checkbox" className="hero-jab-text text-gray-300">
      Telegram
    </label>
    {socialMedia.some(sm => sm.platform === 'telegram') && (
      <input
        type="text"
        placeholder="@username"
        value={getTelegramUsername()}
        onChange={handleTelegramUsernameChange}
        className="flex-1 px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none cursor-glove"
      />
    )}
  </div>
  
  {/* MAX */}
  <div className="flex items-center space-x-3">
    <input
      type="checkbox"
      id="max-checkbox"
      checked={socialMedia.some(sm => sm.platform === 'max')}
      onChange={handleMaxToggle}
      className="cursor-glove"
    />
    <label htmlFor="max-checkbox" className="hero-jab-text text-gray-300">
      MAX
    </label>
    {socialMedia.some(sm => sm.platform === 'max') && (
      <input
        type="text"
        placeholder="username"
        value={getMaxUsername()}
        onChange={handleMaxUsernameChange}
        className="flex-1 px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none cursor-glove"
      />
    )}
  </div>
</div>
```

#### **Валидация логинов:**
- **Telegram:** @username или username (без @)
- **MAX:** username (без специальных символов)
- Проверка на пустоту при выборе платформы

### **3. Общие улучшения валидации**

#### **Существующие поля:**
- **Имя:** минимум 2 символа, только буквы и пробелы
- **Сообщение:** минимум 10 символов, максимум 500
- **Промокод:** опциональное поле, валидация формата

#### **Визуальная обратная связь:**
- Красная рамка при ошибке
- Зеленая рамка при корректном вводе
- Сообщения об ошибках под полями
- Анимация появления ошибок

## 🎨 Стилизация

### **Классы для состояний:**
```css
/* Нормальное состояние */
.input-normal {
  @apply bg-white/10 border-gray-600 text-white placeholder-gray-400;
}

/* Ошибка */
.input-error {
  @apply border-red-500 bg-red-500/10;
}

/* Успех */
.input-success {
  @apply border-green-500 bg-green-500/10;
}

/* Фокус */
.input-focus {
  @apply border-red-500 outline-none ring-2 ring-red-500/20;
}
```

### **Анимации:**
- Плавное появление сообщений об ошибках
- Пульсация при ошибке
- Переходы между состояниями

## 🔗 Интеграция с PocketBase

### **Обновление интерфейса Contact:**
```typescript
interface Contact {
  id: string;
  client_name: string;
  phone: string;
  message: string;
  promo_code?: string;
  social_media?: SocialMedia[]; // Новое поле
  status: 'new' | 'processed' | 'completed';
  created_date: string;
}
```

### **Функция отправки:**
```typescript
const submitContact = async (formData: Omit<Contact, 'id' | 'created_date'>) => {
  try {
    const record = await pb.collection('contacts').create(formData);
    return { success: true, record };
  } catch (error) {
    console.error('Error submitting contact:', error);
    return { success: false, error };
  }
};
```

## 📋 План реализации

### **Этап 1: Подготовка**
1. Создать типы для SocialMedia
2. Обновить интерфейс Contact
3. Создать утилиты для валидации

### **Этап 2: Валидация телефона**
1. Реализовать handlePhoneInput
2. Добавить formatPhoneNumber
3. Интегрировать в форму
4. Добавить визуальную обратную связь

### **Этап 3: Социальные сети**
1. Создать компонент SocialMediaSelector
2. Реализовать логику выбора платформ
3. Добавить валидацию логинов
4. Интегрировать в форму

### **Этап 4: Общие улучшения**
1. Улучшить валидацию существующих полей
2. Добавить анимации и переходы
3. Обновить стили состояний
4. Тестирование

### **Этап 5: Интеграция**
1. Обновить PocketBase коллекцию
2. Обновить функцию submitContact
3. Протестировать отправку данных
4. Финальная проверка

## 🧪 Тестирование

### **Сценарии тестирования:**
1. **Телефон:**
   - Ввод 8XXXXXXXXXX → +7 (XXX) XXX-XX-XX
   - Ввод 7XXXXXXXXXX → +7 (XXX) XXX-XX-XX
   - Ввод +7XXXXXXXXXX → +7 (XXX) XXX-XX-XX
   - Ввод XXXXXXXXXX → +7 (XXX) XXX-XX-XX
   - Ввод некорректных символов

2. **Социальные сети:**
   - Выбор только Telegram
   - Выбор только MAX
   - Выбор обеих платформ
   - Ввод корректных логинов
   - Ввод некорректных логинов

3. **Общая форма:**
   - Отправка с пустыми полями
   - Отправка с некорректными данными
   - Отправка с корректными данными
   - Проверка сохранения в PocketBase

## 📚 Связанные файлы

- `src/components/ContactSection.tsx` - основной компонент
- `src/lib/pocketbase.ts` - интерфейсы и функции
- `src/app/globals.css` - стили
- `notes_and_docs/manuals/pocketbase/POCKETBASE_COLLECTIONS_SETUP.md` - структура коллекций

## ⚠️ Важные замечания

1. **Совместимость:** Сохранить существующий функционал
2. **Производительность:** Валидация не должна блокировать UI
3. **Доступность:** Поддержка screen readers
4. **Мобильность:** Корректная работа на touch-устройствах
5. **Стиль:** Соответствие дизайну JAB Martial Arts

---

**Следующий шаг:** Начать с Этапа 1 - создания типов и утилит для валидации.
