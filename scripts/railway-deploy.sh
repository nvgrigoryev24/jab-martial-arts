#!/bin/bash

# Скрипт для деплоя на Railway

set -e

echo "🚂 Railway Deployment для JAB Martial Arts"
echo "=========================================="

# Проверяем наличие Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI не установлен!"
    echo "Установите его командой: npm install -g @railway/cli"
    exit 1
fi

# Проверяем авторизацию
if ! railway whoami &> /dev/null; then
    echo "🔐 Войдите в Railway аккаунт:"
    railway login
fi

echo "📦 Подготовка к деплою..."

# Проверяем статус git
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Есть несохраненные изменения!"
    echo "Сохраните изменения перед деплоем:"
    echo "  git add ."
    echo "  git commit -m 'feat: prepare for Railway deployment'"
    echo "  git push origin main"
    exit 1
fi

echo "✅ Git репозиторий чистый"

# Выбираем тип деплоя
echo ""
echo "Выберите тип деплоя:"
echo "1) Frontend только (Next.js)"
echo "2) PocketBase только"
echo "3) Оба сервиса (docker-compose)"
echo "4) Отмена"

read -p "Введите номер (1-4): " choice

case $choice in
    1)
        echo "🚀 Деплой Frontend..."
        railway up --service frontend
        ;;
    2)
        echo "🗄️ Деплой PocketBase..."
        railway up --service pocketbase
        ;;
    3)
        echo "🚀 Деплой всех сервисов..."
        railway up
        ;;
    4)
        echo "❌ Деплой отменен"
        exit 0
        ;;
    *)
        echo "❌ Неверный выбор"
        exit 1
        ;;
esac

echo ""
echo "✅ Деплой завершен!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Проверьте статус в Railway Dashboard"
echo "2. Настройте переменные окружения"
echo "3. Добавьте кастомный домен (опционально)"
echo "4. Проверьте работу приложения"
echo ""
echo "🌐 Railway Dashboard: https://railway.app/dashboard"
