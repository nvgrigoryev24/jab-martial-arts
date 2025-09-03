import PocketBase from 'pocketbase';

// Создаем экземпляр PocketBase
export const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');

// Типы для наших коллекций
export interface Trainer {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  description: string;
  photo?: string;
  achievements: string[];
  created: string;
  updated: string;
}

export interface MartialArt {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
  price: number;
  duration: number; // в минутах
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  created: string;
  updated: string;
}

export interface Schedule {
  id: string;
  day: string;
  time: string;
  martial_art: string; // ID вида единоборств
  trainer: string; // ID тренера
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  max_participants: number;
  current_participants: number;
  created: string;
  updated: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  martial_art?: string;
  status: 'new' | 'contacted' | 'scheduled' | 'completed';
  created: string;
  updated: string;
}

// Функции для работы с данными
export const getTrainers = async (): Promise<Trainer[]> => {
  try {
    const records = await pb.collection('trainers').getFullList<Trainer>();
    return records;
  } catch (error) {
    console.error('Error fetching trainers:', error);
    return [];
  }
};

export const getMartialArts = async (): Promise<MartialArt[]> => {
  try {
    const records = await pb.collection('martial_arts').getFullList<MartialArt>();
    return records;
  } catch (error) {
    console.error('Error fetching martial arts:', error);
    return [];
  }
};

export const getSchedule = async (): Promise<Schedule[]> => {
  try {
    const records = await pb.collection('schedule').getFullList<Schedule>({
      expand: 'martial_art,trainer'
    });
    return records;
  } catch (error) {
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

// Функция для получения URL изображения
export const getImageUrl = (record: any, filename: string): string => {
  return pb.files.getUrl(record, filename);
};
