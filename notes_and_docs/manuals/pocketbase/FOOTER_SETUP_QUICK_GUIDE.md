# Быстрое руководство по настройке футера

## Создание коллекций в PocketBase

### 1. footer_content
**Поля:**
- `title` (Text) - "JAB"
- `description` (Text) - "Профессиональная школа единоборств..."
- `logo_url` (File) - логотип (опционально)
- `copyright_text` (Text) - "© 2024 JAB - Школа единоборств..."
- `is_active` (Bool) - true

### 2. footer_links
**Поля:**
- `title` (Text) - "О школе"
- `href` (Text) - "#about"
- `section` (Select) - "navigation" (варианты: navigation, legal, support)
- `sort_order` (Number) - 1
- `is_active` (Bool) - true

**Примеры записей:**
- О школе → #about → navigation → 1
- Тренеры → #coaches → navigation → 2
- Расписание → #schedule → navigation → 3
- Контакты → #contact → navigation → 4

### 3. footer_contacts
**Поля:**
- `type` (Select) - "phone" (варианты: phone, email, address, schedule)
- `label` (Text) - "Телефон"
- `value` (Text) - "+7 (XXX) XXX-XX-XX"
- `icon` (Text) - "📞"
- `sort_order` (Number) - 1
- `is_active` (Bool) - true

**Примеры записей:**
- phone → Телефон → +7 (XXX) XXX-XX-XX → 📞 → 1
- email → Email → info@jab-martial-arts.ru → 📧 → 2
- address → Адрес → Адрес школы → 📍 → 3
- schedule → Часы работы → Пн-Вс: 7:00 - 22:00 → 🕒 → 4

### 4. Социальные сети
**Используется существующая коллекция `social_links`** (см. Header)
- Нет необходимости создавать отдельную коллекцию
- Социальные ссылки едины для Header и Footer

## Настройка прав доступа

**Для всех коллекций:**
- **List/View:** `is_active = true` (публичный доступ)
- **Create/Update/Delete:** `@request.auth.role = "admin"` (только админы)

## Результат

После создания коллекций футер будет:
- ✅ Загружать данные из PocketBase
- ✅ Показывать заглушки во время загрузки
- ✅ Использовать fallback данные если коллекции не найдены
- ✅ Поддерживать изображения для социальных сетей
- ✅ Позволять управлять контентом через админку PocketBase
