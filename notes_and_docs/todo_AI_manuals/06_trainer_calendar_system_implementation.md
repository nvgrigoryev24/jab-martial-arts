# 📅 Реализация системы календаря тренера

**Приоритет:** Высокий  
**Сложность:** Средняя-Высокая  
**Время реализации:** 10-14 дней  
**Зависимости:** Telegram Bot, PocketBase Collections

## 🎯 Цель

Создать систему управления расписанием для тренеров с возможностью CRUD операций через UI. В текущей итерации система работает с расписанием по дням недели. Функциональность конкретных дат и повторяющихся тренировок будет реализована в следующей версии.

## 📋 Чек-лист реализации

### Этап 1: Подготовка инфраструктуры (1-2 дня)

#### PocketBase Collections
- [ ] **Создать коллекцию `schedule_exceptions`**
  - Поля: `parent_schedule_id`, `exception_date`, `type`, `is_cancelled`, `cancellation_reason`, `new_start_time`, `new_end_time`, `new_location`, `new_coaches`, `new_level`, `created_by`
  - Настроить правила доступа (только тренеры могут создавать исключения для своих тренировок)
  - Добавить валидацию полей

- [ ] **Создать коллекцию `trainer_sessions`**
  - Поля: `trainer_id`, `session_token`, `expires_at`, `is_active`
  - Настроить автоматическое удаление истекших сессий
  - Добавить индексы для быстрого поиска по токену

- [ ] **Обновить коллекцию `schedule`**
  - Добавить поле `created_by` (связь с тренером)
  - Обновить правила доступа для CRUD операций
  - Добавить валидацию пересечений времени

#### API Endpoints
- [ ] **Создать функции в `src/lib/pocketbase.ts`:**
  ```typescript
  // Управление тренировками
  export const createSchedule = async (scheduleData: CreateScheduleData): Promise<Schedule>
  export const updateSchedule = async (id: string, scheduleData: UpdateScheduleData): Promise<Schedule>
  export const deleteSchedule = async (id: string): Promise<boolean>
  export const getScheduleByTrainer = async (trainerId: string): Promise<Schedule[]>
  
  // Управление исключениями
  export const createScheduleException = async (exceptionData: CreateExceptionData): Promise<ScheduleException>
  export const updateScheduleException = async (id: string, exceptionData: UpdateExceptionData): Promise<ScheduleException>
  export const deleteScheduleException = async (id: string): Promise<boolean>
  export const getScheduleExceptions = async (scheduleId: string): Promise<ScheduleException[]>
  
  // Получение расписания на дату/неделю
  export const getScheduleForDate = async (date: string): Promise<Schedule[]>
  export const getScheduleForWeek = async (startDate: string): Promise<Record<string, Schedule[]>>
  export const getScheduleForMonth = async (year: number, month: number): Promise<Record<string, Schedule[]>>
  ```

### Этап 2: Базовый календарь (2-3 дня)

#### Календарный компонент
- [ ] **Создать `src/components/TrainerCalendar.tsx`**
  - Недельный вид с навигацией
  - Отображение тренировок с цветовой кодировкой
  - Поддержка мобильной версии
  - Индикаторы отмененных/измененных тренировок

- [ ] **Создать `src/components/CalendarWeek.tsx`**
  - Отображение одной недели
  - Обработка кликов по дням/тренировкам
  - Drag & drop для перемещения тренировок

- [ ] **Создать `src/components/CalendarDay.tsx`**
  - Отображение одного дня
  - Список тренировок с временными слотами
  - Индикаторы статуса тренировок

#### Утилитарные функции
- [ ] **Создать `src/lib/calendarUtils.ts`:**
  ```typescript
  export const getWeekDates = (date: Date): Date[]
  export const getMonthDates = (year: number, month: number): Date[]
  export const formatWeekRange = (startDate: Date, endDate: Date): string
  export const isSameDay = (date1: Date, date2: Date): boolean
  export const isToday = (date: Date): boolean
  export const isPast = (date: Date): boolean
  export const getTimeSlots = (startTime: string, endTime: string, duration: number): string[]
  ```

### Этап 3: CRUD операции (3-4 дня)

#### Формы создания/редактирования
- [ ] **Создать `src/components/ScheduleForm.tsx`**
  - Форма создания новой тренировки
  - Валидация полей в реальном времени
  - Поддержка повторяющихся тренировок
  - Предпросмотр результата

- [ ] **Создать `src/components/EditScheduleModal.tsx`**
  - Модальное окно для редактирования
  - Загрузка существующих данных
  - Валидация изменений
  - Подтверждение сохранения

- [ ] **Создать `src/components/DeleteScheduleModal.tsx`**
  - Подтверждение удаления
  - Выбор типа удаления (разовое/повторяющееся)
  - Указание причины удаления

#### Валидация и обработка ошибок
- [ ] **Создать `src/lib/scheduleValidation.ts`:**
  ```typescript
  export const validateScheduleData = (data: ScheduleData): ValidationResult
  export const checkTimeConflicts = (schedule: Schedule, existingSchedules: Schedule[]): ConflictResult
  export const validateRepeatableSchedule = (data: RepeatableScheduleData): ValidationResult
  export const sanitizeScheduleData = (data: any): ScheduleData
  ```

- [ ] **Создать `src/components/ValidationErrors.tsx`**
  - Отображение ошибок валидации
  - Подсказки по исправлению
  - Индикаторы конфликтов времени

### Этап 4: Система исключений (2-3 дня)

#### Управление исключениями
- [ ] **Создать `src/components/ScheduleExceptionModal.tsx`**
  - Создание исключения для конкретной даты
  - Выбор типа исключения (отмена/изменение)
  - Форма для изменения параметров тренировки

- [ ] **Создать `src/components/ExceptionList.tsx`**
  - Список всех исключений для тренировки
  - Возможность редактирования/удаления
  - Отображение причин исключений

#### Логика обработки исключений
- [ ] **Обновить `src/lib/scheduleUtils.ts`:**
  ```typescript
  export const applyScheduleExceptions = (schedule: Schedule[], exceptions: ScheduleException[]): Schedule[]
  export const getEffectiveSchedule = (baseSchedule: Schedule, exceptions: ScheduleException[], targetDate: string): Schedule | null
  export const isScheduleCancelled = (schedule: Schedule, exceptions: ScheduleException[], targetDate: string): boolean
  export const getScheduleModifications = (schedule: Schedule, exceptions: ScheduleException[], targetDate: string): Partial<Schedule>
  ```

### Этап 5: Авторизация и безопасность (1-2 дня)

#### Система авторизации тренеров
- [ ] **Создать `src/lib/trainerAuth.ts`:**
  ```typescript
  export const authenticateTrainer = async (telegramData: TelegramAuthData): Promise<TrainerSession>
  export const validateTrainerSession = async (token: string): Promise<TrainerSession | null>
  export const refreshTrainerSession = async (token: string): Promise<TrainerSession>
  export const logoutTrainer = async (token: string): Promise<boolean>
  ```

- [ ] **Создать `src/components/TrainerLogin.tsx`**
  - Форма входа через Telegram
  - Обработка авторизации
  - Сохранение сессии

- [ ] **Создать `src/components/ProtectedRoute.tsx`**
  - Защита маршрутов для тренеров
  - Проверка авторизации
  - Редирект на страницу входа

#### Middleware для API
- [ ] **Создать `src/middleware/trainerAuth.ts`:**
  - Проверка токенов авторизации
  - Валидация прав доступа
  - Логирование действий тренеров

### Этап 6: Полировка и тестирование (1-2 дня)

#### Оптимизация производительности
- [ ] **Добавить кэширование:**
  - Кэш расписания на неделю
  - Кэш исключений
  - Инвалидация кэша при изменениях

- [ ] **Оптимизировать запросы:**
  - Batch запросы для получения данных
  - Lazy loading для больших периодов
  - Debounce для поиска и фильтрации

#### Тестирование
- [ ] **Создать тесты для критических функций:**
  - Валидация данных расписания
  - Применение исключений
  - Проверка конфликтов времени
  - Авторизация тренеров

- [ ] **Тестирование UI:**
  - Все сценарии создания/редактирования
  - Мобильная версия
  - Различные разрешения экрана
  - Работа с большим количеством тренировок

## 🔧 Технические детали

### Структура данных
```typescript
interface ScheduleData {
  day: string;
  start_time: string;
  end_time: string;
  location: string;
  coaches: string[];
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  created_by: string;
}

interface ScheduleExceptionData {
  parent_schedule_id: string;
  exception_date: string;
  type: 'cancelled' | 'modified';
  is_cancelled?: boolean;
  cancellation_reason?: string;
  new_start_time?: string;
  new_end_time?: string;
  new_location?: string;
  new_coaches?: string[];
  new_level?: string;
  created_by: string;
}
```

### Алгоритм получения расписания
```typescript
async function getScheduleForDay(dayOfWeek: string): Promise<Schedule[]> {
  // Получаем все активные тренировки для указанного дня недели
  const schedules = await pb.collection('schedule').getList(1, 50, {
    filter: `day = "${dayOfWeek}" && is_active = true`,
    expand: 'location,coaches',
    sort: 'start_time'
  });
  
  return schedules.items;
}
```

### Валидация пересечений времени
```typescript
function validateTimeConflicts(newSchedule: ScheduleData, existingSchedules: Schedule[]): ValidationResult {
  const conflicts = existingSchedules.filter(existing => {
    // Проверяем пересечение времени
    const timeOverlap = isTimeOverlapping(
      newSchedule.start_time, newSchedule.end_time,
      existing.start_time, existing.end_time
    );
    
    // Проверяем пересечение тренеров
    const coachOverlap = newSchedule.coaches.some(coach => 
      existing.coaches.includes(coach)
    );
    
    // Проверяем пересечение локации
    const locationOverlap = newSchedule.location === existing.location;
    
    return timeOverlap && (coachOverlap || locationOverlap);
  });
  
  return {
    hasConflicts: conflicts.length > 0,
    conflicts: conflicts.map(c => ({
      id: c.id,
      reason: getConflictReason(newSchedule, c),
      severity: 'warning' | 'error'
    }))
  };
}
```

## 📱 UI/UX требования

### Календарный виджет
- **Недельный вид** с возможностью переключения на месячный
- **Навигация** стрелками и выбором даты
- **Цветовая кодировка** для разных типов тренировок
- **Индикаторы** для отмененных/измененных тренировок
- **Hover эффекты** с предпросмотром деталей

### Формы
- **Валидация в реальном времени** с подсказками
- **Автозаполнение** на основе предыдущих тренировок
- **Предпросмотр** результата перед сохранением
- **Подтверждение** для критических действий

### Мобильная версия
- **Touch-friendly** интерфейс
- **Swipe навигация** между неделями
- **Адаптивные модальные окна**
- **Оптимизированные формы** для мобильных устройств

## 🚨 Важные моменты

1. **Производительность**: При большом количестве тренировок система должна работать быстро
2. **Безопасность**: Только авторизованные тренеры могут управлять своими тренировками
3. **Консистентность**: Все изменения должны быть атомарными
4. **Аудит**: Логирование всех действий для отслеживания изменений
5. **Офлайн поддержка**: Возможность работы без интернета с синхронизацией

## 📚 Связанные документы

- [Trainer Calendar System Plan](../notes/2025-01-15_trainer_calendar_system.md)
- [PocketBase Collections Setup](../manuals/pocketbase/POCKETBASE_COLLECTIONS_SETUP.md)
- [Telegram Bot Integration](../manuals/telegram/TELEGRAM_BOT_SETUP.md)
