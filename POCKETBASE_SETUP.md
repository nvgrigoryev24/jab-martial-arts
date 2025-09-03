# Настройка PocketBase для школы единоборств JAB

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

## 3. Создание коллекций через UI

### Коллекция "trainers" (Тренеры)

1. **Создание коллекции:**
   - Нажмите "New collection"
   - Название: `trainers`
   - Type: `Base`
   - Нажмите "Create"

2. **Добавление полей:**
   
   **Поле "name":**
   - Нажмите "New field"
   - Name: `name`
   - Type: `Text`
   - Required: ✅
   - Нажмите "Create"

   **Поле "specialization":**
   - Name: `specialization`
   - Type: `Text`
   - Required: ✅
   - Нажмите "Create"

   **Поле "experience":**
   - Name: `experience`
   - Type: `Number`
   - Required: ✅
   - Min: `0`
   - Нажмите "Create"

   **Поле "description":**
   - Name: `description`
   - Type: `Text`
   - Required: ✅
   - Нажмите "Create"

   **Поле "photo":**
   - Name: `photo`
   - Type: `File`
   - Required: ❌
   - Max files: `1`
   - Max size: `5MB`
   - Allowed types: `image/*`
   - Нажмите "Create"

   **Поле "achievements":**
   - Name: `achievements`
   - Type: `JSON`
   - Required: ❌
   - Нажмите "Create"

3. **Настройка правил доступа:**
   - Перейдите в "Settings" → "API rules"
   - List: `@request.auth.id != ""`
   - View: `@request.auth.id != ""`
   - Create: `@request.auth.id != ""`
   - Update: `@request.auth.id != ""`
   - Delete: `@request.auth.id != ""`

### Коллекция "martial_arts" (Виды единоборств)

1. **Создание коллекции:**
   - Название: `martial_arts`
   - Type: `Base`

2. **Добавление полей:**
   
   **Поле "name":**
   - Name: `name`
   - Type: `Text`
   - Required: ✅

   **Поле "description":**
   - Name: `description`
   - Type: `Text`
   - Required: ✅

   **Поле "icon":**
   - Name: `icon`
   - Type: `Text`
   - Required: ✅
   - Default: `🥊`

   **Поле "features":**
   - Name: `features`
   - Type: `JSON`
   - Required: ✅

   **Поле "price":**
   - Name: `price`
   - Type: `Number`
   - Required: ✅
   - Min: `0`

   **Поле "duration":**
   - Name: `duration`
   - Type: `Number`
   - Required: ✅
   - Min: `30`
   - Max: `180`

   **Поле "level":**
   - Name: `level`
   - Type: `Select`
   - Required: ✅
   - Values: `beginner,intermediate,advanced,all`
   - Default: `all`

3. **Настройка правил доступа:** (аналогично trainers)

### Коллекция "schedule" (Расписание)

1. **Создание коллекции:**
   - Название: `schedule`
   - Type: `Base`

2. **Добавление полей:**
   
   **Поле "day":**
   - Name: `day`
   - Type: `Text`
   - Required: ✅

   **Поле "time":**
   - Name: `time`
   - Type: `Text`
   - Required: ✅

   **Поле "martial_art":**
   - Name: `martial_art`
   - Type: `Relation`
   - Required: ✅
   - Collection: `martial_arts`
   - Max select: `1`

   **Поле "trainer":**
   - Name: `trainer`
   - Type: `Relation`
   - Required: ✅
   - Collection: `trainers`
   - Max select: `1`

   **Поле "level":**
   - Name: `level`
   - Type: `Select`
   - Required: ✅
   - Values: `beginner,intermediate,advanced,all`

   **Поле "max_participants":**
   - Name: `max_participants`
   - Type: `Number`
   - Required: ✅
   - Min: `1`
   - Max: `20`

   **Поле "current_participants":**
   - Name: `current_participants`
   - Type: `Number`
   - Required: ✅
   - Min: `0`
   - Default: `0`

3. **Настройка правил доступа:** (аналогично trainers)

### Коллекция "contacts" (Контакты/Заявки)

1. **Создание коллекции:**
   - Название: `contacts`
   - Type: `Base`

2. **Добавление полей:**
   
   **Поле "name":**
   - Name: `name`
   - Type: `Text`
   - Required: ✅

   **Поле "phone":**
   - Name: `phone`
   - Type: `Text`
   - Required: ✅

   **Поле "email":**
   - Name: `email`
   - Type: `Email`
   - Required: ❌

   **Поле "message":**
   - Name: `message`
   - Type: `Text`
   - Required: ❌

   **Поле "martial_art":**
   - Name: `martial_art`
   - Type: `Text`
   - Required: ❌

   **Поле "status":**
   - Name: `status`
   - Type: `Select`
   - Required: ✅
   - Values: `new,contacted,scheduled,completed`
   - Default: `new`

3. **Настройка правил доступа:**
   - List: `@request.auth.id != ""`
   - View: `@request.auth.id != ""`
   - Create: `true` (любой может оставить заявку)
   - Update: `@request.auth.id != ""`
   - Delete: `@request.auth.id != ""`

## 3. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
```

## 4. Настройка правил доступа

Для всех коллекций установите правила доступа:
- **List**: `@request.auth.id != ""` (только авторизованные пользователи)
- **View**: `@request.auth.id != ""`
- **Create**: `@request.auth.id != ""`
- **Update**: `@request.auth.id != ""`
- **Delete**: `@request.auth.id != ""`

Для коллекции "contacts" можно разрешить создание без авторизации:
- **Create**: `true` (любой может оставить заявку)

## 5. Заполнение тестовыми данными

### Коллекция "martial_arts" - тестовые данные:

**Запись 1:**
- name: `Бокс`
- description: `Классический английский бокс. Развитие скорости, силы удара и тактического мышления.`
- icon: `🥊`
- features: `["Техника ударов", "Защита и уклонения", "Работа в парах", "Спарринги"]`
- price: `3000`
- duration: `60`
- level: `all`

**Запись 2:**
- name: `ММА`
- description: `Смешанные единоборства. Комбинация ударной и борцовской техники.`
- icon: `🥋`
- features: `["Ударная техника", "Борьба в стойке", "Борьба в партере", "Клинич"]`
- price: `3500`
- duration: `90`
- level: `all`

**Запись 3:**
- name: `Кикбоксинг`
- description: `Современный вид единоборств, сочетающий удары руками и ногами.`
- icon: `🦵`
- features: `["Удары ногами", "Удары руками", "Клинич", "Работа в тайском стиле"]`
- price: `3200`
- duration: `60`
- level: `all`

### Коллекция "trainers" - тестовые данные:

**Запись 1:**
- name: `Иван Петров`
- specialization: `Бокс, ММА`
- experience: `8`
- description: `Мастер спорта по боксу, тренер с 8-летним стажем. Специализируется на работе с начинающими спортсменами.`
- achievements: `["Мастер спорта по боксу", "Чемпион области 2020", "Сертифицированный тренер"]`

**Запись 2:**
- name: `Алексей Сидоров`
- specialization: `ММА, Кикбоксинг`
- experience: `12`
- description: `Профессиональный боец ММА, тренер с 12-летним опытом. Работает с бойцами всех уровней.`
- achievements: `["Профессиональный боец ММА", "Чемпион России 2019", "Сертификат тренера высшей категории"]`

**Запись 3:**
- name: `Мария Козлова`
- specialization: `Кикбоксинг, Бокс`
- experience: `6`
- description: `Мастер спорта по кикбоксингу, специализируется на женских группах и индивидуальных тренировках.`
- achievements: `["Мастер спорта по кикбоксингу", "Чемпионка мира 2021", "Сертифицированный инструктор"]`

### Коллекция "schedule" - тестовые данные:

**Запись 1:**
- day: `Понедельник`
- time: `7:00 - 8:00`
- martial_art: `[ID записи "Бокс"]`
- trainer: `[ID записи "Иван Петров"]`
- level: `beginner`
- max_participants: `12`
- current_participants: `8`

**Запись 2:**
- day: `Понедельник`
- time: `18:00 - 19:00`
- martial_art: `[ID записи "ММА"]`
- trainer: `[ID записи "Алексей Сидоров"]`
- level: `intermediate`
- max_participants: `10`
- current_participants: `6`

**Запись 3:**
- day: `Понедельник`
- time: `19:30 - 20:30`
- martial_art: `[ID записи "Кикбоксинг"]`
- trainer: `[ID записи "Мария Козлова"]`
- level: `advanced`
- max_participants: `8`
- current_participants: `5`

### Как добавить данные:

1. Перейдите в нужную коллекцию в админ-панели
2. Нажмите "New record"
3. Заполните поля согласно данным выше
4. Для полей типа JSON используйте формат: `["элемент1", "элемент2", "элемент3"]`
5. Для полей типа Relation выберите соответствующую запись из связанной коллекции
6. Нажмите "Create"

## 6. Запуск проекта

```bash
npm run dev
```

Теперь ваш лендинг будет получать данные из PocketBase!

## 7. Полезные советы

### Порядок создания коллекций:
1. Сначала создайте `martial_arts` и `trainers`
2. Затем создайте `schedule` (так как она ссылается на предыдущие)
3. В последнюю очередь создайте `contacts`

### Настройка правил доступа:
- Для коллекций с контентом (trainers, martial_arts, schedule) - только авторизованные пользователи
- Для коллекции contacts - разрешить создание всем (чтобы посетители могли оставлять заявки)

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
