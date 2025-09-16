#!/bin/bash

# Скрипт для сборки Docker образов

set -e

echo "🚀 Начинаем сборку Docker образов для JAB Martial Arts..."

# Проверяем наличие PocketBase бинарника
if [ ! -f "./pocketbase" ]; then
    echo "❌ Ошибка: PocketBase бинарник не найден!"
    echo "Скачайте PocketBase с https://pocketbase.io/docs/"
    exit 1
fi

# Сборка образов
echo "📦 Собираем образы..."

# Собираем PocketBase образ
echo "🔧 Собираем PocketBase образ..."
docker build -f Dockerfile.pocketbase -t jab-pocketbase:latest .

# Собираем Next.js образ
echo "⚛️ Собираем Next.js образ..."
docker build -f Dockerfile -t jab-frontend:latest .

echo "✅ Сборка завершена успешно!"
echo ""
echo "📋 Доступные команды:"
echo "  docker-compose -f docker-compose.prod.yml up -d    # Запуск production"
echo "  docker-compose -f docker-compose.dev.yml up -d    # Запуск development"
echo "  docker-compose down                                # Остановка всех контейнеров"
echo ""
echo "🌐 После запуска приложение будет доступно:"
echo "  Frontend: http://localhost:3000"
echo "  PocketBase: http://localhost:8090"
