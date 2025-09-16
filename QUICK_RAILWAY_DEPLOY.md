# ⚡ Быстрый деплой на Railway (5 минут)

## 🚀 Пошаговая инструкция

### 1. Подготовка (1 минута)
```bash
# Убедитесь, что все изменения сохранены
git add .
git commit -m "feat: add Railway deployment configuration"
git push origin main
```

### 2. Создание проекта в Railway (2 минуты)
1. Перейдите на [railway.app](https://railway.app)
2. Нажмите **"New Project"**
3. Выберите **"Deploy from GitHub repo"**
4. Найдите `jab-martial-arts` и нажмите **"Deploy Now"**

### 3. Настройка переменных (1 минута)
В настройках проекта добавьте:
```
NODE_ENV=production
NEXT_PUBLIC_POCKETBASE_URL=https://your-pocketbase-url.railway.app
NEXT_TELEMETRY_DISABLED=1
```

### 4. Деплой PocketBase (1 минута)
1. Создайте **новый проект** для PocketBase
2. Выберите тот же репозиторий
3. Railway автоматически определит PocketBase
4. Скопируйте URL и обновите переменную в Frontend

## 🎯 Готово!

Ваше приложение будет доступно по адресу:
- **Frontend**: `https://your-app.railway.app`
- **PocketBase**: `https://your-pocketbase.railway.app`

## 🔧 Альтернатива через CLI

```bash
# Установите Railway CLI
npm install -g @railway/cli

# Войдите в аккаунт
railway login

# Деплой
railway up
```

## 📊 Мониторинг

- **Логи**: Railway Dashboard → Deployments → Logs
- **Метрики**: Railway Dashboard → Metrics
- **Домен**: Railway Dashboard → Domains

---

**🚂 Деплой займет ~5 минут!**
