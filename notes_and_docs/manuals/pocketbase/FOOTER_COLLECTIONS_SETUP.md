# Настройка коллекций PocketBase для футера

## Обзор
Документ описывает структуру коллекций PocketBase для управления контентом футера сайта JAB Martial Arts.

## Коллекции

### 1. `footer_content` - Основной контент футера

**Описание:** Содержит основную информацию о школе в футере.

**Поля для создания:**
- `title` (Text) - Название школы (например: "JAB")
- `description` (Text) - Описание школы
- `logo_url` (File) - Логотип школы (опционально)
- `copyright_text` (Text) - Текст копирайта
- `is_active` (Bool) - Активен ли контент
- `created` (DateTime) - Дата создания
- `updated` (DateTime) - Дата обновления

**Настройки полей:**
- `title`: Обязательное поле, максимум 50 символов
- `description`: Обязательное поле, максимум 500 символов
- `logo_url`: Опциональное поле, только изображения (image/*), максимум 2MB
- `copyright_text`: Обязательное поле, максимум 200 символов
- `is_active`: По умолчанию true

### 2. `footer_links` - Навигационные ссылки

**Описание:** Ссылки для навигации в футере.

**Поля для создания:**
- `title` (Text) - Название ссылки
- `href` (Text) - URL ссылки
- `section` (Select) - Секция футера (navigation, legal, support)
- `sort_order` (Number) - Порядок отображения
- `is_active` (Bool) - Активна ли ссылка
- `created` (DateTime) - Дата создания
- `updated` (DateTime) - Дата обновления

**Настройки полей:**
- `title`: Обязательное поле, максимум 100 символов
- `href`: Обязательное поле, максимум 500 символов
- `section`: Обязательное поле, варианты: "navigation", "legal", "support"
- `sort_order`: Обязательное поле, целое число
- `is_active`: По умолчанию true

### 3. `footer_contacts` - Контактная информация

**Описание:** Контактные данные школы.

**Поля для создания:**
- `type` (Select) - Тип контакта (phone, email, address, schedule)
- `label` (Text) - Название контакта
- `value` (Text) - Значение контакта
- `icon` (Text) - Эмодзи иконка
- `sort_order` (Number) - Порядок отображения
- `is_active` (Bool) - Активен ли контакт
- `created` (DateTime) - Дата создания
- `updated` (DateTime) - Дата обновления

**Настройки полей:**
- `type`: Обязательное поле, варианты: "phone", "email", "address", "schedule"
- `label`: Обязательное поле, максимум 100 символов
- `value`: Обязательное поле, максимум 200 символов
- `icon`: Обязательное поле, максимум 10 символов (эмодзи)
- `sort_order`: Обязательное поле, целое число
- `is_active`: По умолчанию true

### 4. Социальные сети

**Описание:** Для социальных сетей в футере используется существующая коллекция `social_links` (см. раздел Header). Это позволяет избежать дублирования данных и обеспечивает единообразие социальных ссылок по всему сайту.

## Примеры данных

### footer_content
```json
{
  "title": "JAB",
  "description": "Профессиональная школа единоборств. Развиваем силу, выносливость и характер.",
  "copyright_text": "© 2024 JAB - Школа единоборств. Все права защищены.",
  "is_active": true
}
```

### footer_links
```json
[
  {
    "title": "О школе",
    "href": "#about",
    "section": "navigation",
    "sort_order": 1,
    "is_active": true
  },
  {
    "title": "Тренеры",
    "href": "#coaches",
    "section": "navigation",
    "sort_order": 2,
    "is_active": true
  },
  {
    "title": "Расписание",
    "href": "#schedule",
    "section": "navigation",
    "sort_order": 3,
    "is_active": true
  },
  {
    "title": "Контакты",
    "href": "#contact",
    "section": "navigation",
    "sort_order": 4,
    "is_active": true
  }
]
```

### footer_contacts
```json
[
  {
    "type": "phone",
    "label": "Телефон",
    "value": "+7 (XXX) XXX-XX-XX",
    "icon": "📞",
    "sort_order": 1,
    "is_active": true
  },
  {
    "type": "email",
    "label": "Email",
    "value": "info@jab-martial-arts.ru",
    "icon": "📧",
    "sort_order": 2,
    "is_active": true
  },
  {
    "type": "address",
    "label": "Адрес",
    "value": "Адрес школы",
    "icon": "📍",
    "sort_order": 3,
    "is_active": true
  },
  {
    "type": "schedule",
    "label": "Часы работы",
    "value": "Пн-Вс: 7:00 - 22:00",
    "icon": "🕒",
    "sort_order": 4,
    "is_active": true
  }
]
```


## Настройка прав доступа

### Правила для чтения (List, View)
- Все коллекции: `@request.auth.id != ""` (только для авторизованных пользователей)
- Или для публичного доступа: `is_active = true`

### Правила для создания (Create)
- Только администраторы: `@request.auth.role = "admin"`

### Правила для обновления (Update)
- Только администраторы: `@request.auth.role = "admin"`

### Правила для удаления (Delete)
- Только администраторы: `@request.auth.role = "admin"`

## Рекомендации

1. **Логотип:** Используйте формат SVG или PNG с прозрачным фоном
2. **Иконки социальных сетей:** Рекомендуемый размер 32x32px или 64x64px
3. **Сортировка:** Используйте `sort_order` для управления порядком отображения
4. **Активность:** Используйте `is_active` для временного скрытия элементов
5. **Валидация:** Настройте валидацию URL для ссылок
6. **Индексы:** Создайте индексы для `section`, `sort_order`, `is_active` для оптимизации запросов

## Интеграция с фронтендом

После создания коллекций необходимо:
1. Обновить интерфейсы в `src/lib/pocketbase.ts`
2. Создать функции для загрузки данных
3. Обновить компонент `Footer.tsx` для использования данных из PocketBase
4. Добавить обработку ошибок и fallback данные
