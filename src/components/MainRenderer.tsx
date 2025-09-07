'use client';

import { useState } from 'react';
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
import ScrollToTopButton from "@/components/ScrollToTopButton";

// Client Component - использует улучшенный TrainersSection с AbortController
export default function MainRenderer() {
  const [promoCode, setPromoCode] = useState<string>('');

  const handlePromoCodeGenerated = (code: string) => {
    setPromoCode(code);
  };

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
      <ContactSection promoCode={promoCode} />
      <ScrollToTopButton />
    </div>
  );
}
