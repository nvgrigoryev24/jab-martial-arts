# Полная настройка PocketBase для школы единоборств JAB

## 1. Установка PocketBase

### Скачивание PocketBase
```bash
# Скачайте PocketBase с официального сайта
wget https://github.com/pocketbase/pocketbase/releases/latest/download/pocketbase_linux_amd64.zip
unzip pocketbase_linux_amd64.zip
chmod +x pocketbase
```

### Запуск PocketBase
```bash
# Запустите PocketBase
./pocketbase serve
```

PocketBase будет доступен по адресу: http://127.0.0.1:8090

## 2. Первоначальная настройка

1. Откройте http://127.0.0.1:8090/_/ в браузере
2. Создайте администратора (первый пользователь)
3. Войдите в админ-панель

## 3. ПОЛНЫЙ СПИСОК КОЛЛЕКЦИЙ ДЛЯ СОЗДАНИЯ

### 1. **Коллекция `page_layout`** (Макет страниц)
**Поля:**
- `page` (Text) - Страница (home, about, contact, coaches, pricing, news, schedule, faq)
- `section` (Text) - Секция (hero, about, coaches, pricing, news, schedule, faq, contact, cta, custom)
- `is_active` (Bool) - Активна ли секция
- `sort_order` (Number) - Порядок секций на странице
- `custom_title` (Text) - Кастомный заголовок секции
- `custom_subtitle` (Text) - Кастомный подзаголовок
- `settings` (JSON) - Настройки секции (цвета, стили, параметры)

**Правила доступа:** Публичное чтение, админ - полный доступ

---

### 2. **Коллекция `section_content`** (Контент секций)
**Поля:**
- `section_id` (Relation) - Связь с page_layout
- `content_type` (Text) - Тип контента (coaches, pricing, news, schedule, faq, custom)
- `content_id` (Text) - ID записи из соответствующей коллекции
- `is_active` (Bool) - Активен ли элемент
- `sort_order` (Number) - Порядок внутри секции

**Правила доступа:** Публичное чтение, админ - полный доступ

---

### 3. **Коллекция `coaches`** (Тренеры)
**Поля:**
- `name` (Text) - Имя тренера
- `specialization` (Text) - Специализация (Бокс, ММА, Кикбоксинг)
- `experience` (Number) - Опыт в годах
- `description` (Text) - Описание тренера
- `photo` (File) - Фото тренера
- `achievements` (JSON) - Массив достижений
- `is_active` (Bool) - Активен ли тренер
- `sort_order` (Number) - Порядок сортировки

**Правила доступа:** Публичное чтение, админ - полный доступ

---

### 4. **Коллекция `pricing_plans`** (Тарифные планы)
**Поля:**
- `title` (Text) - Название тарифа
- `price` (Number) - Цена
- `period` (Text) - Период (в месяц, за 10 занятий)
- `features` (JSON) - Массив особенностей
- `is_popular` (Bool) - Популярный ли тариф
- `button_text` (Text) - Текст кнопки
- `button_style` (Text) - Стиль кнопки
- `is_active` (Bool) - Активен ли тариф
- `sort_order` (Number) - Порядок сортировки

**Правила доступа:** Публичное чтение, админ - полный доступ

---

### 5. **Коллекция `news`** (Новости)
**Поля:**
- `title` (Text) - Заголовок новости
- `slug` (Text) - URL slug для новости
- `excerpt` (Text) - Краткое описание
- `content` (Text) - Полный текст
- `image` (File) - Изображение новости
- `featured_image` (File) - Главное изображение
- `date` (Date) - Дата публикации
- `category` (Text) - Категория (Команда, События, Оборудование, Мастер-классы)
- `author` (Text) - Автор
- `is_hot` (Bool) - Горячая новость
- `is_featured` (Bool) - Рекомендуемая статья
- `reactions` (JSON) - Реакции пользователей
- `is_published` (Bool) - Опубликована ли
- `sort_order` (Number) - Порядок сортировки
- `reading_time` (Number) - Время чтения в минутах
- `word_count` (Number) - Количество слов
- `related_news` (JSON) - Связанные новости (массив ID)

**Правила доступа:** Публичное чтение, админ - полный доступ

---

### 6. **Коллекция `schedule`** (Расписание)
**Поля:**
- `day` (Text) - День недели
- `time` (Text) - Время (7:00 - 8:00)
- `martial_art` (Text) - Вид единоборств (Бокс, ММА, Кикбоксинг)
- `trainer_id` (Text) - ID тренера
- `level` (Text) - Уровень (beginner, intermediate, advanced, all)
- `max_participants` (Number) - Максимум участников
- `current_participants` (Number) - Текущее количество участников
- `is_active` (Bool) - Активно ли занятие
- `sort_order` (Number) - Порядок сортировки

**Правила доступа:** Публичное чтение, админ - полный доступ

---

### 7. **Коллекция `faq`** (Часто задаваемые вопросы)
**Поля:**
- `question` (Text) - Вопрос
- `answer` (Text) - Ответ
- `category` (Text) - Категория (pricing, training, schedule, equipment, age, booking)
- `is_active` (Bool) - Активен ли вопрос
- `sort_order` (Number) - Порядок сортировки

**Правила доступа:** Публичное чтение, админ - полный доступ

---

### 8. **Коллекция `contacts`** (Заявки на запись)
**Поля:**
- `name` (Text) - Имя клиента
- `phone` (Text) - Телефон
- `contact_methods` (Text) - Способы связи (через запятую)
- `message` (Text) - Дополнительная информация
- `promo_code` (Text) - Промокод (если есть)
- `status` (Text) - Статус заявки (new, contacted, completed)

**Правила доступа:** Публичное создание, админ - полный доступ

---

### 9. **Коллекция `site_settings`** (Настройки сайта)
**Поля:**
- `key` (Text) - Ключ настройки
- `value` (Text) - Значение настройки
- `type` (Text) - Тип (text, number, boolean, json, file)
- `description` (Text) - Описание настройки

**Правила доступа:** Публичное чтение, админ - полный доступ

---

### 10. **Коллекция `contact_info`** (Контактная информация)
**Поля:**
- `type` (Text) - Тип контакта (phone, email, address, social)
- `title` (Text) - Заголовок
- `value` (Text) - Значение
- `description` (Text) - Дополнительное описание
- `icon` (Text) - Иконка
- `is_active` (Bool) - Активен ли контакт
- `sort_order` (Number) - Порядок сортировки

**Правила доступа:** Публичное чтение, админ - полный доступ

---

### 11. **Коллекция `seo_meta`** (SEO метатеги)
**Поля:**
- `page` (Text) - Страница (home, about, contact, coaches, pricing, news, schedule, faq)
- `title` (Text) - Title страницы
- `description` (Text) - Meta description
- `keywords` (Text) - Meta keywords (через запятую)
- `og_title` (Text) - Open Graph title
- `og_description` (Text) - Open Graph description
- `og_image` (File) - Open Graph изображение
- `og_type` (Text) - Open Graph type (website, article, etc.)
- `twitter_card` (Text) - Twitter card type (summary, summary_large_image)
- `twitter_title` (Text) - Twitter title
- `twitter_description` (Text) - Twitter description
- `twitter_image` (File) - Twitter изображение
- `canonical_url` (Text) - Канонический URL
- `robots` (Text) - Robots meta (index, noindex, follow, nofollow)
- `is_active` (Bool) - Активны ли метатеги

**Правила доступа:** Публичное чтение, админ - полный доступ

---

### 12. **Коллекция `structured_data`** (Структурированные данные)
**Поля:**
- `page` (Text) - Страница
- `type` (Text) - Тип структурированных данных (Organization, LocalBusiness, Event, FAQ, etc.)
- `data` (JSON) - JSON-LD данные
- `is_active` (Bool) - Активны ли данные

**Правила доступа:** Публичное чтение, админ - полный доступ

---

### 13. **Коллекция `sitemap_settings`** (Настройки карты сайта)
**Поля:**
- `page` (Text) - Страница
- `priority` (Number) - Приоритет (0.1 - 1.0)
- `changefreq` (Text) - Частота изменений (always, hourly, daily, weekly, monthly, yearly, never)
- `lastmod` (Date) - Дата последнего изменения
- `is_included` (Bool) - Включать ли в sitemap

**Правила доступа:** Публичное чтение, админ - полный доступ

---

### 14. **Коллекция `seo_analytics`** (SEO аналитика)
**Поля:**
- `page` (Text) - Страница
- `date` (Date) - Дата
- `views` (Number) - Просмотры
- `unique_visitors` (Number) - Уникальные посетители
- `bounce_rate` (Number) - Показатель отказов
- `avg_time_on_page` (Number) - Среднее время на странице
- `search_queries` (JSON) - Поисковые запросы

**Правила доступа:** Публичное чтение, админ - полный доступ

---

### 15. **Коллекция `redirects`** (Редиректы)
**Поля:**
- `from_url` (Text) - Старый URL
- `to_url` (Text) - Новый URL
- `status_code` (Number) - Код редиректа (301, 302)
- `is_active` (Bool) - Активен ли редирект

**Правила доступа:** Публичное чтение, админ - полный доступ

---

## 4. ПОРЯДОК СОЗДАНИЯ КОЛЛЕКЦИЙ

1. **Основные коллекции:** `coaches`, `pricing_plans`, `news`, `schedule`, `faq`, `contacts`
2. **Настройки:** `site_settings`, `contact_info`
3. **SEO:** `seo_meta`, `structured_data`, `sitemap_settings`
4. **Аналитика:** `seo_analytics`, `redirects`
5. **Управление макетом:** `page_layout`, `section_content`

## 5. НАЧАЛЬНЫЕ ДАННЫЕ ДЛЯ `page_layout`

После создания коллекции добавьте записи для главной страницы:
- `hero` (sort_order: 10)
- `about` (sort_order: 20)
- `coaches` (sort_order: 30)
- `pricing` (sort_order: 40)
- `news` (sort_order: 50)
- `schedule` (sort_order: 60)
- `faq` (sort_order: 70)
- `contact` (sort_order: 80)

## 6. НАСТРОЙКА ПРАВИЛ ДОСТУПА

### Для всех коллекций с контентом:
- **List**: `@request.auth.id != ""` (только авторизованные пользователи)
- **View**: `@request.auth.id != ""`
- **Create**: `@request.auth.id != ""`
- **Update**: `@request.auth.id != ""`
- **Delete**: `@request.auth.id != ""`

### Для коллекции `contacts`:
- **List**: `@request.auth.id != ""`
- **View**: `@request.auth.id != ""`
- **Create**: `true` (любой может оставить заявку)
- **Update**: `@request.auth.id != ""`
- **Delete**: `@request.auth.id != ""`

### Для коллекций с настройками и SEO:
- **List**: `true` (публичное чтение)
- **View**: `true`
- **Create**: `@request.auth.id != ""`
- **Update**: `@request.auth.id != ""`
- **Delete**: `@request.auth.id != ""`

## 7. ПРИМЕРЫ НАЧАЛЬНЫХ ДАННЫХ

### Коллекция `seo_meta` - примеры:

**Для главной страницы:**
```
page: home
title: Школа единоборств JAB - Бокс, ММА, Кикбоксинг в [Город]
description: Профессиональная школа единоборств JAB. Бокс, ММА, кикбоксинг для всех уровней. Первая тренировка бесплатно! Опытные тренеры, современный зал.
keywords: бокс, ММА, кикбоксинг, единоборства, тренировки, школа, [город]
og_title: Школа единоборств JAB - Первая тренировка бесплатно!
og_description: Присоединяйтесь к школе единоборств JAB! Профессиональные тренеры, современный зал, группы по уровню подготовки.
robots: index, follow
```

**Для страницы тренеров:**
```
page: coaches
title: Наши тренеры - Школа единоборств JAB
description: Познакомьтесь с нашими тренерами - мастерами спорта с многолетним опытом. Бокс, ММА, кикбоксинг.
keywords: тренеры по боксу, тренеры ММА, тренеры кикбоксинга, мастера спорта
```

### Коллекция `structured_data` - пример:

**Для главной страницы (LocalBusiness):**
```json
{
  "page": "home",
  "type": "LocalBusiness",
  "data": {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "name": "Школа единоборств JAB",
    "description": "Профессиональная школа единоборств",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Адрес школы",
      "addressLocality": "Город",
      "addressCountry": "RU"
    },
    "telephone": "+7 (XXX) XXX-XX-XX",
    "url": "https://jab-martial-arts.ru",
    "openingHours": "Mo-Su 07:00-22:00",
    "priceRange": "$$"
  }
}
```

## 8. НАСТРОЙКА ПЕРЕМЕННЫХ ОКРУЖЕНИЯ

Создайте файл `.env.local` в корне проекта:

```env
# PocketBase
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

## 9. ЗАПУСК ПРОЕКТА

```bash
npm run dev
```

## 10. ПОЛЕЗНЫЕ СОВЕТЫ

### Порядок создания коллекций:
1. Сначала создайте основные коллекции: `coaches`, `pricing_plans`, `news`, `schedule`, `faq`, `contacts`
2. Затем создайте настройки: `site_settings`, `contact_info`
3. После этого создайте SEO коллекции: `seo_meta`, `structured_data`, `sitemap_settings`
4. В конце создайте коллекции для управления макетом: `page_layout`, `section_content`

### Тестирование:
1. После создания всех коллекций и добавления данных
2. Запустите проект: `npm run dev`
3. Откройте http://localhost:3000
4. Проверьте, что данные загружаются корректно
5. Попробуйте отправить заявку через форму

### Возможные проблемы:
- **Ошибка подключения**: Проверьте, что PocketBase запущен на порту 8090
- **Данные не загружаются**: Проверьте правила доступа в коллекциях
- **Ошибка в форме**: Убедитесь, что коллекция `contacts` имеет правило Create: `true`

### Дополнительные возможности:
- Добавьте больше записей в расписание
- Загрузите фотографии тренеров
- Настройте уведомления о новых заявках
- Добавьте дополнительные поля в коллекции по необходимости
- Настройте SEO для всех страниц
- Добавьте структурированные данные для лучшего SEO

## 11. КЛЮЧЕВЫЕ ПРИНЦИПЫ

1. **Никакого хардкода** - все тексты, цены, расписание, новости загружаются из PocketBase
2. **Гибкость** - легко добавлять новые записи через админку PocketBase
3. **Связи** - тренеры связаны с расписанием через relation
4. **Сортировка** - поля `sort_order` для управления порядком отображения
5. **Активность** - поля `is_active` для включения/выключения записей
6. **Категоризация** - категории для новостей, FAQ, контактов
7. **SEO-оптимизация** - полный контроль над метатегами и структурированными данными
8. **Управление макетом** - возможность переставлять секции и управлять их видимостью

Эта структура позволит вам полностью управлять контентом сайта через PocketBase, не прибегая к изменению кода!
