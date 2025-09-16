# 🐳 Docker Deployment Guide для JAB Martial Arts

Этот проект настроен для деплоя через Docker с Next.js фронтендом и PocketBase как Backend-as-a-Service.

## 📋 Структура

- **Frontend**: Next.js 15.5.2 (порт 3000)
- **Backend**: PocketBase (порт 8090)
- **Reverse Proxy**: Nginx (опционально, порты 80/443)

## 🚀 Быстрый старт

### 1. Подготовка

```bash
# Убедитесь, что у вас есть PocketBase бинарник
ls -la pocketbase

# Если нет - скачайте с https://pocketbase.io/docs/
```

### 2. Сборка образов

```bash
# Автоматическая сборка
./scripts/docker-build.sh

# Или вручную
docker-compose -f docker-compose.prod.yml build
```

### 3. Запуск

```bash
# Production
docker-compose -f docker-compose.prod.yml up -d

# Development (с hot reload)
docker-compose -f docker-compose.dev.yml up -d
```

### 4. Проверка

```bash
# Статус контейнеров
docker-compose -f docker-compose.prod.yml ps

# Логи
docker-compose -f docker-compose.prod.yml logs -f
```

## 🌐 Доступ к приложению

После запуска:
- **Frontend**: http://localhost:3000
- **PocketBase Admin**: http://localhost:8090/_/
- **PocketBase API**: http://localhost:8090/api/

## 🔧 Конфигурация

### Environment Variables

Создайте `.env.production`:
```env
NODE_ENV=production
NEXT_PUBLIC_POCKETBASE_URL=http://pocketbase:8090
NEXT_TELEMETRY_DISABLED=1
```

### SSL сертификаты (для production)

Для HTTPS создайте папку `ssl/` и поместите:
- `cert.pem` - SSL сертификат
- `key.pem` - приватный ключ

## 📁 Volumes

- `pocketbase_data` - данные PocketBase
- `pocketbase_migrations` - миграции PocketBase

## 🛠 Полезные команды

```bash
# Перезапуск сервисов
docker-compose -f docker-compose.prod.yml restart

# Остановка
docker-compose -f docker-compose.prod.yml down

# Просмотр логов конкретного сервиса
docker-compose -f docker-compose.prod.yml logs pocketbase
docker-compose -f docker-compose.prod.yml logs frontend

# Вход в контейнер
docker exec -it jab-pocketbase-prod sh
docker exec -it jab-frontend-prod sh

# Очистка (удаление образов и volumes)
docker-compose -f docker-compose.prod.yml down -v
docker system prune -a
```

## 🔍 Troubleshooting

### PocketBase не запускается
```bash
# Проверьте права на бинарник
chmod +x pocketbase

# Проверьте логи
docker-compose logs pocketbase
```

### Frontend не подключается к PocketBase
```bash
# Проверьте переменные окружения
docker exec jab-frontend-prod env | grep POCKETBASE

# Проверьте сеть
docker network ls
docker network inspect jab-martial-arts_jab-network
```

### Проблемы с SSL
```bash
# Отключите SSL в nginx.conf временно
# Закомментируйте секцию HTTPS сервера
```

## 📊 Мониторинг

### Health Checks
Все сервисы имеют health checks:
- PocketBase: `http://localhost:8090/api/health`
- Frontend: `http://localhost:3000`

### Логи
```bash
# Все логи
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f frontend
docker-compose logs -f pocketbase
```

## 🚀 Production Deployment

### На VPS сервере

1. **Клонируйте репозиторий**
```bash
git clone <your-repo>
cd jab-martial-arts
```

2. **Настройте домен**
```bash
export DOMAIN=yourdomain.com
```

3. **Запустите деплой**
```bash
./scripts/docker-deploy.sh
```

4. **Настройте SSL** (Let's Encrypt)
```bash
# Установите certbot
sudo apt install certbot

# Получите сертификат
sudo certbot certonly --standalone -d yourdomain.com

# Скопируйте сертификаты
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./ssl/key.pem
sudo chown $USER:$USER ./ssl/*
```

### Автоматическое обновление SSL

Создайте cron задачу:
```bash
# Добавьте в crontab
0 2 * * * cd /path/to/jab-martial-arts && sudo certbot renew --quiet && sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./ssl/cert.pem && sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./ssl/key.pem && docker-compose -f docker-compose.prod.yml restart nginx
```

## 🔒 Безопасность

- Все контейнеры запускаются от непривилегированных пользователей
- SSL/TLS шифрование для production
- Health checks для мониторинга
- Изолированная Docker сеть

## 📈 Масштабирование

Для высоких нагрузок:
- Используйте внешнюю базу данных PostgreSQL
- Настройте Redis для кеширования
- Добавьте load balancer
- Используйте Docker Swarm или Kubernetes
