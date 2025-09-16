#!/bin/bash

# Скрипт для деплоя в production

set -e

echo "🚀 Деплой JAB Martial Arts в production..."

# Проверяем переменные окружения
if [ -z "$DOMAIN" ]; then
    echo "⚠️  Предупреждение: DOMAIN не установлен"
    echo "   Установите DOMAIN=yourdomain.com для SSL сертификатов"
fi

# Останавливаем старые контейнеры
echo "🛑 Останавливаем старые контейнеры..."
docker-compose -f docker-compose.prod.yml down

# Собираем новые образы
echo "📦 Собираем образы..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Запускаем production
echo "🚀 Запускаем production..."
docker-compose -f docker-compose.prod.yml up -d

# Ждем запуска сервисов
echo "⏳ Ждем запуска сервисов..."
sleep 30

# Проверяем статус
echo "📊 Проверяем статус контейнеров..."
docker-compose -f docker-compose.prod.yml ps

# Проверяем логи
echo "📋 Последние логи:"
docker-compose -f docker-compose.prod.yml logs --tail=20

echo ""
echo "✅ Деплой завершен!"
echo ""
echo "🌐 Приложение доступно:"
echo "  Frontend: http://localhost:3000"
echo "  PocketBase Admin: http://localhost:8090/_/"
echo ""
echo "📋 Полезные команды:"
echo "  docker-compose -f docker-compose.prod.yml logs -f    # Просмотр логов"
echo "  docker-compose -f docker-compose.prod.yml restart   # Перезапуск"
echo "  docker-compose -f docker-compose.prod.yml down       # Остановка"
