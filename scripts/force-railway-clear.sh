#!/bin/bash

# Скрипт для принудительной очистки кеша Railway

echo "🧹 Принудительная очистка кеша Railway..."

# Удаляем все кеши и временные файлы
rm -rf .next/
rm -rf node_modules/.cache/
rm -rf .eslintcache
rm -rf tsconfig.tsbuildinfo

# Создаем пустой файл для принудительного обновления
echo "Railway cache clear $(date)" > .railway-cache-clear

# Создаем новый коммит с принудительным обновлением
git add .
git commit -m "force: clear Railway cache $(date +%Y%m%d_%H%M%S)

- Remove all cache files
- Force Railway to rebuild from scratch
- Clear Docker build cache
- Update all configuration files"

echo "✅ Кеш очищен!"
echo ""
echo "🚀 Следующие шаги:"
echo "1. git push origin main"
echo "2. В Railway Dashboard нажмите 'Redeploy'"
echo "3. Выберите 'Clear cache and redeploy'"
echo "4. Дождитесь завершения сборки"
