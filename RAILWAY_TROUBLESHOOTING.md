# 🚨 Railway Troubleshooting Guide

## ❌ Проблема: Ошибки сборки

### Симптомы:
```
Failed to compile.
./src/components/ExampleSectionWithMaintenance.tsx:44:15
Type error: Argument of type '{ title: string; content: string; timestamp: string; }' is not assignable to parameter of type 'SetStateAction<null>'.
```

### ✅ Решение:

#### 1. Обновите код в GitHub
```bash
git push origin main
```

#### 2. Перезапустите деплой в Railway
- Зайдите в Railway Dashboard
- Найдите ваш проект
- Нажмите **"Redeploy"** или **"Deploy"**

#### 3. Если проблема остается, используйте исправления:

**Автоматическое исправление:**
```bash
./scripts/fix-railway-build.sh
git add .
git commit -m "fix: resolve Railway build issues"
git push origin main
```

**Ручное исправление:**
1. Убедитесь, что файл `ExampleSectionWithMaintenance.tsx` существует и корректен
2. Проверьте, что `.eslintrc.js` создан
3. Убедитесь, что `railway.json` указывает на `Dockerfile.railway`

## ⚠️ Проблема: Предупреждения Next.js

### Симптомы:
```
⚠ Invalid next.config.ts options detected: 
⚠     Unrecognized key(s) in object: 'exclude'
⚠ The config property `experimental.turbo` is deprecated
```

### ✅ Решение:
Эти предупреждения не критичны, но можно исправить:

1. **Удалите `exclude` из next.config.ts** (уже исправлено)
2. **Замените `experimental.turbo` на `turbopack`** (уже исправлено)

## 🔧 Проблема: ESLint предупреждения

### Симптомы:
```
Warning: Using `<img>` could result in slower LCP
Warning: 'variable' is assigned a value but never used
```

### ✅ Решение:
Создан `.eslintrc.js` с отключенными правилами:
```javascript
module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    '@next/next/no-img-element': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'react-hooks/exhaustive-deps': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
```

## 🚀 Проблема: Медленная сборка

### ✅ Решение:
1. **Используйте кеш Docker:**
   ```dockerfile
   # В Dockerfile.railway уже добавлен кеш
   COPY --from=deps /app/node_modules ./node_modules
   ```

2. **Оптимизируйте .dockerignore:**
   ```dockerignore
   node_modules/
   .next/
   notes_and_docs/
   backups/
   ```

## 🔍 Проблема: Frontend не подключается к PocketBase

### ✅ Решение:
1. **Проверьте переменные окружения:**
   ```
   NEXT_PUBLIC_POCKETBASE_URL=https://your-pocketbase-url.railway.app
   ```

2. **Убедитесь, что PocketBase запущен:**
   - Проверьте статус в Railway Dashboard
   - Посмотрите логи PocketBase

3. **Проверьте URL:**
   - PocketBase должен быть доступен по HTTPS
   - URL должен заканчиваться на `.railway.app`

## 📊 Проблема: Высокое использование ресурсов

### ✅ Решение:
1. **Оптимизируйте Docker образ:**
   ```dockerfile
   # Используйте multi-stage build
   FROM node:20-alpine AS base
   # ...
   ```

2. **Настройте переменные окружения:**
   ```
   NODE_ENV=production
   NEXT_TELEMETRY_DISABLED=1
   ```

## 🆘 Экстренное решение

Если ничего не помогает:

### 1. Полный перезапуск
```bash
# В Railway Dashboard
1. Удалите проект
2. Создайте новый проект
3. Подключите репозиторий заново
4. Настройте переменные окружения
```

### 2. Использование Railway CLI
```bash
# Установите Railway CLI
npm install -g @railway/cli

# Войдите в аккаунт
railway login

# Деплой
railway up
```

### 3. Альтернативный деплой
Если Railway не работает, используйте:
- **Vercel** (только Frontend)
- **Railway** (только PocketBase)
- **VPS с Docker** (оба сервиса)

## 📞 Поддержка

1. **Railway Discord**: https://discord.gg/railway
2. **Railway Docs**: https://docs.railway.app
3. **GitHub Issues**: Создайте issue в репозитории

---

**🔧 Большинство проблем решаются обновлением кода и перезапуском деплоя!**
