# 🚂 Railway Deployment Guide для JAB Martial Arts

Пошаговая инструкция по деплою проекта на Railway.

## 📋 Подготовка

### 1. Создайте аккаунт на Railway
- Перейдите на [railway.app](https://railway.app)
- Войдите через GitHub аккаунт
- Подтвердите email

### 2. Подготовьте репозиторий
```bash
# Добавьте все файлы в git
git add .
git commit -m "feat: add Railway deployment configuration"
git push origin main
```

## 🚀 Деплой Frontend (Next.js)

### Шаг 1: Создание проекта
1. В Railway Dashboard нажмите **"New Project"**
2. Выберите **"Deploy from GitHub repo"**
3. Найдите ваш репозиторий `jab-martial-arts`
4. Нажмите **"Deploy Now"**

### Шаг 2: Настройка переменных окружения
В настройках проекта добавьте переменные:

```env
NODE_ENV=production
NEXT_PUBLIC_POCKETBASE_URL=https://your-pocketbase-app.railway.app
NEXT_TELEMETRY_DISABLED=1
```

### Шаг 3: Настройка сборки
Railway автоматически найдет `railway.json` и `Dockerfile`.

## 🗄️ Деплой PocketBase

### Шаг 1: Создание отдельного проекта
1. Создайте **новый проект** в Railway
2. Выберите **"Deploy from GitHub repo"**
3. Выберите тот же репозиторий
4. Railway автоматически определит, что это PocketBase

### Шаг 2: Настройка PocketBase
1. В настройках проекта добавьте переменные:
```env
PB_DATA_DIR=/pocketbase/pb_data
```

### Шаг 3: Получение URL
После деплоя скопируйте URL PocketBase сервиса и обновите переменную в Frontend проекте:
```
NEXT_PUBLIC_POCKETBASE_URL=https://your-pocketbase-app.railway.app
```

## 🔧 Альтернативный способ (один проект)

Если хотите деплоить всё в одном проекте:

### 1. Создайте docker-compose.yml для Railway
```yaml
version: '3.8'
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.railway
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_POCKETBASE_URL=http://pocketbase:8090
    depends_on:
      - pocketbase

  pocketbase:
    build:
      context: .
      dockerfile: Dockerfile.pocketbase
    ports:
      - "8090:8090"
    environment:
      - PB_DATA_DIR=/pocketbase/pb_data
```

### 2. Используйте Railway CLI
```bash
# Установите Railway CLI
npm install -g @railway/cli

# Войдите в аккаунт
railway login

# Деплой
railway up
```

## 🌐 Настройка домена

### 1. Добавление кастомного домена
1. В настройках проекта найдите **"Domains"**
2. Нажмите **"Custom Domain"**
3. Добавьте ваш домен (например, `jab-martial-arts.com`)
4. Railway автоматически выдаст SSL сертификат

### 2. Обновление переменных
После добавления домена обновите переменные:
```env
NEXT_PUBLIC_POCKETBASE_URL=https://api.jab-martial-arts.com
```

## 📊 Мониторинг

### 1. Логи
- В Railway Dashboard перейдите в **"Deployments"**
- Выберите последний деплой
- Просматривайте логи в реальном времени

### 2. Метрики
- **"Metrics"** - использование CPU, памяти, сети
- **"Health"** - статус health checks

## 🔄 Обновления

### Автоматические обновления
Railway автоматически пересобирает проект при push в main ветку.

### Ручные обновления
```bash
# В Railway Dashboard нажмите "Redeploy"
# Или через CLI:
railway redeploy
```

## 🚨 Troubleshooting

### Проблема: Сборка не проходит
**Решение:**
1. Проверьте логи сборки в Railway Dashboard
2. Убедитесь, что все зависимости указаны в `package.json`
3. Проверьте, что `Dockerfile` корректный

### Проблема: Frontend не подключается к PocketBase
**Решение:**
1. Убедитесь, что PocketBase сервис запущен
2. Проверьте URL в переменных окружения
3. Убедитесь, что оба сервиса в одной сети Railway

### Проблема: Медленная загрузка
**Решение:**
1. Проверьте размер Docker образа
2. Оптимизируйте `.dockerignore`
3. Используйте multi-stage build

## 💰 Стоимость

### Бесплатный тариф:
- 500 часов выполнения в месяц
- 1GB RAM
- 1GB диск
- Подходит для тестирования

### Платный тариф:
- $5/месяц за сервис
- Неограниченное время выполнения
- Больше ресурсов

## 🎯 Следующие шаги

1. **Настройте мониторинг** - добавьте алерты
2. **Настройте бэкапы** - для данных PocketBase
3. **Оптимизируйте производительность** - добавьте CDN
4. **Настройте CI/CD** - автоматические тесты

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи в Railway Dashboard
2. Обратитесь в [Railway Discord](https://discord.gg/railway)
3. Проверьте [документацию Railway](https://docs.railway.app)

---

**🚂 Готово! Ваш проект деплоится на Railway!**
