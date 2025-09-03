'use client';

import { useState } from 'react';
import Preloader from "@/components/Preloader";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import CTABanner from "@/components/CTABanner";
import TrainersSection from "@/components/TrainersSection";
import PricingSection from "@/components/PricingSection";
import NewsSection from "@/components/NewsSection";
import PunchingBagSection from "@/components/PunchingBagSection";
import ScheduleSection from "@/components/ScheduleSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);
  const [generatedPromoCode, setGeneratedPromoCode] = useState('');

  const handlePreloaderComplete = () => {
    setIsPreloaderComplete(true);
    // Скроллим наверх после рендера компонентов
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  const handlePromoCodeGenerated = (promoCode: string) => {
    setGeneratedPromoCode(promoCode);
  };

  if (!isPreloaderComplete) {
    return <Preloader onComplete={handlePreloaderComplete} />;
  }

  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <CTABanner />
      <TrainersSection />
      <PricingSection />
      <NewsSection />
      <PunchingBagSection onPromoCodeGenerated={handlePromoCodeGenerated} />
      <ScheduleSection />
      <FAQSection />
      <ContactSection promoCode={generatedPromoCode} />
    </div>
  );
}
