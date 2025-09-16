'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SocialLinksProvider } from "@/contexts/SocialLinksContext";
import { useEffect } from 'react';
import HoverScrollGuard from '@/components/HoverScrollGuard';

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        // CSS-based scroll optimization - no pointer events manipulation
        document.body.style.willChange = 'transform';
        document.body.style.transform = 'translateZ(0)';
        
        ticking = true;
        
        requestAnimationFrame(() => {
          document.body.style.willChange = 'auto';
          document.body.style.transform = '';
          
          setTimeout(() => {
            ticking = false;
          }, 16);
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.willChange = '';
      document.body.style.transform = '';
    };
  }, []);

  return (
    <>
      <HoverScrollGuard />
      <SocialLinksProvider>
        <Header />
        <main>{children}</main>
        <Footer />
      </SocialLinksProvider>
    </>
  );
}
