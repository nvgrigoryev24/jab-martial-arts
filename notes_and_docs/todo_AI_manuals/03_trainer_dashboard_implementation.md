# 📋 Инструкция по реализации дашборда тренера

**Дата создания:** 9 января 2025  
**Приоритет:** 3 (третья задача)  
**Статус:** Ожидает реализации

## 🎯 Цель

Реализовать дашборд тренера для школы единоборств JAB Martial Arts, предоставляющий полную аналитику посещений тренировок, статистику участников и инструменты для мониторинга активности в зале.

## 📝 Контекст проекта

- **Проект:** JAB Martial Arts - сайт школы единоборств
- **Технологии:** Next.js 15.5.2, React, TypeScript, Tailwind CSS
- **Интеграция:** PocketBase для хранения данных
- **Стиль:** Кастомный курсор (боксерская перчатка), градиенты, анимации
- **Целевая аудитория:** Тренеры школы единоборств
- **Зависимости:** Требует наличия системы check-in тренировок (инструкция 02)

## 🔧 Задачи для реализации

### **1. Система ролей и доступ**

#### **Требования:**
- Роль **trainer** должна иметь доступ к дашборду
- Кнопка "Dashboard" в навигации только для тренеров
- Защита маршрута от неавторизованного доступа
- Проверка роли при загрузке страницы

#### **Обновление интерфейса User:**
```typescript
interface User {
  id: string;
  phone: string;
  name: string;
  role: 'participant' | 'trainer' | 'qr_generator';
  created_date: string;
  last_login?: string;
  trainer_specialization?: string; // "Бокс", "Кикбоксинг", "MMA"
  trainer_experience?: number; // лет опыта
}
```

### **2. Навигация с кнопкой Dashboard**

#### **Требования:**
- Кнопка "Dashboard" появляется только для тренеров
- Стилизация в соответствии с дизайном JAB
- Переход на страницу `/trainer-dashboard`
- Отображение имени тренера

#### **Компонент навигации:**
```typescript
const Navigation = () => {
  const user = pb.authStore.model;
  const router = useRouter();

  const handleLogout = () => {
    pb.authStore.clear();
    router.push('/');
  };

  return (
    <nav className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            JAB Martial Arts
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">
                Привет, {user.name || user.phone}
              </span>
              
              {/* Кнопка Dashboard для тренеров */}
              {user.role === 'trainer' && (
                <Link
                  href="/trainer-dashboard"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-glove transition-colors font-medium"
                >
                  Dashboard
                </Link>
              )}
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg cursor-glove transition-colors"
              >
                Выйти
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-glove transition-colors"
            >
              Войти
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
```

### **3. Основной дашборд тренера**

#### **Требования:**
- Статистика посещений за день/неделю/месяц
- Список последних check-in
- Топ активных участников
- Популярное время тренировок
- График активности по дням недели
- Экспорт данных

#### **Интерфейсы данных:**
```typescript
interface DashboardStats {
  today: {
    total: number;
    unique: number;
    hourly: { [hour: string]: number };
  };
  week: {
    total: number;
    unique: number;
    daily: { [day: string]: number };
  };
  month: {
    total: number;
    unique: number;
    weekly: { [week: string]: number };
  };
}

interface CheckInWithUser {
  id: string;
  user_phone: string;
  user_name?: string;
  check_in_time: string;
  status: string;
  user_stats?: {
    total_trainings: number;
    streak_days: number;
  };
}

interface TopUser {
  id: string;
  user_phone: string;
  total_trainings: number;
  streak_days: number;
  last_check_in: string;
  favorite_time?: string;
}
```

#### **Компонент дашборда:**
```typescript
const TrainerDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCheckIns, setRecentCheckIns] = useState<CheckInWithUser[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadDashboardData();
    
    // Автообновление каждые 30 секунд
    const interval = setInterval(loadDashboardData, 30000);
    setRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedDate]);

  const loadDashboardData = async () => {
    setLoading(true);
    
    try {
      // Статистика за сегодня
      const today = selectedDate;
      const todayCheckIns = await pb.collection('check_ins').getList(1, 100, {
        filter: `check_in_time >= "${today}" && status = "success"`,
        expand: 'user_stats'
      });

      // Статистика за неделю
      const weekAgo = new Date(new Date(selectedDate).getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const weekCheckIns = await pb.collection('check_ins').getList(1, 500, {
        filter: `check_in_time >= "${weekAgo}" && status = "success"`,
        expand: 'user_stats'
      });

      // Статистика за месяц
      const monthAgo = new Date(new Date(selectedDate).getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const monthCheckIns = await pb.collection('check_ins').getList(1, 1000, {
        filter: `check_in_time >= "${monthAgo}" && status = "success"`,
        expand: 'user_stats'
      });

      // Подсчет уникальных пользователей
      const todayUnique = new Set(todayCheckIns.items.map(ci => ci.user_phone)).size;
      const weekUnique = new Set(weekCheckIns.items.map(ci => ci.user_phone)).size;
      const monthUnique = new Set(monthCheckIns.items.map(ci => ci.user_phone)).size;

      // Статистика по часам
      const hourlyStats = calculateHourlyStats(todayCheckIns.items);
      
      // Статистика по дням недели
      const dailyStats = calculateDailyStats(weekCheckIns.items);

      setStats({
        today: { 
          total: todayCheckIns.items.length, 
          unique: todayUnique,
          hourly: hourlyStats
        },
        week: { 
          total: weekCheckIns.items.length, 
          unique: weekUnique,
          daily: dailyStats
        },
        month: { 
          total: monthCheckIns.items.length, 
          unique: monthUnique,
          weekly: {}
        }
      });

      // Последние check-in
      setRecentCheckIns(todayCheckIns.items.slice(0, 15));

      // Топ пользователей
      const userStats = await pb.collection('user_stats').getList(1, 10, {
        sort: '-total_trainings'
      });
      setTopUsers(userStats.items);

    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateHourlyStats = (checkIns: CheckInWithUser[]) => {
    const hours: { [hour: string]: number } = {};
    checkIns.forEach(checkIn => {
      const hour = new Date(checkIn.check_in_time).getHours();
      hours[hour] = (hours[hour] || 0) + 1;
    });
    return hours;
  };

  const calculateDailyStats = (checkIns: CheckInWithUser[]) => {
    const days: { [day: string]: number } = {};
    checkIns.forEach(checkIn => {
      const day = new Date(checkIn.check_in_time).toLocaleDateString('ru-RU', { weekday: 'long' });
      days[day] = (days[day] || 0) + 1;
    });
    return days;
  };

  const exportData = async (period: 'today' | 'week' | 'month') => {
    try {
      const checkIns = await getCheckInsForPeriod(period);
      const csvData = convertToCSV(checkIns);
      downloadCSV(csvData, `check-ins-${period}-${selectedDate}.csv`);
    } catch (error) {
      console.error('Ошибка экспорта:', error);
    }
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Загрузка данных...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6">
      <div className="container mx-auto">
        {/* Заголовок и фильтры */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Дашборд тренера
          </h1>
          
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"
            />
            
            <button
              onClick={loadDashboardData}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-glove transition-colors"
            >
              Обновить
            </button>
          </div>
        </div>

        {/* Основная статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-2">Сегодня</h3>
            <p className="text-3xl font-bold text-red-500">{stats?.today.total || 0}</p>
            <p className="text-gray-300">отметок</p>
            <p className="text-sm text-gray-400 mt-2">
              {stats?.today.unique || 0} уникальных участников
            </p>
          </div>
          
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-2">За неделю</h3>
            <p className="text-3xl font-bold text-green-500">{stats?.week.total || 0}</p>
            <p className="text-gray-300">отметок</p>
            <p className="text-sm text-gray-400 mt-2">
              {stats?.week.unique || 0} уникальных участников
            </p>
          </div>
          
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-2">За месяц</h3>
            <p className="text-3xl font-bold text-blue-500">{stats?.month.total || 0}</p>
            <p className="text-gray-300">отметок</p>
            <p className="text-sm text-gray-400 mt-2">
              {stats?.month.unique || 0} уникальных участников
            </p>
          </div>
        </div>

        {/* Графики и детальная статистика */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Популярное время тренировок */}
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Популярное время сегодня</h3>
            <div className="space-y-2">
              {Object.entries(stats?.today.hourly || {})
                .sort(([,a], [,b]) => b - a)
                .slice(0, 8)
                .map(([hour, count]) => (
                <div key={hour} className="flex justify-between items-center">
                  <span className="text-gray-300">{hour}:00</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${(count / Math.max(...Object.values(stats?.today.hourly || {}))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-medium w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Активность по дням недели */}
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Активность по дням недели</h3>
            <div className="space-y-2">
              {Object.entries(stats?.week.daily || {})
                .sort(([,a], [,b]) => b - a)
                .map(([day, count]) => (
                <div key={day} className="flex justify-between items-center">
                  <span className="text-gray-300 capitalize">{day}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(count / Math.max(...Object.values(stats?.week.daily || {}))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-medium w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Детальная информация */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Последние отметки */}
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Последние отметки</h3>
              <button
                onClick={() => exportData('today')}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded cursor-glove"
              >
                Экспорт
              </button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentCheckIns.map(checkIn => (
                <div key={checkIn.id} className="flex justify-between items-center py-3 border-b border-gray-600">
                  <div>
                    <span className="text-white font-medium">
                      {checkIn.user_name || checkIn.user_phone}
                    </span>
                    <p className="text-gray-400 text-sm">
                      {checkIn.user_phone}
                    </p>
                    {checkIn.user_stats && (
                      <p className="text-gray-500 text-xs">
                        {checkIn.user_stats.total_trainings} тренировок, серия: {checkIn.user_stats.streak_days} дней
                      </p>
                    )}
                  </div>
                  <span className="text-gray-300 text-sm">
                    {new Date(checkIn.check_in_time).toLocaleTimeString()}
                  </span>
                </div>
              ))}
              {recentCheckIns.length === 0 && (
                <p className="text-gray-400 text-center py-8">
                  Сегодня еще никто не отметился
                </p>
              )}
            </div>
          </div>

          {/* Топ участников */}
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Топ участников</h3>
              <button
                onClick={() => exportData('month')}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded cursor-glove"
              >
                Экспорт
              </button>
            </div>
            <div className="space-y-3">
              {topUsers.map((user, index) => (
                <div key={user.id} className="flex justify-between items-center py-3 border-b border-gray-600">
                  <div className="flex items-center space-x-3">
                    <span className="text-red-500 font-bold text-lg w-8">
                      #{index + 1}
                    </span>
                    <div>
                      <span className="text-white font-medium">
                        {user.user_phone}
                      </span>
                      <p className="text-gray-400 text-sm">
                        Серия: {user.streak_days} дней
                      </p>
                      {user.favorite_time && (
                        <p className="text-gray-500 text-xs">
                          Любимое время: {user.favorite_time}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-green-500 font-bold text-lg">
                      {user.total_trainings}
                    </span>
                    <p className="text-gray-400 text-xs">тренировок</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Дополнительные инструменты */}
        <div className="mt-8 bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Инструменты</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => exportData('week')}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-glove transition-colors"
            >
              Экспорт за неделю
            </button>
            
            <button
              onClick={() => exportData('month')}
              className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-glove transition-colors"
            >
              Экспорт за месяц
            </button>
            
            <button
              onClick={() => window.print()}
              className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg cursor-glove transition-colors"
            >
              Печать отчета
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### **4. Защита маршрутов**

#### **Требования:**
- Проверка авторизации
- Проверка роли trainer
- Редирект на страницу ошибки при отсутствии прав
- Middleware для защиты маршрута

#### **Middleware для проверки роли тренера:**
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  if (pathname.startsWith('/trainer-dashboard')) {
    // Проверка авторизации и роли будет происходить на клиенте
    // так как PocketBase работает в браузере
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/trainer-dashboard/:path*']
};
```

#### **Страница дашборда с защитой:**
```typescript
// app/trainer-dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { pb } from '@/lib/pocketbase';
import TrainerDashboard from '@/components/TrainerDashboard';

export default function TrainerDashboardPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthorization = () => {
      const user = pb.authStore.model;
      
      if (!user) {
        router.push('/auth');
        return;
      }
      
      if (user.role !== 'trainer') {
        router.push('/unauthorized');
        return;
      }
      
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuthorization();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Проверка доступа...</div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Редирект уже произошел
  }

  return <TrainerDashboard />;
}
```

### **5. Утилиты для экспорта данных**

#### **Требования:**
- Экспорт в CSV формат
- Фильтрация по периодам
- Включение всех необходимых данных
- Автоматическое скачивание файла

#### **Функции экспорта:**
```typescript
const getCheckInsForPeriod = async (period: 'today' | 'week' | 'month') => {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
  }

  const checkIns = await pb.collection('check_ins').getList(1, 1000, {
    filter: `check_in_time >= "${startDate.toISOString()}" && status = "success"`,
    expand: 'user_stats'
  });

  return checkIns.items;
};

const convertToCSV = (data: CheckInWithUser[]) => {
  const headers = [
    'Дата',
    'Время',
    'Телефон',
    'Имя',
    'Всего тренировок',
    'Серия дней',
    'Статус'
  ];

  const rows = data.map(item => [
    new Date(item.check_in_time).toLocaleDateString('ru-RU'),
    new Date(item.check_in_time).toLocaleTimeString('ru-RU'),
    item.user_phone,
    item.user_name || '',
    item.user_stats?.total_trainings || 0,
    item.user_stats?.streak_days || 0,
    item.status
  ]);

  return [headers, ...rows].map(row => 
    row.map(field => `"${field}"`).join(',')
  ).join('\n');
};

const downloadCSV = (csvData: string, filename: string) => {
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
```

### **6. Страница ошибки доступа**

#### **Требования:**
- Информативное сообщение об ошибке
- Кнопка возврата на главную
- Стилизация в соответствии с дизайном JAB

#### **Компонент страницы ошибки:**
```typescript
// app/unauthorized/page.tsx
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-8">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Доступ запрещен
          </h1>
          <p className="text-gray-300 mb-6">
            У вас нет прав для просмотра этой страницы. 
            Дашборд тренера доступен только пользователям с ролью "тренер".
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg cursor-glove transition-colors"
          >
            На главную
          </Link>
          
          <Link
            href="/auth"
            className="block px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg cursor-glove transition-colors"
          >
            Войти в систему
          </Link>
        </div>
      </div>
    </div>
  );
}
```

## 🎨 Стилизация

### **Классы для дашборда:**
```css
/* Анимации загрузки */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Стили для карточек статистики */
.dashboard-card {
  @apply bg-white/10 backdrop-blur-sm border border-gray-700 rounded-lg p-6;
  transition: all 0.3s ease;
}

.dashboard-card:hover {
  @apply bg-white/15 border-gray-600;
}

/* Стили для прогресс-баров */
.progress-bar {
  @apply bg-gray-700 rounded-full h-2 overflow-hidden;
}

.progress-fill {
  @apply h-full transition-all duration-500 ease-out;
}

/* Стили для таблиц */
.dashboard-table {
  @apply w-full text-left;
}

.dashboard-table th {
  @apply text-gray-300 font-medium pb-2 border-b border-gray-600;
}

.dashboard-table td {
  @apply py-3 border-b border-gray-700;
}

/* Стили для кнопок экспорта */
.export-button {
  @apply px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded cursor-glove transition-colors;
}

/* Стили для фильтров */
.date-filter {
  @apply px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none;
}
```

## 🔗 Интеграция с PocketBase

### **Настройка коллекций:**
1. **users** - пользователи с ролями (уже существует)
2. **check_ins** - записи о посещениях (уже существует)
3. **user_stats** - статистика пользователей (уже существует)

### **Права доступа:**
- **trainer** - чтение всех данных check_ins и user_stats
- **participant** - только чтение собственных данных
- **qr_generator** - только создание qr_sessions

### **Индексы для производительности:**
```sql
-- Индексы для быстрого поиска
CREATE INDEX idx_check_ins_date ON check_ins(check_in_time);
CREATE INDEX idx_check_ins_user ON check_ins(user_phone);
CREATE INDEX idx_check_ins_status ON check_ins(status);
CREATE INDEX idx_user_stats_trainings ON user_stats(total_trainings);
```

## 📋 План реализации

### **Этап 1: Подготовка**
1. Обновить интерфейс User с полями тренера
2. Создать типы для DashboardStats и связанных интерфейсов
3. Настроить права доступа в PocketBase

### **Этап 2: Навигация**
1. Обновить компонент Navigation
2. Добавить кнопку Dashboard для тренеров
3. Протестировать переходы

### **Этап 3: Основной дашборд**
1. Создать компонент TrainerDashboard
2. Реализовать загрузку статистики
3. Добавить фильтры по датам

### **Этап 4: Графики и визуализация**
1. Создать компоненты для графиков
2. Реализовать статистику по часам и дням
3. Добавить прогресс-бары

### **Этап 5: Экспорт данных**
1. Создать утилиты для экспорта
2. Реализовать конвертацию в CSV
3. Добавить функции скачивания

### **Этап 6: Защита маршрутов**
1. Создать middleware для проверки ролей
2. Реализовать страницу ошибки доступа
3. Добавить проверки на клиенте

### **Этап 7: Тестирование и оптимизация**
1. Протестировать все функции дашборда
2. Оптимизировать производительность
3. Проверить работу на разных устройствах

## 🧪 Тестирование

### **Сценарии тестирования:**

1. **Авторизация:**
   - Доступ для пользователя с ролью trainer
   - Блокировка для пользователей с другими ролями
   - Редирект неавторизованных пользователей

2. **Загрузка данных:**
   - Статистика за день/неделю/месяц
   - Последние check-in
   - Топ участников

3. **Фильтрация:**
   - Выбор даты
   - Обновление данных
   - Автообновление

4. **Экспорт:**
   - Экспорт за разные периоды
   - Корректность CSV данных
   - Скачивание файлов

5. **Производительность:**
   - Скорость загрузки данных
   - Работа с большими объемами
   - Оптимизация запросов

6. **Адаптивность:**
   - Работа на мобильных устройствах
   - Корректное отображение на разных экранах
   - Удобство использования

## 📚 Связанные файлы

- `src/components/TrainerDashboard.tsx` - основной компонент дашборда
- `src/components/Navigation.tsx` - навигация с кнопкой Dashboard
- `src/app/trainer-dashboard/page.tsx` - страница дашборда
- `src/app/unauthorized/page.tsx` - страница ошибки доступа
- `src/lib/pocketbase.ts` - интерфейсы и функции
- `src/utils/exportUtils.ts` - утилиты для экспорта
- `src/middleware.ts` - middleware для защиты маршрутов
- `src/app/globals.css` - стили дашборда

## ⚠️ Важные замечания

1. **Зависимости:** Требует наличия системы check-in (инструкция 02)
2. **Производительность:** Оптимизировать запросы к базе данных
3. **Безопасность:** Строгая проверка ролей и авторизации
4. **Доступность:** Поддержка screen readers и клавиатурной навигации
5. **Стиль:** Соответствие дизайну JAB Martial Arts
6. **Масштабируемость:** Возможность добавления новых метрик

## 🔧 Зависимости

### **Новые пакеты:**
```json
{
  "recharts": "^2.8.0",
  "date-fns": "^2.30.0"
}
```

### **Типы:**
```json
{
  "@types/recharts": "^2.0.0"
}
```

---

**Следующий шаг:** Начать с Этапа 1 - обновления интерфейсов и настройки PocketBase.








