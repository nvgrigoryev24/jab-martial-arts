'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface PunchingBagSectionProps {
  onPromoCodeGenerated: (promoCode: string) => void;
}

export default function PunchingBagSection({ onPromoCodeGenerated }: PunchingBagSectionProps) {
  const [isPunched, setIsPunched] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [swingDirection, setSwingDirection] = useState<'left' | 'right' | null>(null);
  const [comicEffect, setComicEffect] = useState<{x: number, y: number} | null>(null);

  const generatePromoCode = () => {
    const codes = [
      'JAB10',
      'PUNCH15',
      'FIGHT20',
      'POWER10',
      'STRIKE15',
      'BOXER20'
    ];
    return codes[Math.floor(Math.random() * codes.length)];
  };

  const handlePunch = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPunched) return;

    // Определяем сторону удара
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const centerX = rect.width / 2;
    const isRightSide = clickX > centerX;
    
    // Позиция для комикс-эффекта
    const clickY = e.clientY - rect.top;
    setComicEffect({ x: clickX, y: clickY });
    
    setSwingDirection(isRightSide ? 'left' : 'right');
    setIsAnimating(true);
    setIsPunched(true);
    
    // Генерируем промокод
    const newPromoCode = generatePromoCode();
    setPromoCode(newPromoCode);
    
    // Показываем сообщение через небольшую задержку
    setTimeout(() => {
      setShowMessage(true);
      onPromoCodeGenerated(newPromoCode);
    }, 500);

    // Сбрасываем анимацию через 0.8 секунды
    setTimeout(() => {
      setIsAnimating(false);
      setSwingDirection(null);
    }, 800);

    // Убираем комикс-эффект через 1.5 секунды
    setTimeout(() => {
      setComicEffect(null);
    }, 1500);
  };

  const handleApplyPromoCode = () => {
    // Прокручиваем к форме контактов
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-8 overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Динамические элементы фона */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-red-500/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="hero-jab-title text-3xl md:text-4xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
              ПРОВЕРЬ СВОЮ СИЛУ
            </span>
          </h2>
          <p className="hero-jab-text text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Ударь по груше и получи скидку на абонемент! Каждый удар может принести тебе призы от JAB!
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* Боксерская груша */}
          <div className="relative flex-shrink-0">

            
            <div 
              className={`cursor-glove-large transition-all duration-300`}
              onClick={handlePunch}
            >
              <Image
                src="/sack.png"
                alt="Боксерская груша"
                width={400}
                height={600}
                className={`transition-transform duration-300 ${
                  isAnimating 
                    ? swingDirection === 'left' 
                      ? 'animate-swing-left' 
                      : 'animate-swing-right'
                    : 'hover:scale-105'
                }`}
                priority
              />
            </div>
            


            {/* Эффект удара */}
            {isAnimating && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-red-500/30 rounded-full animate-ping"></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-yellow-400/40 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-orange-400/50 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
              </div>
            )}

            {/* Комикс-эффект "JAB!!!" */}
            {comicEffect && (
              <div 
                className="absolute pointer-events-none z-20 animate-comic-pop"
                style={{
                  left: `${comicEffect.x}px`,
                  top: `${comicEffect.y}px`
                }}
              >
                <div className="relative">
                  {/* Многоугольная звезда */}
                  <div className="w-32 h-32 relative">
                    <svg 
                      width="128" 
                      height="128" 
                      viewBox="0 0 128 128" 
                      className="absolute inset-0 animate-pulse"
                    >
                      <polygon
                        points="64,8 78,46 118,46 86,72 100,110 64,84 28,110 42,72 10,46 50,46"
                        fill="#ff0000"
                        stroke="#ffffff"
                        strokeWidth="3"
                        className="drop-shadow-lg"
                      />
                    </svg>
                    
                    {/* Текст "JAB!!!" */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-black text-lg tracking-wider drop-shadow-lg">
                        JAB!!!
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CTA и сообщение */}
          <div className="text-center lg:text-left max-w-md flex-1">
            <div className="w-full">
            {!isPunched ? (
              <div className="space-y-4">
                <h3 className="hero-jab-title text-2xl md:text-3xl font-bold text-white">
                  Ударь по груше!
                </h3>
                <p className="hero-jab-text text-lg text-gray-300">
                  Нажми на грушу и получи скидку на абонемент в школу единоборств JAB
                </p>
                <div className="bg-gradient-to-r from-red-600/20 to-red-700/20 border border-red-500/30 rounded-xl p-4">
                  <p className="hero-jab-text text-red-300 font-semibold">
                    🥊 Каждый удар = скидка до 20%!
                  </p>
                </div>
                <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-xl p-3">
                  <p className="hero-jab-text text-yellow-300 font-bold">
                    ⚡ ОГРАНИЧЕННОЕ ПРЕДЛОЖЕНИЕ!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {showMessage && (
                  <div className="bg-gradient-to-r from-green-600/20 to-green-700/20 border border-green-500/50 rounded-xl p-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                    <div className="text-center">
                      <div className="text-4xl mb-4">🥊</div>
                      <h3 className="hero-jab-title text-xl font-bold text-green-300 mb-3">
                        Отличный удар!
                      </h3>
                      <p className="hero-jab-text text-green-200 mb-4">
                        Вот тебе скидка <span className="font-bold text-green-300">10%</span> на абонемент!
                      </p>
                      <div className="bg-black/40 border border-green-500/30 rounded-lg p-3 mb-4">
                        <p className="hero-jab-text text-green-300 font-mono text-lg">
                          Промокод: <span className="font-bold">{promoCode}</span>
                        </p>
                      </div>
                      <button
                        onClick={handleApplyPromoCode}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hero-jab-text cursor-glove shadow-lg hover:shadow-green-500/25 transform hover:scale-105"
                      >
                        Применить промокод
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Дополнительные элементы */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-4 bg-black/40 border border-red-500/30 rounded-xl px-4 py-2">
            <span className="text-red-400">🔥</span>
            <span className="hero-jab-text text-white text-sm">Только сегодня - двойные скидки!</span>
            <span className="text-red-400">🔥</span>
          </div>
        </div>
      </div>
    </section>
  );
}
