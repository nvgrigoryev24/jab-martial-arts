'use client';

import { useState, useEffect } from 'react';
import Preloader from "@/components/Preloader";
import MainRenderer from "@/components/MainRenderer";

export default function ClientWrapper() {
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);

  const handlePreloaderComplete = () => {
    setIsPreloaderComplete(true);
    // Скроллим наверх после рендера компонентов
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  if (!isPreloaderComplete) {
    return <Preloader onComplete={handlePreloaderComplete} />;
  }

  return <MainRenderer />;
}







