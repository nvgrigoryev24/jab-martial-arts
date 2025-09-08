# 📦 Инструкция по созданию бэкапов проекта JAB Martial Arts

## 🎯 Цель
Создание надежных резервных копий проекта для сохранения важных изменений и возможности отката к предыдущим версиям.

## 📋 Когда создавать бэкапы

### Обязательные случаи:
- ✅ Перед крупными изменениями в архитектуре
- ✅ После завершения важных функций/секций
- ✅ Перед обновлением зависимостей
- ✅ Перед изменением структуры базы данных PocketBase
- ✅ Перед рефакторингом компонентов

### Рекомендуемые случаи:
- 🔄 После каждого коммита с новой функциональностью
- 🔄 Перед экспериментальными изменениями
- 🔄 При обновлении документации

## 🛠️ Как создавать бэкапы

### 1. Формат бэкапа
**ВСЕГДА используйте формат `.tar.gz`** - это стандарт проекта.

### 2. Структура команды
```bash
tar -czf backups/jab-martial-arts-[VERSION]-[DESCRIPTION]-$(date +%Y%m%d_%H%M%S).tar.gz [ФАЙЛЫ_И_ПАПКИ]
```

### 3. Примеры команд

#### Полный бэкап проекта:
```bash
tar -czf backups/jab-martial-arts-[VERSION]-full-$(date +%Y%m%d_%H%M%S).tar.gz \
  src/ \
  notes_and_docs/ \
  README.md \
  CHANGELOG.md \
  package.json \
  package-lock.json \
  next.config.ts \
  tailwind.config.js \
  tsconfig.json
```

#### Бэкап конкретной функции:
```bash
tar -czf backups/jab-martial-arts-v1.8.0-FAQ-Integration-$(date +%Y%m%d_%H%M%S).tar.gz \
  src/components/FAQSection.tsx \
  src/lib/pocketbase.ts \
  src/app/globals.css \
  notes_and_docs/ \
  README.md \
  CHANGELOG.md
```

#### Бэкап документации:
```bash
tar -czf backups/jab-martial-arts-[VERSION]-docs-$(date +%Y%m%d_%H%M%S).tar.gz \
  notes_and_docs/ \
  README.md \
  CHANGELOG.md
```

## 📁 Где сохранять бэкапы

### 1. Основное место хранения
**Папка проекта**: `backups/`
- Все бэкапы проекта хранятся здесь
- Формат имени: `jab-martial-arts-[VERSION]-[DESCRIPTION]-[TIMESTAMP].tar.gz`

### 2. Дублирование в домашней папке
**Домашняя папка**: `~/backup/`
- Создавайте копии важных бэкапов здесь
- Формат имени: `jab-martial-arts-[VERSION]-[DESCRIPTION]-[TIMESTAMP].tar.gz`

### 3. Структура папок
```
backups/                                    # В проекте
├── jab-martial-arts-v1.0.0-20250904.tar.gz
├── jab-martial-arts-v1.3.0-20250907_085828.tar.gz
├── jab-martial-arts-v1.8.0-FAQ-Integration-20250908_092143.tar.gz
└── ...

~/backup/                                   # В домашней папке
├── jab-martial-arts-v1.8.0-FAQ-Integration-20250908_092143.tar.gz
└── ...
```

## 🏷️ Правила именования

### Формат имени файла:
```
jab-martial-arts-[VERSION]-[DESCRIPTION]-[TIMESTAMP].tar.gz
```

### Компоненты имени:
- **jab-martial-arts** - префикс проекта (всегда)
- **[VERSION]** - версия проекта (например: v1.8.0)
- **[DESCRIPTION]** - краткое описание изменений (например: FAQ-Integration, About-Section, Docs-Update)
- **[TIMESTAMP]** - дата и время в формате YYYYMMDD_HHMMSS

### Примеры правильных имен:
- `jab-martial-arts-v1.8.0-FAQ-Integration-20250908_092143.tar.gz`
- `jab-martial-arts-v1.7.0-About-Section-20250907_143022.tar.gz`
- `jab-martial-arts-v1.6.0-Docs-Update-20250906_201647.tar.gz`

## 📦 Что включать в бэкап

### Обязательные файлы:
- ✅ `src/components/[ComponentName].tsx` - измененные компоненты
- ✅ `src/lib/pocketbase.ts` - изменения в PocketBase интеграции
- ✅ `notes_and_docs/` - вся документация
- ✅ `README.md` - обновленный README
- ✅ `CHANGELOG.md` - обновленный changelog

### Дополнительные файлы (при необходимости):
- 🔧 `src/app/globals.css` - изменения стилей
- 🔧 `package.json` - изменения зависимостей
- 🔧 `next.config.ts` - изменения конфигурации
- 🔧 `tailwind.config.js` - изменения Tailwind

### НЕ включать:
- ❌ `node_modules/` - слишком большой размер
- ❌ `.next/` - временные файлы сборки
- ❌ `pb_data/` - данные PocketBase (отдельный бэкап)
- ❌ `.git/` - git история (отдельный бэкап)

## 🔄 Процесс создания бэкапа

### Шаг 1: Определить тип бэкапа
- Полный бэкап проекта
- Бэкап конкретной функции
- Бэкап документации

### Шаг 2: Подготовить команду
```bash
# Пример для функции FAQ
tar -czf backups/jab-martial-arts-v1.8.0-FAQ-Integration-$(date +%Y%m%d_%H%M%S).tar.gz \
  src/components/FAQSection.tsx \
  src/lib/pocketbase.ts \
  src/app/globals.css \
  notes_and_docs/ \
  README.md \
  CHANGELOG.md
```

### Шаг 3: Создать бэкап в проекте
```bash
# Выполнить команду tar
```

### Шаг 4: Создать копию в домашней папке
```bash
# Скопировать созданный файл
cp backups/jab-martial-arts-v1.8.0-FAQ-Integration-*.tar.gz ~/backup/
```

### Шаг 5: Проверить результат
```bash
# Проверить создание бэкапа
ls -la backups/ | grep [VERSION]

# Проверить размер файла
du -h backups/jab-martial-arts-v1.8.0-FAQ-Integration-*.tar.gz
```

## 🚫 Чего НЕ делать

### ❌ Неправильные форматы:
- Не создавайте папки внутри папок (`backup/v1.8.0/`)
- Не используйте `.zip` формат
- Не создавайте отдельные файлы без архивации

### ❌ Неправильные имена:
- Не используйте пробелы в именах
- Не используйте кириллицу в именах
- Не забывайте про timestamp

### ❌ Неправильное содержимое:
- Не включайте `node_modules/`
- Не включайте временные файлы
- Не включайте `.git/` папку

## 📊 Мониторинг бэкапов

### Проверка размера:
```bash
# Размер всех бэкапов
du -sh backups/

# Размер конкретного бэкапа
du -h backups/jab-martial-arts-v1.8.0-FAQ-Integration-*.tar.gz
```

### Проверка содержимого:
```bash
# Просмотр содержимого архива
tar -tzf backups/jab-martial-arts-v1.8.0-FAQ-Integration-*.tar.gz

# Извлечение архива для проверки
tar -xzf backups/jab-martial-arts-v1.8.0-FAQ-Integration-*.tar.gz -C /tmp/test/
```

## 🔧 Восстановление из бэкапа

### Извлечение архива:
```bash
# Извлечь в текущую папку
tar -xzf backups/jab-martial-arts-v1.8.0-FAQ-Integration-*.tar.gz

# Извлечь в конкретную папку
tar -xzf backups/jab-martial-arts-v1.8.0-FAQ-Integration-*.tar.gz -C /path/to/restore/
```

### Проверка перед восстановлением:
```bash
# Просмотр содержимого без извлечения
tar -tzf backups/jab-martial-arts-v1.8.0-FAQ-Integration-*.tar.gz
```

## 📝 Логирование

### Обновление backup-log.txt:
```bash
# Добавить запись в лог
echo "$(date): Created backup jab-martial-arts-v1.8.0-FAQ-Integration-$(date +%Y%m%d_%H%M%S).tar.gz" >> backups/backup-log.txt
```

---

## 🎯 Краткая памятка

1. **Формат**: `.tar.gz` всегда
2. **Место**: `backups/` в проекте + `~/backup/` в домашней папке
3. **Имя**: `jab-martial-arts-[VERSION]-[DESCRIPTION]-[TIMESTAMP].tar.gz`
4. **Содержимое**: только нужные файлы, без `node_modules/`
5. **Проверка**: всегда проверяйте размер и содержимое

---

*Последнее обновление: 8 сентября 2025*
*Версия инструкции: 1.0*
