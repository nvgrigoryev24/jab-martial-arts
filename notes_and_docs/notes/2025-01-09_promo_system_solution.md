# 🎯 Система промокодов с Telegram-аутентификацией

**Дата:** 9 января 2025  
**Статус:** Финальное решение  
**Версия:** 1.0

## 📋 Обзор решения

Система промокодов с аутентификацией через Telegram-бота, весовым распределением и серверным контролем попыток.

## 🏗️ Архитектура

### 1. **Коллекция "users" (пользователи)**
```
Поля:
- telegram_id (Text) - ID пользователя в Telegram
- phone (Text) - Номер телефона
- first_name (Text) - Имя
- last_name (Text) - Фамилия
- username (Text) - Username в Telegram
- is_verified (Bool) - Подтвержден ли номер
- created (Date) - Дата регистрации
- last_activity (Date) - Последняя активность
- is_vip (Bool) - VIP статус (опционально)
```

### 2. **Коллекция "promo_attempts" (попытки промокодов)**
```
Поля:
- user_id (Relation) - Ссылка на пользователя
- attempt_date (Date) - Дата попытки
- promo_result (Text) - Результат промокода (success/failure)
- promo_code (Text) - Полученный промокод
- discount_value (Number) - Размер скидки
- discount_type (Text) - Тип скидки (percent/amount/free_personal/free_group/free_month)
- is_used (Bool) - Использован ли промокод
- used_date (Date) - Дата использования
```

### 3. **Коллекция "promo_settings" (настройки промо)**
```
Поля:
- daily_attempts_limit (Number) - Лимит попыток в день
- weekly_attempts_limit (Number) - Лимит попыток в неделю
- cooldown_minutes (Number) - Кулдаун между попытками
- failure_message (Editor) - Сообщение о неудаче
- success_message_template (Editor) - Шаблон успешного сообщения
```

### 4. **Коллекция "promocodes" (промокоды)**
```
Поля:
- promo_light_5perc (Text) - Промокод 5% скидки (вес 10)
- promo_light_10perc (Text) - Промокод 10% скидки (вес 5)
- promo_medium_20perc (Text) - Промокод 20% скидки (вес 5)
- promo_heavy_50perc (Text) - Промокод 50% скидки (вес 1)
- promo_epic_70perc (Text) - Промокод 70% скидки (вес 1)
- promo_legendary_90perc (Text) - Промокод 90% скидки (вес 1)
- promo_light_500rub (Text) - Промокод 500 руб скидки (вес 5)
- promo_medium_1000rub (Text) - Промокод 1000 руб скидки (вес 3)
- promo_heavy_2000rub (Text) - Промокод 2000 руб скидки (вес 2)
- promo_epic_5000rub (Text) - Промокод 5000 руб скидки (вес 1)
- promo_free_personal (Text) - Бесплатная индивидуальная тренировка (вес 5)
- promo_free_group (Text) - Бесплатная групповая тренировка (вес 3)
- promo_free_month (Text) - Бесплатный месяц тренировок (вес 2)
- failure_message (Editor) - Сообщение о неудаче
```

## ⚙️ Весовая система

### **Консервативный сценарий (рекомендуемый):**
```
promo_light_5perc (вес 10) - 10%
promo_light_10perc (вес 5) - 5%
promo_medium_20perc (вес 5) - 5%
promo_heavy_50perc (вес 1) - 1%
promo_epic_70perc (вес 1) - 1%
promo_legendary_90perc (вес 1) - 1%
promo_light_500rub (вес 5) - 5%
promo_medium_1000rub (вес 3) - 3%
promo_heavy_2000rub (вес 2) - 2%
promo_epic_5000rub (вес 1) - 1%
promo_free_personal (вес 5) - 5%
promo_free_group (вес 3) - 3%
promo_free_month (вес 2) - 2%
Неудача (вес 62) - 62%

Общий вес: 100
```

## 🔧 Техническая реализация

### **1. Парсинг полей промокодов:**
```javascript
const parsePromoField = (fieldName, value) => {
  if (!value || value.trim() === '') return null;
  
  const parts = fieldName.split('_');
  const type = parts[1]; // light, medium, heavy, epic, legendary, free
  const amount = parts[2]; // 5perc, 10perc, 500rub, personal, etc.
  
  let discountType, discountValue, weight, rarity;
  
  if (amount.includes('perc')) {
    discountType = 'percent';
    discountValue = parseInt(amount.replace('perc', ''));
    rarity = type;
  } else if (amount.includes('rub')) {
    discountType = 'amount';
    discountValue = parseInt(amount.replace('rub', ''));
    rarity = type;
  } else if (amount === 'personal') {
    discountType = 'free_personal';
    discountValue = 1;
    rarity = 'free';
  } else if (amount === 'group') {
    discountType = 'free_group';
    discountValue = 1;
    rarity = 'free';
  } else if (amount === 'month') {
    discountType = 'free_month';
    discountValue = 1;
    rarity = 'free';
  }
  
  // Веса по редкости
  const weightMap = {
    'light': 10,
    'medium': 5,
    'heavy': 1,
    'epic': 1,
    'legendary': 1,
    'free': 5
  };
  
  return {
    code: value,
    discountType,
    discountValue,
    weight: weightMap[rarity] || 1,
    rarity
  };
};
```

### **2. Функция выбора промокода:**
```javascript
const selectRandomPromoCode = (promoData) => {
  const activePromos = [];
  
  // Собираем все промокоды
  Object.keys(promoData).forEach(fieldName => {
    if (fieldName.startsWith('promo_') && fieldName !== 'failure_message') {
      const promo = parsePromoField(fieldName, promoData[fieldName]);
      if (promo) {
        activePromos.push(promo);
      }
    }
  });
  
  if (activePromos.length === 0) {
    return { success: false, message: promoData.failure_message };
  }
  
  // Вычисляем общий вес
  const totalWeight = activePromos.reduce((sum, promo) => sum + promo.weight, 0);
  const failureWeight = 62; // Консервативный сценарий
  const totalWithFailure = totalWeight + failureWeight;
  
  // Генерируем случайное число
  const random = Math.random() * totalWithFailure;
  
  // Проверяем неудачу
  if (random <= failureWeight) {
    return { success: false, message: promoData.failure_message };
  }
  
  // Выбираем промокод
  let currentWeight = failureWeight;
  for (const promo of activePromos) {
    currentWeight += promo.weight;
    if (random <= currentWeight) {
      return { 
        success: true, 
        code: promo.code, 
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        rarity: promo.rarity
      };
    }
  }
  
  return { success: false, message: promoData.failure_message };
};
```

### **3. Контроль попыток:**
```javascript
const checkAttemptsLimit = async () => {
  const user = await getCurrentUser();
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  // Проверяем дневной лимит
  const dailyAttempts = await pb.collection('promo_attempts')
    .getList(1, 50, {
      filter: `user_id = "${user.id}" && attempt_date >= "${today}"`
    });
  
  // Проверяем недельный лимит
  const weeklyAttempts = await pb.collection('promo_attempts')
    .getList(1, 50, {
      filter: `user_id = "${user.id}" && attempt_date >= "${weekAgo}"`
    });
  
  const settings = await getPromoSettings();
  
  if (dailyAttempts.totalItems >= settings.daily_attempts_limit) {
    return { 
      allowed: false, 
      type: 'daily',
      remaining: 0,
      resetTime: 'завтра'
    };
  }
  
  if (weeklyAttempts.totalItems >= settings.weekly_attempts_limit) {
    return { 
      allowed: false, 
      type: 'weekly',
      remaining: 0,
      resetTime: 'через неделю'
    };
  }
  
  return { 
    allowed: true, 
    dailyRemaining: settings.daily_attempts_limit - dailyAttempts.totalItems,
    weeklyRemaining: settings.weekly_attempts_limit - weeklyAttempts.totalItems
  };
};
```

### **4. Telegram-авторизация:**
```javascript
const showTelegramAuth = () => {
  const telegramBot = '@YourBotName';
  const authUrl = `https://t.me/${telegramBot}?start=auth_${generateAuthToken()}`;
  
  showModal({
    title: 'Авторизация через Telegram',
    content: `
      <p>Для участия в розыгрыше промокодов необходимо авторизоваться через Telegram</p>
      <a href="${authUrl}" target="_blank" class="btn btn-primary">
        Открыть Telegram
      </a>
    `
  });
};
```

## 🎮 Пользовательский опыт

### **Процесс:**
1. Пользователь нажимает на грушу
2. Проверка авторизации через Telegram
3. Проверка лимитов попыток
4. Генерация промокода по весовой системе
5. Сохранение попытки в базу данных
6. Отображение результата

### **Сообщения:**
- **Успех:** "🎉 Поздравляем! Ваш промокод: PUNCH5. Скидка: 5%"
- **Неудача:** "😔 Не повезло в этот раз! Попробуйте завтра"
- **Лимит:** "Превышен лимит попыток на сегодня. Осталось: 0"

## 📊 Аналитика

### **Метрики:**
- Количество попыток по пользователям
- Процент успешных промокодов
- Популярные промокоды
- Время между попытками
- Конверсия промокодов в продажи

### **Отчеты:**
- Ежедневная статистика
- Топ пользователей по активности
- Анализ эффективности весов
- Рекомендации по настройке

## 🛡️ Безопасность

### **Защита от злоупотреблений:**
- Аутентификация через Telegram
- Серверный контроль попыток
- Лимиты по времени
- Анализ поведения пользователей

### **Мониторинг:**
- Подозрительная активность
- Множественные попытки
- Аномальные паттерны
- Автоматические блокировки

## 🚀 Развертывание

### **Этапы:**
1. Создание коллекций в PocketBase
2. Настройка Telegram-бота
3. Реализация клиентской логики
4. Тестирование системы
5. Мониторинг и оптимизация

### **Настройки по умолчанию:**
- Дневной лимит: 3 попытки
- Недельный лимит: 15 попыток
- Кулдаун: 30 минут
- Консервативный сценарий весов

---

**Примечание:** Это финальная версия решения системы промокодов с полной технической спецификацией для реализации.
