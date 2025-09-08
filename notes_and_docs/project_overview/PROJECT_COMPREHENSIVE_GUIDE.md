# JAB Martial Arts - Comprehensive Project Guide

**Версия:** 1.6.0  
**Дата обновления:** 15 января 2025  
**Статус:** ✅ Production Ready  
**Репозиторий:** [GitHub](https://github.com/nvgrigoryev24/jab-martial-arts)

## 📋 Краткое описание

JAB Martial Arts - это современный веб-сайт школы боевых искусств, построенный на Next.js 15.5.2 с использованием React 19.1.0, TypeScript и Tailwind CSS 4. Проект использует PocketBase в качестве Backend-as-a-Service (BaaS) для управления контентом и данными.

## 🏗️ Архитектура проекта

### Frontend Stack
- **Next.js 15.5.2** - React фреймворк с App Router
- **React 19.1.0** - UI библиотека
- **TypeScript 5** - Статическая типизация
- **Tailwind CSS 4** - Utility-first CSS фреймворк
- **@tailwindcss/typography** - Плагин для типографики

### Backend Stack
- **PocketBase 0.26.2** - Backend-as-a-Service
- **SQLite** - База данных (встроенная в PocketBase)
- **REST API** - API для взаимодействия с данными

### Development Tools
- **ESLint** - Линтер для JavaScript/TypeScript
- **PostCSS** - CSS препроцессор
- **Turbopack** - Быстрый бандлер для разработки

## 📁 Структура проекта

```
jab-martial-arts/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css         # Глобальные стили
│   │   ├── layout.tsx          # Корневой layout
│   │   └── page.tsx           # Главная страница
│   ├── components/            # React компоненты
│   │   ├── Header.tsx         # Шапка сайта с навигацией
│   │   ├── HeroSection.tsx    # Главная секция
│   │   ├── ScheduleSection.tsx # Секция расписания
│   │   ├── TrainersSection.tsx # Секция тренеров
│   │   ├── NewsSection.tsx    # Секция новостей
│   │   ├── PricingSection.tsx  # Секция абонементов
│   │   ├── ContactSection.tsx # Секция контактов
│   │   ├── PunchingBagSection.tsx # Интерактивная секция
│   │   ├── CTABanner.tsx      # Баннер призыва к действию
│   │   ├── ScrollToTopButton.tsx # Кнопка "Наверх"
│   │   ├── Preloader.tsx      # Загрузочный экран
│   │   ├── MainRenderer.tsx   # Главный рендерер
│   │   └── ClientWrapper.tsx  # Клиентский wrapper
│   └── lib/
│       ├── pocketbase.ts       # PocketBase интеграция
│       └── smoothScroll.ts     # Утилиты плавной прокрутки
├── notes_and_docs/            # Документация
│   ├── manuals/              # Руководства
│   ├── notes/                # Заметки
│   ├── project_overview/     # Обзор проекта
│   └── todo_AI_manuals/      # Инструкции для AI
├── backups/                  # Резервные копии
├── pb_data/                  # Данные PocketBase
├── pb_migrations/            # Миграции PocketBase
├── public/                   # Статические файлы
├── pocketbase               # PocketBase исполняемый файл
├── package.json             # Зависимости проекта
├── tailwind.config.js       # Конфигурация Tailwind
├── tsconfig.json            # Конфигурация TypeScript
└── next.config.ts           # Конфигурация Next.js
```

## 🎨 Дизайн-система

### Цветовая палитра JAB
- **Основной красный**: `#DC2626` (red-600)
- **Темный красный**: `#B91C1C` (red-700)
- **Светлый красный**: `#FEE2E2` (red-100)
- **Черный**: `#000000` (black)
- **Белый**: `#FFFFFF` (white)
- **Серый**: `#6B7280` (gray-500)

### Типографика
- **Основной шрифт**: Geist (автоматически оптимизируется Next.js)
- **Заголовки**: `hero-jab-text` класс с кастомными стилями
- **Текст**: Стандартные Tailwind классы с поддержкой типографики

### Компоненты дизайна
- **Градиенты**: Красные градиенты для кнопок и акцентов
- **Тени**: Кастомные тени с красным оттенком
- **Анимации**: Плавные переходы и hover эффекты
- **Адаптивность**: Mobile-first подход

## 🗄️ Система данных (PocketBase)

### Коллекции

#### 1. **schedule** - Расписание тренировок
```typescript
interface Schedule {
  id: string;
  day: string;           // День недели (monday, tuesday, etc.)
  start_time: string;    // Время начала (HH:MM)
  end_time: string;      // Время окончания (HH:MM)
  level: string;         // ID уровня подготовки (relation)
  location: string;      // ID локации (relation)
  coaches: string[];     // ID тренеров (multiple relation)
  is_active: boolean;    // Активность
  sort_order: number;    // Порядок сортировки
  created: string;
  updated: string;
  expand?: {
    level?: TrainingLevel;
    location?: Location;
    coaches?: Coach[];
  };
}
```

#### 2. **locations** - Локации тренировок
```typescript
interface Location {
  id: string;
  name: string;          // Название локации
  address: string;       // Адрес
  description: string;   // Описание
  equipment: string;     // Оборудование
  contact_phone: string; // Контактный телефон
  is_active: boolean;    // Активность
  sort_order: number;    // Порядок сортировки
  color_theme?: string;  // ID цветовой схемы (relation)
  created: string;
  updated: string;
  expand?: {
    color_theme?: ColorTheme;
  };
}
```

#### 3. **coaches** - Тренеры
```typescript
interface Coach {
  id: string;
  name: string;          // Имя тренера
  specialization: string; // Специализация
  experience: string;     // Опыт работы
  achievements: string;  // Достижения
  photo: string;         // Фото (file)
  is_active: boolean;    // Активность
  sort_order: number;    // Порядок сортировки
  created: string;
  updated: string;
}
```

#### 4. **color_theme** - Цветовые схемы
```typescript
interface ColorTheme {
  id: string;
  name: string;          // Название темы
  slug: string;          // Уникальный slug
  color: string;         // Цвет текста (HEX)
  bg_color: string;      // Цвет фона (HEX)
  border_color: string;  // Цвет границы (HEX)
  transparency: number;  // Прозрачность (0-100)
  preview: string;       // Предпросмотр
  is_active: boolean;    // Активность
  sort_order: number;    // Порядок сортировки
  created: string;
  updated: string;
}
```

#### 5. **news_categories** - Категории новостей
```typescript
interface NewsCategory {
  id: string;
  name: string;          // Название категории
  slug: string;          // Уникальный slug
  description: string;   // Описание
  color_theme?: string;  // ID цветовой схемы (relation)
  is_active: boolean;    // Активность
  sort_order: number;    // Порядок сортировки
  created: string;
  updated: string;
  expand?: {
    color_theme?: ColorTheme;
  };
}
```

#### 6. **news** - Новости
```typescript
interface News {
  id: string;
  title: string;         // Заголовок
  content: string;       // Содержание (rich text)
  excerpt: string;       // Краткое описание
  category: string;      // ID категории (relation)
  featured_image: string; // Главное изображение (file)
  is_published: boolean; // Опубликовано
  published_at: string;  // Дата публикации
  created: string;
  updated: string;
  expand?: {
    category?: NewsCategory;
  };
}
```

#### 7. **training_levels** - Уровни подготовки
```typescript
interface TrainingLevel {
  id: string;
  name: string;          // Название уровня
  slug: string;          // Уникальный slug
  description: string;   // Описание
  color_theme?: string;  // ID цветовой схемы (relation)
  is_active: boolean;    // Активность
  sort_order: number;    // Порядок сортировки
  created: string;
  updated: string;
  expand?: {
    color_theme?: ColorTheme;
  };
}
```

#### 8. **hero_content** - Контент Hero секции
```typescript
interface HeroContent {
  id: string;
  eyebrow_text: string;     // Текст над заголовком
  title: string;            // Основной заголовок
  description: string;      // Описание под заголовком
  cta_text: string;         // Текст кнопки призыва к действию
  cta_link: string;         // Ссылка кнопки
  feature_1_text: string;   // Текст первого преимущества
  feature_2_text: string;   // Текст второго преимущества
  image_url?: string;       // URL изображения
  image_alt: string;        // Альтернативный текст изображения
  is_active: boolean;      // Активность
  sort_order: number;      // Порядок сортировки
  created: string;
  updated: string;
}
```

#### 9. **pricing_plans** - Тарифные планы
```typescript
interface PricingPlan {
  id: string;
  name: string;          // Название плана
  description: string;   // Описание
  price: number;         // Цена
  currency: string;      // Валюта
  features: string[];     // Особенности
  is_popular: boolean;   // Популярный план
  is_active: boolean;    // Активность
  sort_order: number;    // Порядок сортировки
  created: string;
  updated: string;
}
```

#### 10. **contact_messages** - Сообщения контактов
```typescript
interface ContactMessage {
  id: string;
  name: string;          // Имя
  email: string;         // Email
  phone: string;         // Телефон
  message: string;       // Сообщение
  promo_code?: string;   // Промокод (если есть)
  is_read: boolean;     // Прочитано
  created: string;
  updated: string;
}
```

#### 11. **about_page** - Контент страницы "О школе"
```typescript
interface AboutPage {
  id: string;
  section_title: string;     // Заголовок секции
  section_subtitle: string;  // Подзаголовок
  bottom_banner_text: string; // Текст нижнего баннера
  is_active: boolean;        // Активность
  sort_order: number;       // Порядок сортировки
  created: string;
  updated: string;
}
```

#### 12. **about_cards** - Карточки раздела "О школе"
```typescript
interface AboutCard {
  id: string;
  title: string;            // Заголовок карточки
  description: string;      // Описание карточки
  icon: string;            // Эмодзи иконка
  background_image: string; // Фоновое изображение карточки
  color_theme: string;     // ID цветовой схемы (relation)
  is_active: boolean;      // Активность
  sort_order: number;      // Порядок сортировки
  created: string;
  updated: string;
  expand?: {
    color_theme?: ColorTheme;
  };
}
```

## 🔧 Ключевые функции

### 1. **Система расписания**
- Отображение тренировок по дням недели
- Фильтрация по локациям, уровням и дням
- Поддержка множественных тренеров
- Динамические цветовые схемы для локаций и уровней
- Система уровней подготовки с цветовыми темами
- Адаптивный дизайн с аккордеоном для мобильных

### 2. **Система уровней подготовки**
- Динамические уровни с цветовыми схемами
- Поддержка slug для URL-дружественных ссылок
- Описания для каждого уровня
- Связь с цветовыми темами для визуального оформления
- Гибкая система сортировки и активации

### 3. **Динамическая Hero секция**
- Полностью настраиваемый текстовый контент из PocketBase
- Статичные цвета (красный/синий) для элементов
- Поддержка изображений с fallback на плейсхолдер
- Настраиваемые тексты и ссылки
- Адаптивный дизайн с анимациями
- Система загрузки с индикатором

### 4. **Динамический раздел "О школе"**
- Полностью настраиваемый контент из PocketBase
- Гибкая система карточек - можно добавлять любое количество
- Карточки с фоновыми изображениями и полупрозрачными слоями
- Индивидуальные цветовые схемы для каждой карточки
- Настраиваемые заголовки, описания и иконки
- Связь с системой цветовых тем
- Нижний баннер с настраиваемым текстом
- Адаптивный дизайн с hover эффектами

### 5. **Система цветовых схем**
- Динамические цвета из PocketBase
- Поддержка HEX цветов с прозрачностью
- Fallback система для обратной совместимости
- Использование inline стилей для корректного применения

### 6. **Интерактивные элементы**
- Анимированный боксерский мешок с генерацией промокодов
- Модальные окна для тренеров
- Плавная прокрутка между секциями
- Кнопка "Наверх" с анимациями

### 7. **Система новостей**
- Категории с цветовыми схемами
- Rich text контент
- Адаптивные карточки новостей
- Система публикации

### 8. **Система контактов**
- Форма обратной связи
- Интеграция с промокодами
- Валидация полей
- Отправка данных в PocketBase

## 🎯 Особенности реализации

### 1. **TypeScript интеграция**
- Строгая типизация всех интерфейсов
- Типизированные функции для работы с PocketBase
- Автокомплит и проверка типов

### 2. **PocketBase интеграция**
- Автоматическая обработка ошибок
- Поддержка expand для связанных данных
- Обработка автоперезагрузки Next.js
- Оптимизированные запросы

### 3. **Responsive дизайн**
- Mobile-first подход
- Адаптивные компоненты
- Оптимизация для всех устройств
- Touch-friendly интерфейс

### 4. **Производительность**
- Оптимизация изображений Next.js
- Ленивая загрузка компонентов
- Минимизация re-renders
- Эффективное кэширование

## 🚀 Развертывание

### GitHub Repository
Проект доступен на GitHub: [jab-martial-arts](https://github.com/nvgrigoryev24/jab-martial-arts)

#### Клонирование и настройка
```bash
# Клонирование репозитория
git clone https://github.com/nvgrigoryev24/jab-martial-arts.git

# Переход в директорию проекта
cd jab-martial-arts

# Установка зависимостей
npm install

# Запуск PocketBase
./pocketbase serve

# Запуск Next.js в режиме разработки
npm run dev
```

### Локальная разработка
```bash
# Установка зависимостей
npm install

# Запуск PocketBase
./pocketbase serve

# Запуск Next.js в режиме разработки
npm run dev
```

### Продакшен
```bash
# Сборка проекта
npm run build

# Запуск продакшен сервера
npm start
```

## 📚 Документация

### Основные файлы документации
- `notes_and_docs/manuals/pocketbase/POCKETBASE_COLLECTIONS_SETUP.md` - Настройка коллекций
- `notes_and_docs/notes/releases/RELEASE_NOTES.md` - Заметки о релизах
- `notes_and_docs/notes/releases/CHANGELOG.md` - История изменений
- `notes_and_docs/todo_AI_manuals/` - Инструкции для AI агентов

### Структура документации
- **manuals/** - Руководства по настройке
- **notes/** - Заметки и планы
- **project_overview/** - Обзор проекта
- **todo_AI_manuals/** - Инструкции для AI

## 🔄 Система резервного копирования

### Автоматические бэкапы
- Создаются при каждом релизе
- Хранятся в папке `backups/` проекта
- Дублируются в папке пользователя `jab-martial-arts-backups/`
- Исключают `node_modules`, `.next`, `pb_data`, `pb_migrations`
- Включают полную документацию и настройки

### Формат бэкапов
- `jab-martial-arts-v{VERSION}-{YYYYMMDD_HHMMSS}.tar.gz`
- Сжатие gzip для экономии места
- Включают весь исходный код и документацию
- Создаются автоматически при обновлении документации

### GitHub как дополнительный бэкап
- Полная история изменений в git
- Доступность кода из любого места
- Возможность восстановления любой версии
- Публичный доступ для команды разработки

## 🎨 Цветовые схемы в действии

### Примеры использования
- **Локации**: Каждая локация может иметь свою цветовую схему
- **Уровни подготовки**: Разные цвета для каждого уровня с описаниями
- **Категории новостей**: Динамические цвета для категорий
- **Fallback**: Предопределенные цвета если схема не найдена

### Техническая реализация
```typescript
// Получение стилей цветовой схемы
const getColorThemeStyles = (theme: ColorTheme) => {
  const transparency = theme.transparency || 20;
  const bgOpacity = (100 - transparency) / 100;
  
  return {
    className: `text-[${theme.color}] border-[${theme.border_color}]`,
    style: {
      backgroundColor: `${theme.bg_color}${Math.round(bgOpacity * 255).toString(16).padStart(2, '0')}`,
      borderColor: `${theme.border_color}${Math.round(bgOpacity * 255).toString(16).padStart(2, '0')}`
    }
  };
};
```

## 🛠️ Инструменты разработки

### Линтинг и форматирование
- ESLint для проверки кода
- TypeScript для статической типизации
- Prettier для форматирования (если настроен)

### Отладка
- React DevTools
- Next.js DevTools
- PocketBase Admin UI
- Browser DevTools

### Тестирование
- Встроенные тесты Next.js
- PocketBase API тестирование
- Ручное тестирование UI

## 📱 Адаптивность

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Адаптивные компоненты
- **Header**: Бургер-меню на мобильных
- **Schedule**: Аккордеон на мобильных
- **Trainers**: Компактные карточки
- **News**: Горизонтальные карточки

## 🔐 Безопасность

### PocketBase безопасность
- API правила для каждой коллекции
- Аутентификация через PocketBase
- Валидация данных на сервере
- Защита от SQL инъекций

### Frontend безопасность
- Валидация форм
- Санитизация данных
- CSP заголовки
- Безопасные HTTP заголовки

## 🚀 Производительность

### Оптимизации Next.js
- Автоматическая оптимизация изображений
- Code splitting
- Tree shaking
- Статическая генерация где возможно

### Оптимизации PocketBase
- Индексирование полей
- Оптимизированные запросы
- Кэширование данных
- Минимизация запросов

## 📈 Мониторинг

### Логирование
- PocketBase логи
- Next.js логи
- Browser консоль
- Ошибки в продакшене

### Метрики
- Время загрузки страниц
- Размер бандла
- Производительность API
- Пользовательские метрики

---

**Этот документ служит полным руководством для понимания проекта JAB Martial Arts. Он содержит всю необходимую информацию для быстрого старта работы с проектом любым AI агентом или разработчиком.**

