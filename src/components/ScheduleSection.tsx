'use client';

import { useEffect, useState } from 'react';
import { getSchedule, Schedule, formatTimeRange, getDuration, formatDuration, sortScheduleByTime, getLocationName, getCoachesNames, hasMultipleCoaches, getColorThemes, ColorTheme, getColorThemeBySlug, formatColorTheme, getColorThemeStyles, getDefaultLocationColor, getDefaultLevelColor, getTrainingLevels, TrainingLevel, getLevelName, getLevelColorStyles, getLocations, Location } from '@/lib/pocketbase';

export default function ScheduleSection() {
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [colorThemes, setColorThemes] = useState<ColorTheme[]>([]);
  const [trainingLevels, setTrainingLevels] = useState<TrainingLevel[]>([]);
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Фильтры
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  
  // Состояние для мобильного аккордеона
  const [openDays, setOpenDays] = useState<string[]>([]);

  useEffect(() => {
    let isCancelled = false;
    
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Загружаем расписание, цветовые схемы, уровни подготовки и локации параллельно
        const [scheduleData, themesData, levelsData, locationsData] = await Promise.all([
          getSchedule(),
          getColorThemes(),
          getTrainingLevels(),
          getLocations()
        ]);
        
        // Проверяем, что компонент еще смонтирован
        if (!isCancelled) {
          setSchedule(scheduleData);
          setColorThemes(themesData);
          setTrainingLevels(levelsData);
          setAllLocations(locationsData);
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        // В случае ошибки используем пустые массивы только если компонент еще смонтирован
        if (!isCancelled) {
          setSchedule([]);
          setColorThemes([]);
          setTrainingLevels([]);
          setAllLocations([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadData();
    
    // Cleanup функция для отмены запроса при размонтировании
    return () => {
      isCancelled = true;
    };
  }, []);

  // Обработчик события фильтрации по локации
  useEffect(() => {
    const handleLocationFilter = (event: CustomEvent) => {
      const locationName = event.detail.locationName;
      setSelectedGroup(locationName);
    };

    // Слушаем событие фильтрации по локации
    window.addEventListener('locationFilter', handleLocationFilter as EventListener);

    // Проверяем URL параметры при загрузке
    const urlParams = new URLSearchParams(window.location.search);
    const locationParam = urlParams.get('location');
    if (locationParam) {
      setSelectedGroup(locationParam);
    }

    return () => {
      window.removeEventListener('locationFilter', handleLocationFilter as EventListener);
    };
  }, []);

  // Функция фильтрации
  const getFilteredSchedule = () => {
    let filtered = [...schedule];
    

    // Фильтр по дню
    if (selectedDay !== 'all') {
      filtered = filtered.filter(item => item.day === selectedDay);
    }

    // Фильтр по группе (локации)
    if (selectedGroup !== 'all') {
      filtered = filtered.filter(item => getLocationName(item) === selectedGroup);
    }

    // Фильтр по уровню
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(item => {
        const levelName = getLevelName(item);
        return levelName === selectedLevel;
      });
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

  // Управление аккордеоном для мобильных
  const toggleDay = (day: string) => {
    setOpenDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  // Получаем отфильтрованное расписание
  const filteredSchedule = getFilteredSchedule();

  // Определяем доступные дни недели
  const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
  
  // Определяем доступные локации из PocketBase (независимо от наличия тренировок)
  const availableLocations = allLocations.map(location => location.name);
  
  // Определяем доступные уровни из PocketBase (независимо от наличия тренировок)
  const availableLevels = trainingLevels.map(level => level.name);



  // Группируем отфильтрованное расписание по дням
  const groupedSchedule = filteredSchedule.reduce((acc, item) => {
    const dayKey = item.day;
    if (!acc[dayKey]) {
      acc[dayKey] = [];
    }
    acc[dayKey].push(item);
    return acc;
  }, {} as Record<string, Schedule[]>);


  const getTypeColor = (schedule: Schedule) => {
    const locationName = getLocationName(schedule);
    
    // Сначала проверяем, есть ли цветовая схема в самой локации
    if (schedule.expand?.location?.expand?.color_theme) {
      return formatColorTheme(schedule.expand.location.expand.color_theme);
    }
    
    // Затем пытаемся найти цветовую схему по slug локации
    const locationTheme = getColorThemeBySlug(colorThemes, locationName.toLowerCase().replace(/\s+/g, '-'));
    if (locationTheme) {
      return formatColorTheme(locationTheme);
    }
    
    // Предопределенные цвета для известных локаций (fallback)
    const predefinedColors: Record<string, string> = {
      "Локомотив": "bg-red-500/20 text-red-300 border-red-500/30",
      "Сопка": "bg-blue-500/20 text-blue-300 border-blue-500/30",
    };
    
    // Если локация имеет предопределенный цвет, используем его
    if (predefinedColors[locationName]) {
      return predefinedColors[locationName];
    }
    
    // Для новых локаций генерируем цвет на основе хеша названия
    const colors = [
      "bg-green-500/20 text-green-300 border-green-500/30",
      "bg-purple-500/20 text-purple-300 border-purple-500/30",
      "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      "bg-pink-500/20 text-pink-300 border-pink-500/30",
      "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      "bg-orange-500/20 text-orange-300 border-orange-500/30",
      "bg-teal-500/20 text-teal-300 border-teal-500/30",
      "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    ];
    
    // Простой хеш для стабильного выбора цвета
    let hash = 0;
    for (let i = 0; i < locationName.length; i++) {
      hash = ((hash << 5) - hash + locationName.charCodeAt(i)) & 0xffffffff;
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const getTypeColorStyles = (schedule: Schedule) => {
    const locationName = getLocationName(schedule);
    
    // Сначала проверяем, есть ли цветовая схема в самой локации
    if (schedule.expand?.location?.expand?.color_theme) {
      return getColorThemeStyles(schedule.expand.location.expand.color_theme);
    }
    
    // Затем пытаемся найти цветовую схему по slug локации
    const locationTheme = getColorThemeBySlug(colorThemes, locationName.toLowerCase().replace(/\s+/g, '-'));
    if (locationTheme) {
      return getColorThemeStyles(locationTheme);
    }
    
    // Возвращаем дефолтные стили
    return {
      className: "bg-gray-500/20 text-gray-300 border-gray-500/30",
      style: {}
    };
  };



  return (
    <section id="schedule" className="relative py-12 sm:py-16 md:py-20 text-white overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Красные и синие акценты - адаптивные размеры */}
        <div className="absolute top-8 sm:top-12 right-8 sm:right-12 w-16 h-16 sm:w-22 sm:h-22 bg-red-600/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-8 sm:bottom-12 left-8 sm:left-12 w-20 h-20 sm:w-26 sm:h-26 bg-blue-500/08 rounded-full blur-xl animate-pulse" style={{animationDelay: '4.5s'}}></div>
        <div className="absolute top-1/3 left-1/4 w-12 h-12 sm:w-18 sm:h-18 bg-red-600/06 rounded-full blur-lg animate-pulse" style={{animationDelay: '2.2s'}}></div>
        
        {/* Белые линии движения - адаптивные позиции */}
        <div className="absolute top-16 sm:top-20 right-12 sm:right-20 w-4 h-0.5 sm:w-8 sm:h-0.5 bg-white/10 transform rotate-45"></div>
        <div className="absolute bottom-16 sm:bottom-20 left-12 sm:left-20 w-6 h-0.5 sm:w-12 sm:h-0.5 bg-white/10 transform -rotate-45"></div>
        <div className="absolute top-1/2 left-1/2 w-2 h-0.5 sm:w-4 sm:h-0.5 bg-white/06 transform rotate-45"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Заголовок секции */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="hero-jab-title text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                РАСПИСАНИЕ ТРЕНИРОВОК
              </span>
            </h2>
            <p className="hero-jab-text text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
              ВЫБЕРИТЕ УДОБНОЕ ВРЕМЯ ДЛЯ ТРЕНИРОВОК. 
              У НАС ЕСТЬ ЗАНЯТИЯ ДЛЯ ВСЕХ УРОВНЕЙ ПОДГОТОВКИ
            </p>
          </div>

          {/* Фильтры */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-red-500/20 mb-6 sm:mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
              {/* Фильтр по дню */}
              <div>
                <label className="block hero-jab-text text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">День недели</label>
                <select 
                  value={selectedDay} 
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 bg-black/60 border border-red-500/30 rounded-lg text-white focus:border-red-500 focus:outline-none cursor-glove hero-jab-text text-sm"
                >
                  <option value="all">Все дни</option>
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              {/* Фильтр по группе */}
              <div>
                <label className="block hero-jab-text text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">Локация</label>
                <select 
                  value={selectedGroup} 
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 bg-black/60 border border-red-500/30 rounded-lg text-white focus:border-red-500 focus:outline-none cursor-glove hero-jab-text text-sm"
                >
                  <option value="all">Все локации</option>
                  {availableLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Фильтр по уровню */}
              <div>
                <label className="block hero-jab-text text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">Уровень</label>
                <select 
                  value={selectedLevel} 
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 bg-black/60 border border-red-500/30 rounded-lg text-white focus:border-red-500 focus:outline-none cursor-glove hero-jab-text text-sm"
                >
                  <option value="all">Все уровни</option>
                  {availableLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Фильтр по периоду */}
              <div>
                <label className="block hero-jab-text text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">Период</label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <button
                    onClick={() => setSelectedPeriod('today')}
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-all cursor-glove hero-jab-text ${
                      selectedPeriod === 'today' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    Сегодня
                  </button>
                  <button
                    onClick={() => setSelectedPeriod('tomorrow')}
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-all cursor-glove hero-jab-text ${
                      selectedPeriod === 'tomorrow' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    Завтра
                  </button>
                  <button
                    onClick={() => setSelectedPeriod('this_week')}
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-all cursor-glove hero-jab-text ${
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
              <div className="flex items-end sm:col-span-2 lg:col-span-1">
                <button
                  onClick={resetFilters}
                  className="w-full px-3 sm:px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 cursor-glove hero-jab-text text-sm"
                >
                  Сбросить
                </button>
              </div>
            </div>
          </div>

          {/* Расписание */}
          <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border border-white/10">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
                {days.map((day) => (
                  <div key={day} className="bg-white/10 rounded-lg p-3 sm:p-4 animate-pulse">
                    <div className="h-5 sm:h-6 bg-white/20 rounded mb-3 sm:mb-4"></div>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="h-12 sm:h-16 bg-white/20 rounded"></div>
                      <div className="h-12 sm:h-16 bg-white/20 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Проверяем, есть ли занятия после фильтрации */}
                {Object.keys(groupedSchedule).length === 0 || Object.values(groupedSchedule).every(classes => classes.length === 0) ? (
                  <div className="text-center py-12">
                    <div className="bg-white/10 rounded-lg p-8 border border-white/20">
                      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">📅</span>
                      </div>
                      <h3 className="hero-jab-text text-xl font-bold text-white mb-2">
                        Нет занятий
                      </h3>
                      <p className="hero-jab-text text-gray-300 mb-4">
                        По выбранным фильтрам занятий не найдено
                      </p>
                      <button
                        onClick={resetFilters}
                        className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors cursor-glove hero-jab-text"
                      >
                        Сбросить фильтры
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Мобильная версия - аккордеон */}
                    <div className="block lg:hidden space-y-3">
                      {days
                        .filter(day => groupedSchedule[day] && groupedSchedule[day].length > 0)
                        .map((day) => {
                    const isOpen = openDays.includes(day);
                    const dayClasses = groupedSchedule[day] || [];
                    
                    return (
                      <div key={day} className="bg-white/10 rounded-lg border border-white/20 overflow-hidden">
                        <button
                          onClick={() => toggleDay(day)}
                          className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                        >
                          <h3 className="hero-jab-text text-base font-bold text-white">
                            {day}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="hero-jab-text text-xs text-gray-400">
                              {dayClasses.length} занятий
                            </span>
                            <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </button>
                        
                        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className="p-4 pt-0 space-y-3">
                            {dayClasses.map((classItem) => (
                              <div key={classItem.id} className="bg-black/40 rounded-lg p-3 border border-red-500/20">
                                <div className="hero-jab-text text-sm font-semibold text-white mb-2">
                                  {formatTimeRange(classItem.start_time, classItem.end_time)}
                                </div>
                                <div className="flex flex-wrap gap-2 mb-2">
                                  <div 
                                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium border hero-jab-text ${getTypeColorStyles(classItem).className}`}
                                    style={getTypeColorStyles(classItem).style}
                                  >
                                    {getLocationName(classItem)}
                                  </div>
                                  <div 
                                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium border hero-jab-text ${getLevelColorStyles(classItem).className}`}
                                    style={getLevelColorStyles(classItem).style}
                                  >
                                    {getLevelName(classItem)}
                                  </div>
                                </div>
                                <div className="hero-jab-text text-xs text-gray-300">
                                  {hasMultipleCoaches(classItem) ? 'Тренеры' : 'Тренер'}: {getCoachesNames(classItem)}
                                </div>
                              </div>
                            )) || (
                              <div className="text-center text-gray-400 text-sm py-4 hero-jab-text">
                                Нет занятий
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Десктопная версия - сетка */}
                <div className={`hidden lg:grid gap-3 sm:gap-4 ${
                  days.filter(day => groupedSchedule[day] && groupedSchedule[day].length > 0).length === 1 ? 'grid-cols-1' :
                  days.filter(day => groupedSchedule[day] && groupedSchedule[day].length > 0).length === 2 ? 'grid-cols-2' :
                  days.filter(day => groupedSchedule[day] && groupedSchedule[day].length > 0).length === 3 ? 'grid-cols-3' :
                  days.filter(day => groupedSchedule[day] && groupedSchedule[day].length > 0).length === 4 ? 'grid-cols-4' :
                  days.filter(day => groupedSchedule[day] && groupedSchedule[day].length > 0).length === 5 ? 'grid-cols-5' :
                  days.filter(day => groupedSchedule[day] && groupedSchedule[day].length > 0).length === 6 ? 'grid-cols-6' :
                  'grid-cols-7'
                }`}>
                  {days
                    .filter(day => groupedSchedule[day] && groupedSchedule[day].length > 0)
                    .map((day) => (
                    <div key={day} className="bg-white/10 rounded-lg p-3 sm:p-4 border border-white/20">
                      <h3 className="hero-jab-text text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 text-center">
                        {day}
                      </h3>
                      
                      <div className="space-y-2 sm:space-y-3">
                        {groupedSchedule[day]?.map((classItem) => (
                          <div key={classItem.id} className="bg-black/40 rounded-lg p-2 sm:p-3 border border-red-500/20">
                            <div className="hero-jab-text text-xs sm:text-sm font-semibold text-white mb-1 sm:mb-2">
                              {formatTimeRange(classItem.start_time, classItem.end_time)}
                            </div>
                            <div 
                              className={`inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium border hero-jab-text ${getTypeColorStyles(classItem).className} mb-1 sm:mb-2`}
                              style={getTypeColorStyles(classItem).style}
                            >
                              {getLocationName(classItem)}
                            </div>
                            <div 
                              className={`inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium border hero-jab-text ${getLevelColorStyles(classItem).className} mb-1 sm:mb-2 block`}
                              style={getLevelColorStyles(classItem).style}
                            >
                              {getLevelName(classItem)}
                            </div>
                            <div className="hero-jab-text text-xs text-gray-300 mt-1">
                              {hasMultipleCoaches(classItem) ? 'Тренеры' : 'Тренер'}: {getCoachesNames(classItem)}
                            </div>
                          </div>
                        )) || (
                          <div className="text-center text-gray-400 text-xs sm:text-sm py-3 sm:py-4 hero-jab-text">
                            Нет занятий
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}