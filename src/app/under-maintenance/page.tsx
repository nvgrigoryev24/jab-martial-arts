'use client';

import UnderMaintenance from '@/components/UnderMaintenance';
import { useState } from 'react';

export default function UnderMaintenancePage() {
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    console.log(`Попытка ${retryCount + 1} перезагрузки данных`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Демонстрация компонента &quot;На ремонте&quot;
          </h1>
          <p className="text-gray-300">
            Различные варианты использования компонента UnderMaintenance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Базовый вариант */}
          <div>
            <h3 className="text-white font-semibold mb-4">Базовый вариант</h3>
            <UnderMaintenance 
              sectionName="расписание"
            />
          </div>

          {/* С кастомным сообщением */}
          <div>
            <h3 className="text-white font-semibold mb-4">С кастомным сообщением</h3>
            <UnderMaintenance 
              sectionName="новости"
              message="Новости временно недоступны. Мы обновляем контент и скоро вернемся!"
            />
          </div>

          {/* С кнопкой повтора */}
          <div>
            <h3 className="text-white font-semibold mb-4">С кнопкой повтора</h3>
            <UnderMaintenance 
              sectionName="тренеры"
              message="Данные о тренерах загружаются..."
              onRetry={handleRetry}
            />
          </div>

          {/* Без кнопки повтора */}
          <div>
            <h3 className="text-white font-semibold mb-4">Без кнопки повтора</h3>
            <UnderMaintenance 
              sectionName="контакты"
              message="Контактная информация обновляется. Пожалуйста, подождите."
              showRetry={false}
            />
          </div>

          {/* Компактный вариант */}
          <div>
            <h3 className="text-white font-semibold mb-4">Компактный вариант</h3>
            <UnderMaintenance 
              sectionName="цены"
              className="p-4"
            />
          </div>

          {/* Полноразмерный вариант */}
          <div className="md:col-span-2 lg:col-span-3">
            <h3 className="text-white font-semibold mb-4">Полноразмерный вариант</h3>
            <UnderMaintenance 
              sectionName="главная страница"
              message="Весь контент временно недоступен. Мы проводим техническое обслуживание и скоро вернемся с обновлениями!"
              onRetry={handleRetry}
              className="p-12"
            />
          </div>
        </div>

        {/* Информация о попытках */}
        {retryCount > 0 && (
          <div className="mt-8 p-4 bg-gray-800/50 rounded-lg text-center">
            <p className="text-gray-300">
              Количество попыток перезагрузки: <span className="text-red-400 font-bold">{retryCount}</span>
            </p>
          </div>
        )}

        {/* Инструкции по использованию */}
        <div className="mt-12 p-6 bg-gray-800/30 rounded-lg">
          <h3 className="text-white font-semibold mb-4">Как использовать:</h3>
          <div className="text-gray-300 text-sm space-y-2">
            <p><strong>Базовое использование:</strong></p>
            <code className="block bg-gray-900 p-2 rounded text-red-400">
              {`<UnderMaintenance sectionName="расписание" />`}
            </code>
            
            <p className="mt-4"><strong>С кастомным сообщением:</strong></p>
            <code className="block bg-gray-900 p-2 rounded text-red-400">
              {`<UnderMaintenance 
  sectionName="новости"
  message="Кастомное сообщение"
/>`}
            </code>
            
            <p className="mt-4"><strong>С кнопкой повтора:</strong></p>
            <code className="block bg-gray-900 p-2 rounded text-red-400">
              {`<UnderMaintenance 
  sectionName="тренеры"
  onRetry={handleRetry}
/>`}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
