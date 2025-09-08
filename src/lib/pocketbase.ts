import PocketBase from 'pocketbase';
import React from 'react';

// Создаем экземпляр PocketBase
export const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');

// Типы для наших коллекций
export interface Trainer {
  id: string;
  name: string;
  specialization: string;
  experience_years: number;
  short_bio: string;
  description: string;
  photo?: string;
  achievements: string;
  is_active: boolean;
  sort_order: number;
  created: string;
  updated: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  description: string;
  equipment: string;
  contact_phone?: string;
  color_theme?: string; // ID цветовой схемы
  is_active: boolean;
  sort_order: number;
  created: string;
  updated: string;
  // Расширенные данные (заполняются при загрузке)
  expand?: {
    color_theme?: ColorTheme;
  };
}

export interface HeroContent {
  id: string;
  eyebrow_text: string;
  title: string;
  description: string;
  cta_text: string;
  cta_link: string;
  feature_1_text: string;
  feature_2_text: string;
  image_url?: string;
  image_alt: string;
  is_active: boolean;
  sort_order: number;
  created: string;
  updated: string;
}

export interface Coach {
  id: string;
  name: string;
  specialization: string;
  experience_years: number;
  description: string;
  photo?: string;
  achievements: string;
  is_active: boolean;
  created: string;
  updated: string;
}

export interface Schedule {
  id: string;
  day: string;
  start_time: string; // Время начала (например: "18:00")
  end_time: string;    // Время окончания (например: "19:00")
  location: string;    // ID локации (связь с коллекцией locations)
  coaches: string[];   // Массив ID тренеров (связь с коллекцией coaches)
  level: string;       // ID уровня подготовки (связь с коллекцией training_levels)
  is_active: boolean;  // Активность тренировки
  sort_order: number;  // Порядок сортировки
  created: string;
  updated: string;
  // Расширенные данные (заполняются при загрузке)
  expand?: {
    level?: TrainingLevel;
    location?: Location;
    coaches?: Coach[];
  };
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  contact_methods?: string;
  location?: string;
  status: 'new' | 'contacted' | 'scheduled' | 'completed';
  created: string;
  updated: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string;
  is_popular: boolean;
  popular_badge_text?: string;
  button_text: string;
  payment_link?: string;
  link_target?: '_blank' | '_self';
  is_active: boolean;
  sort_order: number;
  created: string;
  updated: string;
}

export interface ColorTheme {
  id: string;
  name: string;
  slug: string;
  color: string;
  bg_color: string;
  border_color: string;
  transparency: number; // 0-100, где 100 = полная прозрачность, 0 = полная непрозрачность
  preview: string;
  is_active: boolean;
  sort_order: number;
  created: string;
  updated: string;
}

export interface TrainingLevel {
  id: string;
  name: string;
  slug: string;
  description: string;
  color_theme?: string; // ID цветовой схемы (relation)
  is_active: boolean;
  sort_order: number;
  created: string;
  updated: string;
  // Расширенные данные (заполняются при загрузке)
  expand?: {
    color_theme?: ColorTheme;
  };
}

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  color?: string; // Опциональное поле для обратной совместимости
  bg_color?: string; // Опциональное поле для обратной совместимости
  border_color?: string; // Опциональное поле для обратной совместимости
  color_theme: string; // Связь с коллекцией color_theme
  icon: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  created: string;
  updated: string;
  // Расширенные данные
  expand?: {
    color_theme?: ColorTheme;
  };
}

export interface NewsAuthor {
  id: string;
  name: string;
  slug: string;
  bio: string;
  photo?: string;
  email?: string;
  social_links?: string;
  is_active: boolean;
  sort_order: number;
  created: string;
  updated: string;
}

export interface NewsReaction {
  id: string;
  emoji: string;
  name: string;
  is_active: boolean;
  sort_order: number;
  created: string;
  updated: string;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  published_date: string;
  category: string; // ID категории
  author: string; // ID автора
  reactions: string[]; // Массив ID реакций
  reaction_counts: { [reactionName: string]: number }; // Счетчики реакций (обязательное поле)
  is_hot: boolean;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  created: string;
  updated: string;
  // Расширенные данные (заполняются при загрузке)
  expand?: {
    category?: NewsCategory;
    author?: NewsAuthor;
    reactions?: NewsReaction[];
  };
}

export interface AboutPage {
  id: string;
  section_title: string;     // Заголовок секции
  section_subtitle: string;  // Подзаголовок
  bottom_banner_text: string; // Текст нижнего баннера
  is_active: boolean;        // Активность
  sort_order: number;       // Порядок сортировки
  created: string;
  updated: string;
}

export interface AboutCard {
  id: string;
  title: string;            // Заголовок карточки
  description: string;      // Описание карточки
  icon: string;            // Эмодзи иконка
  background_image?: string; // Фоновое изображение карточки
  is_active: boolean;      // Активность
  sort_order: number;      // Порядок сортировки
  created: string;
  updated: string;
}

export interface CTABanner {
  id: string;
  title: string;            // Заголовок баннера
  subtitle: string;         // Подзаголовок
  button_text: string;      // Текст на кнопке
  button_link: string;      // Ссылка кнопки
  character_image?: string;  // Изображение персонажа
  is_active: boolean;       // Активность
  sort_order: number;       // Порядок сортировки
  created: string;
  updated: string;
}

export interface PromoSection {
  id: string;
  title: string;                    // Заголовок секции
  subtitle: string;                 // Подзаголовок/описание
  background_image?: string;        // Фоновое изображение
  contact_button_text: string;       // Текст кнопки "Связаться с нами"
  contact_button_link: string;      // Ссылка для связи
  support_button_text: string;      // Текст кнопки "Поддержать"
  support_button_link: string;      // Ссылка для поддержки
  is_active: boolean;              // Активность секции
  sort_order: number;              // Порядок показа
  created: string;
  updated: string;
}

export interface FAQ {
  id: string;
  question: string;         // Текст вопроса
  answer: string;          // Ответ (rich text)
  faq_category: string;    // ID категории (relation)
  is_active: boolean;      // Активность
  sort_order: number;      // Порядок сортировки
  created: string;
  updated: string;
  expand?: {
    faq_category?: FAQCategory;
  };
}

export interface FAQCategory {
  id: string;
  name: string;            // Название категории
  slug: string;            // URL-дружественное название
  description: string;     // Описание категории
  color_theme: string;    // ID цветовой схемы (relation)
  is_active: boolean;     // Активность
  sort_order: number;      // Порядок сортировки
  created: string;
  updated: string;
  expand?: {
    color_theme?: ColorTheme;
  };
}

// Функции для работы с данными
export const getTrainers = async (signal?: AbortSignal): Promise<Trainer[]> => {
  try {
    const records = await pb.collection('coaches').getFullList<Trainer>({
      filter: 'is_active = true',
      sort: 'sort_order'
    });
    return records;
  } catch (error: any) {
    // Игнорируем ошибки отмены запроса
    if (error.name === 'AbortError' || error.message?.includes('autocancelled')) {
      throw error; // Пробрасываем ошибку отмены наверх
    }
    console.error('Error fetching trainers:', error);
    return [];
  }
};

// Серверная функция для получения тренеров (для Server Components)
export const getTrainersServer = async (): Promise<Trainer[]> => {
  try {
    // Создаем новый экземпляр для серверного запроса
    const serverPb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');
    
    const records = await serverPb.collection('coaches').getFullList<Trainer>({
      filter: 'is_active = true',
      sort: 'sort_order'
    });
    return records;
  } catch (error) {
    console.error('Error fetching trainers on server:', error);
    return [];
  }
};

export const getLocations = async (): Promise<Location[]> => {
  try {
    const records = await pb.collection('locations').getFullList<Location>({
      filter: 'is_active = true',
      expand: 'color_theme',
      sort: 'sort_order'
    });
    return records;
  } catch (error: any) {
    // Игнорируем ошибки автоперезагрузки Next.js
    if (error?.status === 0 && error?.message?.includes('autocancelled')) {
      return [];
    }
    console.error('Error fetching locations:', error);
    return [];
  }
};

export const getHeroContent = async (): Promise<HeroContent | null> => {
  try {
    const records = await pb.collection('hero_content').getFullList<HeroContent>({
      filter: 'is_active = true',
      sort: 'sort_order',
      limit: 1
    });
    return records.length > 0 ? records[0] : null;
  } catch (error: any) {
    // Игнорируем ошибки автоперезагрузки Next.js
    if (error?.status === 0 && error?.message?.includes('autocancelled')) {
      return null;
    }
    console.error('Error fetching hero content:', error);
    return null;
  }
};

export const getAboutPage = async (): Promise<AboutPage | null> => {
  try {
    const records = await pb.collection('about_page').getFullList<AboutPage>({
      filter: 'is_active = true',
      sort: 'sort_order',
      limit: 1
    });
    return records.length > 0 ? records[0] : null;
  } catch (error: any) {
    // Игнорируем ошибки автоперезагрузки Next.js
    if (error?.status === 0 && error?.message?.includes('autocancelled')) {
      return null;
    }
    console.error('Error fetching about page:', error);
    return null;
  }
};

export const getAboutCards = async (signal?: AbortSignal): Promise<AboutCard[]> => {
  try {
    const records = await pb.collection('about_cards').getFullList<AboutCard>({
      filter: 'is_active = true',
      sort: 'sort_order'
    });
    return records;
  } catch (error: any) {
    // Игнорируем ошибки отмены запросов
    if (error.message?.includes('autocancelled') || error.message?.includes('cancelled')) {
      return [];
    }
    console.error('Error fetching about cards:', error);
    return [];
  }
};

export const getCTABanner = async (signal?: AbortSignal): Promise<CTABanner | null> => {
  try {
    const records = await pb.collection('cta_banner').getFullList<CTABanner>({
      filter: 'is_active = true',
      sort: 'sort_order',
      limit: 1
    });
    return records.length > 0 ? records[0] : null;
  } catch (error: any) {
    // Игнорируем ошибки отмены запросов
    if (error.message?.includes('autocancelled') || error.message?.includes('cancelled')) {
      return null;
    }
    console.error('Error fetching CTA banner:', error);
    return null;
  }
};

export const getPromoSection = async (signal?: AbortSignal): Promise<PromoSection | null> => {
  try {
    const records = await pb.collection('promo_section').getFullList<PromoSection>({
      filter: 'is_active = true',
      sort: 'sort_order',
      limit: 1
    });
    return records.length > 0 ? records[0] : null;
  } catch (error: any) {
    // Игнорируем ошибки отмены запросов
    if (error.message?.includes('autocancelled') || error.message?.includes('cancelled')) {
      return null;
    }
    console.error('Error fetching promo section:', error);
    return null;
  }
};

export const getFAQCategories = async (signal?: AbortSignal): Promise<FAQCategory[]> => {
  try {
    const records = await pb.collection('faq_categories').getFullList<FAQCategory>({
      filter: 'is_active = true',
      expand: 'color_theme',
      sort: 'sort_order'
    });
    return records;
  } catch (error: any) {
    // Игнорируем ошибки отмены запросов
    if (error.message?.includes('autocancelled') || error.message?.includes('cancelled')) {
      return [];
    }
    console.error('Error fetching FAQ categories:', error);
    return [];
  }
};

export const getFAQs = async (signal?: AbortSignal): Promise<FAQ[]> => {
  try {
    const records = await pb.collection('faq').getFullList<FAQ>({
      filter: 'is_active = true',
      expand: 'faq_category.color_theme',
      sort: 'sort_order'
    });
    return records;
  } catch (error: any) {
    // Игнорируем ошибки отмены запросов
    if (error.message?.includes('autocancelled') || error.message?.includes('cancelled')) {
      return [];
    }
    console.error('Error fetching FAQs:', error);
    return [];
  }
};

export const getColorThemes = async (): Promise<ColorTheme[]> => {
  try {
    const records = await pb.collection('color_theme').getFullList<ColorTheme>({
      filter: 'is_active = true',
      sort: 'sort_order'
    });
    return records;
  } catch (error: any) {
    // Игнорируем ошибки автоперезагрузки Next.js
    if (error?.status === 0 && error?.message?.includes('autocancelled')) {
      return [];
    }
    console.error('Error fetching color themes:', error);
    return [];
  }
};

export const getTrainingLevels = async (): Promise<TrainingLevel[]> => {
  try {
    const records = await pb.collection('training_levels').getFullList<TrainingLevel>({
      filter: 'is_active = true',
      expand: 'color_theme',
      sort: 'sort_order'
    });
    return records;
  } catch (error: any) {
    // Игнорируем ошибки автоперезагрузки Next.js
    if (error?.status === 0 && error?.message?.includes('autocancelled')) {
      return [];
    }
    console.error('Error fetching training levels:', error);
    return [];
  }
};

export const getSchedule = async (): Promise<Schedule[]> => {
  try {
    const records = await pb.collection('schedule').getFullList<Schedule>({
      filter: 'is_active = true',
      expand: 'level.color_theme,location.color_theme,coaches',
      sort: 'day,sort_order,start_time'
    });
    
    
    return records;
  } catch (error: any) {
    // Игнорируем ошибки автоперезагрузки Next.js
    if (error?.status === 0 && error?.message?.includes('autocancelled')) {
      return [];
    }
    console.error('Error fetching schedule:', error);
    return [];
  }
};

export const submitContact = async (contactData: Omit<Contact, 'id' | 'status' | 'created' | 'updated'>): Promise<Contact | null> => {
  try {
    const record = await pb.collection('contacts').create<Contact>({
      ...contactData,
      status: 'new'
    });
    return record;
  } catch (error) {
    console.error('Error submitting contact:', error);
    return null;
  }
};

export const getPricingPlans = async (signal?: AbortSignal): Promise<PricingPlan[]> => {
  try {
    const records = await pb.collection('pricing_plans').getFullList<PricingPlan>({
      filter: 'is_active = true',
      sort: 'sort_order'
    });
    return records;
  } catch (error: any) {
    // Игнорируем ошибки отмены запросов
    if (error.message?.includes('autocancelled') || error.message?.includes('cancelled')) {
      return [];
    }
    return [];
  }
};

export const getNews = async (signal?: AbortSignal): Promise<News[]> => {
  try {
    const records = await pb.collection('news').getFullList<News>({
      filter: 'is_published = true',
      sort: 'sort_order',
      expand: 'category,author,reactions,category.color_theme'
    });
    return records;
  } catch (error: any) {
    // Игнорируем ошибки отмены запросов
    if (error.message?.includes('autocancelled') || error.message?.includes('cancelled')) {
      return [];
    }
    return [];
  }
};

export const getNewsById = async (id: string, signal?: AbortSignal): Promise<News | null> => {
  try {
    const record = await pb.collection('news').getOne<News>(id, {
      signal,
      expand: 'category,author,reactions,category.color_theme'
    });
    return record;
  } catch (error: any) {
    if (error.message?.includes('autocancelled') || error.message?.includes('cancelled')) {
      return null;
    }
    return null;
  }
};

// Функция для получения URL изображения
export const getImageUrl = (record: { id: string }, filename: string): string => {
  return pb.files.getURL(record, filename);
};

// Функция для конвертации прозрачности в HEX
export const transparencyToHex = (transparency: number): string => {
  // Конвертируем 0-100 в 0-255, где 0 = полная непрозрачность, 100 = полная прозрачность
  // В CSS HEX: FF = полная непрозрачность, 00 = полная прозрачность
  const alpha = Math.round((100 - transparency) * 2.55);
  return alpha.toString(16).padStart(2, '0').toUpperCase();
};

// Функция для очистки HTML тегов из rich text полей
export const stripHtmlTags = (html: string): string => {
  if (!html) return '';
  
  // Заменяем HTML теги на пробелы для лучшего форматирования
  let cleanText = html
    .replace(/<br\s*\/?>/gi, '\n') // Заменяем <br> на переносы строк
    .replace(/<\/p>/gi, '\n') // Заменяем </p> на переносы строк
    .replace(/<\/h[1-6]>/gi, '\n') // Заменяем </h1-6> на переносы строк
    .replace(/<\/div>/gi, '\n') // Заменяем </div> на переносы строк
    .replace(/<[^>]*>/g, '') // Убираем все остальные HTML теги
    .replace(/\r\n/g, '\n') // Заменяем Windows переносы на Unix
    .replace(/\r/g, '\n'); // Заменяем старые Mac переносы на Unix
  
  // Убираем лишние пробелы и переносы
  cleanText = cleanText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
  
  return cleanText.trim();
};

// Функция для преобразования rich text в массив строк
export const parseRichTextToList = (html: string): string[] => {
  if (!html) return [];
  
  const cleanText = stripHtmlTags(html);
  
  // Разбиваем по переносам строк и фильтруем пустые строки
  return cleanText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
};

// Функция для очистки HTML от нежелательных тегов, но сохранения форматирования
export const sanitizeHtmlForDisplay = (html: string): string => {
  if (!html) return '';
  
  // Разрешенные теги для форматирования
  const allowedTags = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'span', 'div'];
  
  // Убираем нежелательные теги и атрибуты
  let cleanHtml = html
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Убираем скрипты
    .replace(/<style[^>]*>.*?<\/style>/gi, '') // Убираем стили
    .replace(/on\w+="[^"]*"/gi, '') // Убираем обработчики событий
    .replace(/javascript:/gi, '') // Убираем javascript: ссылки
    .replace(/\r\n/g, '\n') // Нормализуем переносы строк
    .replace(/\r/g, '\n');
  
  // Оставляем только разрешенные теги и убираем атрибуты
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
  cleanHtml = cleanHtml.replace(tagRegex, (match, tagName) => {
    if (allowedTags.includes(tagName.toLowerCase())) {
      // Убираем все атрибуты из разрешенных тегов
      return match.replace(/\s+[^>]*/, '').replace(/\s*>/, '>');
    }
    return ''; // Убираем неразрешенные теги
  });
  
  // Дополнительная очистка - убираем пустые теги
  cleanHtml = cleanHtml
    .replace(/<p><\/p>/gi, '') // Убираем пустые параграфы
    .replace(/<div><\/div>/gi, '') // Убираем пустые div'ы
    .replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '<br>') // Убираем двойные переносы
    .replace(/\n\s*\n/g, '\n') // Убираем лишние переносы строк
    .trim();
  
  return cleanHtml;
};

// Функции для работы с реакциями
export const updateNewsReaction = async (newsId: string, reactionName: string, isAdding: boolean): Promise<News | null> => {
  try {
    // Сначала получаем текущую новость
    const currentNews = await pb.collection('news').getOne<News>(newsId);
    
    // Получаем текущие счетчики реакций
    const currentCounts = currentNews.reaction_counts || {};
    
    // Обновляем счетчик для конкретной реакции
    const newCounts = { ...currentCounts };
    const currentCount = currentCounts[reactionName] || 0;
    
    if (isAdding) {
      // Добавляем реакцию - увеличиваем счетчик на 1
      newCounts[reactionName] = currentCount + 1;
    } else {
      // Убираем реакцию - уменьшаем счетчик на 1, но не ниже 0
      newCounts[reactionName] = Math.max(0, currentCount - 1);
    }
    
    // Обновляем новость в PocketBase
    const updatedNews = await pb.collection('news').update<News>(newsId, {
      reaction_counts: newCounts
    }, {
      expand: 'category,author,reactions,category.color_theme'
    });
    
    return updatedNews;
  } catch (error) {
    console.error('Ошибка при обновлении реакции:', error);
    return null;
  }
};

// Функция для получения реакций новости
export const getNewsReactions = async (newsId: string): Promise<{ [reactionName: string]: number }> => {
  try {
    const news = await pb.collection('news').getOne<News>(newsId);
    return news.reaction_counts || {};
  } catch (error) {
    console.error('Ошибка при получении реакций:', error);
    return {};
  }
};

// Функция для получения всех реакций (для настройки)
export const getNewsReactionTypes = async (): Promise<NewsReaction[]> => {
  try {
    const reactions = await pb.collection('news_reactions').getFullList<NewsReaction>({
      filter: 'is_active = true',
      sort: 'sort_order'
    });
    return reactions;
  } catch (error) {
    console.error('Ошибка при получении типов реакций:', error);
    return [];
  }
};

// Функции для работы с расписанием
export const formatTimeRange = (startTime: string, endTime: string): string => {
  return `${startTime} - ${endTime}`;
};

export const getDuration = (startTime: string, endTime: string): number => {
  const start = parseTime(startTime);
  const end = parseTime(endTime);
  return end - start; // в минутах
};

export const parseTime = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return mins > 0 ? `${hours}ч ${mins}м` : `${hours}ч`;
  }
  return `${mins}м`;
};

export const sortScheduleByTime = (schedule: Schedule[]): Schedule[] => {
  return [...schedule].sort((a, b) => {
    const timeA = parseTime(a.start_time);
    const timeB = parseTime(b.start_time);
    return timeA - timeB;
  });
};

// Утилитарные функции для работы с тренерами
export const getCoachesNames = (schedule: Schedule): string => {
  if (!schedule.expand?.coaches) {
    return 'Тренер не назначен';
  }
  
  // Проверяем, что coaches является массивом
  const coaches = Array.isArray(schedule.expand.coaches) 
    ? schedule.expand.coaches 
    : [schedule.expand.coaches];
  
  if (coaches.length === 0) {
    return 'Тренер не назначен';
  }
  
  return coaches.map(coach => coach.name).join(', ');
};

export const getCoachesCount = (schedule: Schedule): number => {
  if (!schedule.expand?.coaches) {
    return 0;
  }
  
  // Проверяем, что coaches является массивом
  const coaches = Array.isArray(schedule.expand.coaches) 
    ? schedule.expand.coaches 
    : [schedule.expand.coaches];
  
  return coaches.length;
};

export const hasMultipleCoaches = (schedule: Schedule): boolean => {
  return getCoachesCount(schedule) > 1;
};


// Функция для получения названия локации
export const getLocationName = (schedule: Schedule): string => {
  return schedule.expand?.location?.name || 'Неизвестная локация';
};

// Функция для получения адреса локации
export const getLocationAddress = (schedule: Schedule): string => {
  return schedule.expand?.location?.address || '';
};

// Утилитарные функции для работы с цветовыми схемами
export const getColorThemeBySlug = (colorThemes: ColorTheme[], slug: string): ColorTheme | null => {
  return colorThemes.find(theme => theme.slug === slug) || null;
};

export const formatColorTheme = (theme: ColorTheme): string => {
  const transparency = theme.transparency || 20; // По умолчанию 20% прозрачности
  const bgOpacity = (100 - transparency) / 100;
  
  // Используем inline стили для динамических цветов
  return `text-[${theme.color}] border-[${theme.border_color}]`;
};

export const getColorThemeStyles = (theme: ColorTheme): { className: string; style: React.CSSProperties } => {
  const transparency = theme.transparency || 20;
  const bgOpacity = (100 - transparency) / 100;
  
  return {
    className: `text-[${theme.color}] border-[${theme.border_color}]`,
    style: {
      backgroundColor: `${theme.bg_color}${Math.round(bgOpacity * 255).toString(16).padStart(2, '0')}`,
      borderColor: `${theme.border_color}${Math.round(bgOpacity * 255).toString(16).padStart(2, '0')}`
    }
  };
};

export const getDefaultLocationColor = (): string => {
  return "bg-gray-500/20 text-gray-300 border-gray-500/30";
};

export const getDefaultLevelColor = (level: string): string => {
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

// Функции для работы с уровнями подготовки
export const getLevelName = (schedule: Schedule): string => {
  return schedule.expand?.level?.name || 'Неизвестный уровень';
};

export const getLevelSlug = (schedule: Schedule): string => {
  return schedule.expand?.level?.slug || '';
};

export const getLevelDescription = (schedule: Schedule): string => {
  return schedule.expand?.level?.description || '';
};

export const getLevelColor = (schedule: Schedule): string => {
  // Сначала проверяем, есть ли цветовая схема в самом уровне
  if (schedule.expand?.level?.expand?.color_theme) {
    return formatColorTheme(schedule.expand.level.expand.color_theme);
  }
  
  // Затем пытаемся найти цветовую схему по slug уровня
  const levelSlug = getLevelSlug(schedule);
  if (levelSlug) {
    // Здесь нужно будет передать colorThemes из компонента
    // Пока используем дефолтные цвета
    return getDefaultLevelColor(levelSlug);
  }
  
  // Возвращаем дефолтный цвет
  return "bg-gray-500/20 text-gray-300 border-gray-500/30";
};

export const getLevelColorStyles = (schedule: Schedule): { className: string; style: React.CSSProperties } => {
  // Сначала проверяем, есть ли цветовая схема в самом уровне
  if (schedule.expand?.level?.expand?.color_theme) {
    return getColorThemeStyles(schedule.expand.level.expand.color_theme);
  }
  
  // Возвращаем дефолтные стили
  return {
    className: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    style: {}
  };
};

