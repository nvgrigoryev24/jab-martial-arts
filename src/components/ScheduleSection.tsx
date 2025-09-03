'use client';

import { useEffect, useState } from 'react';
import { getSchedule, Schedule } from '@/lib/pocketbase';

export default function ScheduleSection() {
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Фильтры
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');

  useEffect(() => {
    // Принудительно используем моковые данные для демонстрации
    console.log('Loading mock schedule data...');
    
    const mockData = [
      // Понедельник
      {
        id: '1',
        day: "Понедельник",
        time: "7:00 - 8:00",
        martial_art: "Бокс",
        trainer: "Иван Петров",
        level: "beginner",
        max_participants: 12,
        current_participants: 8,
        created: "",
        updated: ""
      },
      {
        id: '2',
        day: "Понедельник",
        time: "18:00 - 19:00",
        martial_art: "ММА",
        trainer: "Алексей Сидоров",
        level: "intermediate",
        max_participants: 10,
        current_participants: 6,
        created: "",
        updated: ""
      },
      {
        id: '3',
        day: "Понедельник",
        time: "19:30 - 20:30",
        martial_art: "Кикбоксинг",
        trainer: "Мария Козлова",
        level: "advanced",
        max_participants: 8,
        current_participants: 5,
        created: "",
        updated: ""
      },
      // Вторник
      {
        id: '4',
        day: "Вторник",
        time: "8:00 - 9:00",
        martial_art: "Бокс",
        trainer: "Иван Петров",
        level: "intermediate",
        max_participants: 12,
        current_participants: 10,
        created: "",
        updated: ""
      },
      {
        id: '5',
        day: "Вторник",
        time: "18:30 - 19:30",
        martial_art: "ММА",
        trainer: "Алексей Сидоров",
        level: "beginner",
        max_participants: 12,
        current_participants: 9,
        created: "",
        updated: ""
      },
      // Среда
      {
        id: '6',
        day: "Среда",
        time: "7:30 - 8:30",
        martial_art: "Бокс",
        trainer: "Иван Петров",
        level: "all",
        max_participants: 15,
        current_participants: 12,
        created: "",
        updated: ""
      },
      {
        id: '7',
        day: "Среда",
        time: "19:00 - 20:00",
        martial_art: "ММА",
        trainer: "Алексей Сидоров",
        level: "advanced",
        max_participants: 8,
        current_participants: 6,
        created: "",
        updated: ""
      },
      {
        id: '8',
        day: "Среда",
        time: "20:15 - 21:15",
        martial_art: "Кикбоксинг",
        trainer: "Мария Козлова",
        level: "intermediate",
        max_participants: 10,
        current_participants: 7,
        created: "",
        updated: ""
      },
      // Четверг
      {
        id: '9',
        day: "Четверг",
        time: "18:30 - 19:30",
        martial_art: "Кикбоксинг",
        trainer: "Мария Козлова",
        level: "beginner",
        max_participants: 10,
        current_participants: 7,
        created: "",
        updated: ""
      },
      {
        id: '10',
        day: "Четверг",
        time: "19:45 - 20:45",
        martial_art: "Бокс",
        trainer: "Иван Петров",
        level: "advanced",
        max_participants: 8,
        current_participants: 6,
        created: "",
        updated: ""
      },
      // Пятница
      {
        id: '11',
        day: "Пятница",
        time: "7:30 - 8:30",
        martial_art: "Бокс",
        trainer: "Иван Петров",
        level: "all",
        max_participants: 15,
        current_participants: 12,
        created: "",
        updated: ""
      },
      {
        id: '12',
        day: "Пятница",
        time: "18:00 - 19:00",
        martial_art: "ММА",
        trainer: "Алексей Сидоров",
        level: "intermediate",
        max_participants: 10,
        current_participants: 8,
        created: "",
        updated: ""
      },
      // Суббота
      {
        id: '13',
        day: "Суббота",
        time: "10:00 - 11:00",
        martial_art: "ММА",
        trainer: "Алексей Сидоров",
        level: "beginner",
        max_participants: 12,
        current_participants: 8,
        created: "",
        updated: ""
      },
      {
        id: '14',
        day: "Суббота",
        time: "11:15 - 12:15",
        martial_art: "Кикбоксинг",
        trainer: "Мария Козлова",
        level: "all",
        max_participants: 12,
        current_participants: 10,
        created: "",
        updated: ""
      },
      {
        id: '15',
        day: "Суббота",
        time: "16:00 - 17:00",
        martial_art: "Бокс",
        trainer: "Иван Петров",
        level: "intermediate",
        max_participants: 12,
        current_participants: 9,
        created: "",
        updated: ""
      },
      // Воскресенье
      {
        id: '16',
        day: "Воскресенье",
        time: "10:30 - 11:30",
        martial_art: "Кикбоксинг",
        trainer: "Мария Козлова",
        level: "advanced",
        max_participants: 8,
        current_participants: 5,
        created: "",
        updated: ""
      },
      {
        id: '17',
        day: "Воскресенье",
        time: "17:00 - 18:00",
        martial_art: "ММА",
        trainer: "Алексей Сидоров",
        level: "all",
        max_participants: 12,
        current_participants: 11,
        created: "",
        updated: ""
      }
    ];

    setSchedule(mockData);
    setLoading(false);
    console.log('Mock data loaded:', mockData.length, 'records');
  }, []);

  // Функция фильтрации
  const getFilteredSchedule = () => {
    let filtered = [...schedule];

    // Фильтр по дню
    if (selectedDay !== 'all') {
      filtered = filtered.filter(item => item.day === selectedDay);
    }

    // Фильтр по группе (виду единоборств)
    if (selectedGroup !== 'all') {
      filtered = filtered.filter(item => item.martial_art === selectedGroup);
    }

    // Фильтр по уровню
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(item => item.level === selectedLevel);
    }

    // Фильтр по периоду
    if (selectedPeriod !== 'all') {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
      const todayName = dayNames[today.getDay()];
      const tomorrowName = dayNames[tomorrow.getDay()];
      
      switch (selectedPeriod) {
        case 'today':
          filtered = filtered.filter(item => item.day === todayName);
          break;
        case 'tomorrow':
          filtered = filtered.filter(item => item.day === tomorrowName);
          break;
        case 'this_week':
          // Показываем все дни недели
          break;
      }
    }

    return filtered;
  };

  // Сброс фильтров
  const resetFilters = () => {
    setSelectedDay('all');
    setSelectedGroup('all');
    setSelectedLevel('all');
    setSelectedPeriod('all');
  };

  // Получаем отфильтрованное расписание
  const filteredSchedule = getFilteredSchedule();

  // Отладочная информация (можно убрать после тестирования)
  // console.log('Schedule data:', schedule);
  // console.log('Filtered schedule:', filteredSchedule);
  // console.log('Loading state:', loading);

  // Группируем отфильтрованное расписание по дням
  const groupedSchedule = filteredSchedule.reduce((acc, item) => {
    if (!acc[item.day]) {
      acc[item.day] = [];
    }
    acc[item.day].push(item);
    return acc;
  }, {} as Record<string, Schedule[]>);

  const getTypeColor = (martialArt: string) => {
    switch (martialArt) {
      case "Бокс":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "ММА":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "Кикбоксинг":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case "beginner":
        return "Начинающие";
      case "intermediate":
        return "Средний";
      case "advanced":
        return "Продвинутые";
      case "all":
        return "Все уровни";
      default:
        return level;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "intermediate":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "advanced":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "all":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const days = [
    "Понедельник",
    "Вторник", 
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
    "Воскресенье"
  ];

  const martialArts = ["Бокс", "ММА", "Кикбоксинг"];
  const levels = ["beginner", "intermediate", "advanced", "all"];

  return (
    <section id="schedule" className="relative py-20 text-white overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Красные и синие акценты */}
        <div className="absolute top-12 right-12 w-22 h-22 bg-red-600/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-12 left-12 w-26 h-26 bg-blue-500/08 rounded-full blur-xl animate-pulse" style={{animationDelay: '4.5s'}}></div>
        <div className="absolute top-1/3 left-1/4 w-18 h-18 bg-red-600/06 rounded-full blur-lg animate-pulse" style={{animationDelay: '2.2s'}}></div>
        
        {/* Белые линии движения */}
        <div className="absolute top-20 right-20 w-8 h-0.5 bg-white/10 transform rotate-45"></div>
        <div className="absolute bottom-20 left-20 w-12 h-0.5 bg-white/10 transform -rotate-45"></div>
        <div className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-white/06 transform rotate-45"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Заголовок секции */}
          <div className="text-center mb-16">
            <h2 className="hero-jab-title text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                РАСПИСАНИЕ ТРЕНИРОВОК
              </span>
            </h2>
            <p className="hero-jab-text text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              ВЫБЕРИТЕ УДОБНОЕ ВРЕМЯ ДЛЯ ТРЕНИРОВОК. 
              У НАС ЕСТЬ ЗАНЯТИЯ ДЛЯ ВСЕХ УРОВНЕЙ ПОДГОТОВКИ
            </p>
          </div>

          {/* Фильтры */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Фильтр по дню */}
              <div>
                <label className="block hero-jab-text text-sm font-medium text-gray-300 mb-2">День недели</label>
                <select 
                  value={selectedDay} 
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="w-full px-4 py-2 bg-black/60 border border-red-500/30 rounded-lg text-white focus:border-red-500 focus:outline-none cursor-glove hero-jab-text"
                >
                  <option value="all">Все дни</option>
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              {/* Фильтр по группе */}
              <div>
                <label className="block hero-jab-text text-sm font-medium text-gray-300 mb-2">Вид единоборств</label>
                <select 
                  value={selectedGroup} 
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full px-4 py-2 bg-black/60 border border-red-500/30 rounded-lg text-white focus:border-red-500 focus:outline-none cursor-glove hero-jab-text"
                >
                  <option value="all">Все виды</option>
                  {martialArts.map(art => (
                    <option key={art} value={art}>{art}</option>
                  ))}
                </select>
              </div>

              {/* Фильтр по уровню */}
              <div>
                <label className="block hero-jab-text text-sm font-medium text-gray-300 mb-2">Уровень</label>
                <select 
                  value={selectedLevel} 
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-4 py-2 bg-black/60 border border-red-500/30 rounded-lg text-white focus:border-red-500 focus:outline-none cursor-glove hero-jab-text"
                >
                  <option value="all">Все уровни</option>
                  <option value="beginner">Начинающие</option>
                  <option value="intermediate">Средний</option>
                  <option value="advanced">Продвинутые</option>
                </select>
              </div>

              {/* Фильтр по периоду */}
              <div>
                <label className="block hero-jab-text text-sm font-medium text-gray-300 mb-2">Период</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedPeriod('today')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-glove hero-jab-text ${
                      selectedPeriod === 'today' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    Сегодня
                  </button>
                  <button
                    onClick={() => setSelectedPeriod('tomorrow')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-glove hero-jab-text ${
                      selectedPeriod === 'tomorrow' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    Завтра
                  </button>
                  <button
                    onClick={() => setSelectedPeriod('this_week')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-glove hero-jab-text ${
                      selectedPeriod === 'this_week' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    На неделе
                  </button>
                </div>
              </div>

              {/* Кнопка сброса */}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 cursor-glove hero-jab-text"
                >
                  Сбросить
                </button>
              </div>
            </div>
          </div>

          {/* Расписание */}
          <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                {days.map((day) => (
                  <div key={day} className="bg-white/10 rounded-lg p-4 animate-pulse">
                    <div className="h-6 bg-white/20 rounded mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-16 bg-white/20 rounded"></div>
                      <div className="h-16 bg-white/20 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                {days.map((day) => (
                  <div key={day} className="bg-white/10 rounded-lg p-4 border border-white/20">
                    <h3 className="hero-jab-text text-lg font-bold text-white mb-4 text-center">
                      {day}
                    </h3>
                    
                    <div className="space-y-3">
                      {groupedSchedule[day]?.map((classItem) => (
                        <div key={classItem.id} className="bg-black/40 rounded-lg p-3 border border-red-500/20">
                          <div className="hero-jab-text text-sm font-semibold text-white mb-2">
                            {classItem.time}
                          </div>
                          <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium border hero-jab-text ${getTypeColor(classItem.martial_art)} mb-2`}>
                            {classItem.martial_art}
                          </div>
                          <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium border hero-jab-text ${getLevelColor(classItem.level)} mb-2 block`}>
                            {getLevelText(classItem.level)}
                          </div>
                          <div className="hero-jab-text text-xs text-gray-400">
                            {classItem.current_participants}/{classItem.max_participants} мест
                          </div>
                          <div className="hero-jab-text text-xs text-gray-300 mt-1">
                            Тренер: {classItem.trainer}
                          </div>
                        </div>
                      )) || (
                        <div className="text-center text-gray-400 text-sm py-4 hero-jab-text">
                          Нет занятий
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}