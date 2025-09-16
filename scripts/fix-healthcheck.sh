#!/bin/bash

# Скрипт для исправления проблем с Healthcheck

echo "🔧 Исправление проблем с Healthcheck..."

# Создаем коммит с исправлениями
git add .
git commit -m "fix: resolve Railway healthcheck issues

- Add /api/health endpoint for health checks
- Update railway.json with proper healthcheck path
- Add healthcheck to Dockerfile.railway
- Create alternative config without healthcheck
- Increase healthcheck timeout to 300s"

echo "✅ Исправления готовы!"
echo ""
echo "🚀 Следующие шаги:"
echo "1. git push origin main"
echo "2. В Railway Dashboard нажмите 'Redeploy'"
echo "3. Если проблема остается, используйте railway-no-healthcheck.json"
echo ""
echo "📋 Альтернативные решения:"
echo "- Отключите healthcheck в Railway Dashboard"
echo "- Используйте railway-no-healthcheck.json"
echo "- Проверьте логи в Railway Dashboard"
