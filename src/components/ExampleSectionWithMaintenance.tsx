'use client';

import { useState, useEffect } from 'react';
import UnderMaintenance from './UnderMaintenance';
import { useUnderMaintenance } from '@/hooks/useUnderMaintenance';

// Пример секции с использованием UnderMaintenance
export default function ExampleSectionWithMaintenance() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    isUnderMaintenance,
    retryCount,
    canRetry,
    showMaintenance,
    hideMaintenance,
    retry
  } = useUnderMaintenance({ 
    sectionName: 'пример секции',
    maxRetries: 3,
    retryDelay: 2000
  });

  // Симуляция загрузки данных
  const loadData = async () => {
    setIsLoading(true);
    
    try {
      // Симулируем случайную ошибку (50% шанс)
      if (Math.random() > 0.5) {
        throw new Error('Данные недоступны');
      }
      
      // Симулируем загрузку
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        title: 'Пример данных',
        content: 'Данные успешно загружены!',
        timestamp: new Date().toISOString()
      };
      
      setData(mockData);
      hideMaintenance();
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      showMaintenance();
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка при монтировании
  useEffect(() => {
    loadData();
  }, []);

  // Обработка повторной попытки
  const handleRetry = () => {
    retry(loadData);
  };

  // Если данные загружаются впервые
  if (isLoading && !isUnderMaintenance) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-300">Загрузка данных...</p>
      </div>
    );
  }

  // Если данные недоступны
  if (isUnderMaintenance) {
    return (
      <UnderMaintenance 
        sectionName="пример секции"
        message={`Данные временно недоступны. Попытка ${retryCount + 1} из 3.`}
        showRetry={canRetry}
        onRetry={handleRetry}
      />
    );
  }

  // Если данные загружены успешно
  return (
    <div className="p-8 bg-gray-800/50 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-4">{data?.title}</h2>
      <p className="text-gray-300 mb-4">{data?.content}</p>
      <p className="text-sm text-gray-500">
        Загружено: {new Date(data?.timestamp).toLocaleString()}
      </p>
      
      {/* Кнопка для тестирования ошибки */}
      <button 
        onClick={() => {
          setData(null);
          showMaintenance();
        }}
        className="mt-4 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 transition-colors"
      >
        Симулировать ошибку
      </button>
    </div>
  );
}
