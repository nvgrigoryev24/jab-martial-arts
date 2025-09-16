#!/bin/bash

# Скрипт для проверки статуса Docker контейнеров

echo "🐳 Статус Docker контейнеров JAB Martial Arts"
echo "=============================================="

# Проверяем статус контейнеров
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "📊 Использование ресурсов:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"

echo ""
echo "🌐 Доступность сервисов:"
echo -n "Frontend (http://localhost:3000): "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    echo "✅ OK"
else
    echo "❌ Ошибка"
fi

echo -n "PocketBase API (http://localhost:8090/api/health): "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8090/api/health | grep -q "200"; then
    echo "✅ OK"
else
    echo "❌ Ошибка"
fi

echo ""
echo "📋 Полезные команды:"
echo "  docker-compose -f docker-compose.prod.yml logs -f    # Просмотр логов"
echo "  docker-compose -f docker-compose.prod.yml restart     # Перезапуск"
echo "  docker-compose -f docker-compose.prod.yml down        # Остановка"
