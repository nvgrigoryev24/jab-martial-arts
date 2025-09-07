# 📋 Инструкция по миграции из монолита в микросервисы

**Дата создания:** 9 января 2025  
**Статус:** Планирование  
**Приоритет:** Средний (после реализации критических функций)  
**Версия:** 1.0

## 🎯 Цель

Подготовить детальный план миграции проекта JAB Martial Arts из монолитной архитектуры в микросервисную для поддержки масштабирования и потенциального выделения check-in системы в отдельный SaaS продукт.

## 📝 Контекст проекта

### **Текущее состояние:**
- **Архитектура:** Монолит на Next.js 15.5.2
- **Backend:** PocketBase как BaaS
- **Frontend:** React 19 + TypeScript + Tailwind CSS
- **База данных:** PocketBase (SQLite)
- **Деплой:** Планируется Vercel/Netlify

### **Планируемые функции:**
1. **Telegram бот для аутентификации** (критический приоритет)
2. **Система check-in тренировок** с QR-кодами
3. **Дашборд тренера** с аналитикой
4. **Валидация форм** с умной логикой

### **Целевая архитектура:**
- **Check-in Service** - отдельный SaaS продукт
- **Auth Service** - централизованная аутентификация
- **Analytics Service** - аналитика и отчеты
- **Website Service** - специфичный для JAB контент

## 🏗️ Целевая микросервисная архитектура

### **Схема сервисов:**
```
┌─────────────────────────────────────────────────────────────┐
│                    JAB Martial Arts                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Website   │  │ Telegram    │  │   Branding & UI     │ │
│  │  (Next.js)  │  │    Bot      │  │                     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│              Check-in Service (SaaS)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   QR Code   │  │   Mobile    │  │    Dashboard        │ │
│  │ Generation  │  │  Scanner    │  │   (Trainer)         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    Shared Services                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Auth      │  │   Users     │  │    Analytics        │ │
│  │  Service    │  │  Service    │  │    Service          │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    Infrastructure                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  PostgreSQL │  │   Redis     │  │    File Storage     │ │
│  │  (Main DB)  │  │  (Cache)    │  │    (QR Images)      │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 📋 План миграции по этапам

### **Этап 1: Подготовка к миграции (Текущий)**

#### **1.1 Модульная структура монолита**
```
src/
├── modules/
│   ├── checkin/              # Будущий Check-in Service
│   │   ├── api/             # API endpoints
│   │   ├── services/        # Бизнес-логика
│   │   ├── types/           # TypeScript типы
│   │   ├── utils/           # Утилиты
│   │   └── components/      # UI компоненты
│   ├── dashboard/           # Будущий Dashboard Service
│   │   ├── api/
│   │   ├── services/
│   │   ├── types/
│   │   └── components/
│   ├── auth/                # Будущий Auth Service
│   │   ├── api/
│   │   ├── services/
│   │   ├── types/
│   │   └── components/
│   └── website/             # Специфичный для JAB
│       ├── components/
│       └── pages/
├── shared/                  # Общие утилиты
│   ├── types/
│   ├── utils/
│   └── constants/
└── lib/                     # Конфигурация
    ├── pocketbase.ts
    ├── auth.ts
    └── api.ts
```

#### **1.2 API-First подход**
```typescript
// Все функции через API endpoints
// /api/checkin/qr/generate
// /api/checkin/qr/scan
// /api/checkin/sessions
// /api/checkin/analytics
// /api/auth/telegram/validate
// /api/dashboard/stats
```

#### **1.3 Подготовка к мультитенантности**
```typescript
interface BaseEntity {
  id: string;
  gym_id: string;        // Для мультитенантности
  created_at: string;
  updated_at: string;
}

interface CheckinSession extends BaseEntity {
  qr_code: string;
  generated_by: string;
  expires_at: string;
  is_active: boolean;
}
```

### **Этап 2: Выделение Auth Service**

#### **2.1 Создание Auth Service**
```typescript
// auth-service/
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── telegramController.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── telegramService.ts
│   │   └── userService.ts
│   ├── middleware/
│   │   ├── authMiddleware.ts
│   │   └── validationMiddleware.ts
│   ├── types/
│   │   └── auth.ts
│   └── app.ts
├── package.json
└── Dockerfile
```

#### **2.2 API Endpoints**
```typescript
// Auth Service API
POST /auth/login
POST /auth/telegram/validate
POST /auth/refresh
POST /auth/logout
GET  /auth/me
PUT  /auth/profile
```

#### **2.3 База данных**
```sql
-- Таблица пользователей
CREATE TABLE users (
  id UUID PRIMARY KEY,
  gym_id UUID NOT NULL,
  phone VARCHAR(20) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  telegram_user_id BIGINT,
  telegram_username VARCHAR(255),
  auth_method VARCHAR(20) DEFAULT 'phone',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Таблица сессий
CREATE TABLE auth_sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  session_token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Этап 3: Выделение Check-in Service**

#### **3.1 Создание Check-in Service**
```typescript
// checkin-service/
├── src/
│   ├── controllers/
│   │   ├── qrController.ts
│   │   ├── scanController.ts
│   │   └── sessionController.ts
│   ├── services/
│   │   ├── qrService.ts
│   │   ├── scanService.ts
│   │   └── analyticsService.ts
│   ├── middleware/
│   │   ├── authMiddleware.ts
│   │   └── gymMiddleware.ts
│   ├── types/
│   │   └── checkin.ts
│   └── app.ts
├── package.json
└── Dockerfile
```

#### **3.2 API Endpoints**
```typescript
// Check-in Service API
POST /checkin/qr/generate
POST /checkin/qr/scan
GET  /checkin/sessions
GET  /checkin/analytics
GET  /checkin/stats
```

#### **3.3 База данных**
```sql
-- Таблица QR сессий
CREATE TABLE qr_sessions (
  id UUID PRIMARY KEY,
  gym_id UUID NOT NULL,
  qr_code VARCHAR(255) UNIQUE NOT NULL,
  generated_by UUID NOT NULL,
  generated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица check-in записей
CREATE TABLE checkin_records (
  id UUID PRIMARY KEY,
  gym_id UUID NOT NULL,
  session_id UUID NOT NULL,
  user_id UUID NOT NULL,
  checked_in_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Этап 4: Выделение Analytics Service**

#### **4.1 Создание Analytics Service**
```typescript
// analytics-service/
├── src/
│   ├── controllers/
│   │   ├── statsController.ts
│   │   └── reportsController.ts
│   ├── services/
│   │   ├── statsService.ts
│   │   ├── reportsService.ts
│   │   └── exportService.ts
│   ├── types/
│   │   └── analytics.ts
│   └── app.ts
├── package.json
└── Dockerfile
```

#### **4.2 API Endpoints**
```typescript
// Analytics Service API
GET  /analytics/stats
GET  /analytics/reports
GET  /analytics/export
POST /analytics/events
```

### **Этап 5: Обновление Frontend**

#### **5.1 API Client**
```typescript
// src/lib/api/
├── authClient.ts
├── checkinClient.ts
├── analyticsClient.ts
└── baseClient.ts
```

#### **5.2 Обновление компонентов**
```typescript
// Использование API клиентов вместо прямых вызовов PocketBase
import { checkinClient } from '@/lib/api/checkinClient';
import { authClient } from '@/lib/api/authClient';
```

## 🔧 Технические детали миграции

### **Инфраструктура**

#### **Контейнеризация**
```dockerfile
# Dockerfile для каждого сервиса
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

#### **Docker Compose**
```yaml
version: '3.8'
services:
  auth-service:
    build: ./auth-service
    ports:
      - "3001:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/auth_db
    depends_on:
      - postgres
      - redis

  checkin-service:
    build: ./checkin-service
    ports:
      - "3002:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/checkin_db
    depends_on:
      - postgres
      - redis

  analytics-service:
    build: ./analytics-service
    ports:
      - "3003:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/analytics_db
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=jab_martial_arts
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### **API Gateway**

#### **Nginx конфигурация**
```nginx
upstream auth_service {
    server auth-service:3000;
}

upstream checkin_service {
    server checkin-service:3000;
}

upstream analytics_service {
    server analytics-service:3000;
}

server {
    listen 80;
    server_name api.jab-martial-arts.com;

    location /auth/ {
        proxy_pass http://auth_service/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /checkin/ {
        proxy_pass http://checkin_service/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /analytics/ {
        proxy_pass http://analytics_service/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### **База данных**

#### **Миграция с PocketBase на PostgreSQL**
```sql
-- Создание схем для каждого сервиса
CREATE SCHEMA auth;
CREATE SCHEMA checkin;
CREATE SCHEMA analytics;

-- Миграция данных из PocketBase
-- (Скрипты миграции будут созданы отдельно)
```

## 📊 Мониторинг и логирование

### **Структура логов**
```typescript
interface LogEntry {
  timestamp: string;
  service: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  userId?: string;
  gymId?: string;
  requestId: string;
  metadata?: Record<string, any>;
}
```

### **Метрики**
- **Response time** для каждого сервиса
- **Error rate** по сервисам
- **Throughput** (запросов в секунду)
- **Database connections** и query time
- **Memory usage** и CPU utilization

## 🧪 Тестирование

### **Unit тесты**
```typescript
// Для каждого сервиса
describe('AuthService', () => {
  it('should validate telegram auth code', async () => {
    // Test implementation
  });
});
```

### **Integration тесты**
```typescript
// Тестирование взаимодействия между сервисами
describe('Check-in Flow', () => {
  it('should complete full check-in process', async () => {
    // Test implementation
  });
});
```

### **E2E тесты**
```typescript
// Тестирование полного пользовательского сценария
describe('User Journey', () => {
  it('should allow user to check-in via QR code', async () => {
    // Test implementation
  });
});
```

## 🚀 План деплоя

### **Этап 1: Подготовка**
1. Настройка CI/CD пайплайнов
2. Создание staging окружения
3. Настройка мониторинга

### **Этап 2: Постепенная миграция**
1. Деплой Auth Service
2. Обновление Frontend для использования Auth Service
3. Деплой Check-in Service
4. Обновление Frontend для использования Check-in Service
5. Деплой Analytics Service

### **Этап 3: Финализация**
1. Полное отключение монолита
2. Настройка production мониторинга
3. Оптимизация производительности

## 📋 Чек-лист готовности к миграции

### **Технические требования:**
- [ ] Все функции реализованы и протестированы
- [ ] API endpoints документированы
- [ ] База данных нормализована
- [ ] CI/CD пайплайны настроены
- [ ] Мониторинг и логирование готовы

### **Бизнес требования:**
- [ ] Все пользовательские сценарии работают
- [ ] Производительность соответствует требованиям
- [ ] Безопасность проверена
- [ ] Резервное копирование настроено

## 🔄 Обновление инструкции

### **Когда обновлять:**
- При добавлении новых функций
- При изменении архитектурных решений
- При появлении новых требований
- После каждого этапа миграции

### **Что обновлять:**
- Схемы архитектуры
- API endpoints
- Структуру базы данных
- План миграции
- Чек-лист готовности

## 📚 Связанные файлы

- `01_form_validation_implementation.md` - Валидация форм
- `02_checkin_system_implementation.md` - Система check-in
- `03_trainer_dashboard_implementation.md` - Дашборд тренера
- `04_telegram_auth_bot_implementation.md` - Telegram бот

## ⚠️ Важные замечания

1. **Постепенная миграция** - не пытайтесь мигрировать все сразу
2. **Тестирование** - каждый этап должен быть тщательно протестирован
3. **Откат** - всегда имейте план отката к предыдущей версии
4. **Мониторинг** - следите за производительностью на каждом этапе
5. **Документация** - обновляйте документацию по мере изменений

## 🔧 Зависимости

### **Для миграции потребуется:**
- Docker и Docker Compose
- PostgreSQL 15+
- Redis 7+
- Nginx (для API Gateway)
- CI/CD система (GitHub Actions/GitLab CI)
- Мониторинг (Prometheus + Grafana)

---

**Следующий шаг:** Начать с Этапа 1 - создания модульной структуры в текущем монолите и подготовки к будущей миграции.
