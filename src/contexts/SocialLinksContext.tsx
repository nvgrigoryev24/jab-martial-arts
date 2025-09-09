'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSocialLinks, SocialLink } from '@/lib/pocketbase';

interface SocialLinksContextType {
  socialLinks: SocialLink[];
  isLoading: boolean;
  error: string | null;
}

const SocialLinksContext = createContext<SocialLinksContextType>({
  socialLinks: [],
  isLoading: true,
  error: null,
});

export const useSocialLinks = () => {
  const context = useContext(SocialLinksContext);
  if (!context) {
    throw new Error('useSocialLinks must be used within a SocialLinksProvider');
  }
  return context;
};

interface SocialLinksProviderProps {
  children: ReactNode;
}

export const SocialLinksProvider = ({ children }: SocialLinksProviderProps) => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSocialLinks = async () => {
      try {
        const data = await getSocialLinks();
        setSocialLinks(data);
        setError(null);
      } catch (err: any) {
        console.error('SocialLinksProvider: Error loading social links:', err);
        setError(err.message || 'Failed to load social links');
        setSocialLinks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSocialLinks();
  }, []);

  return (
    <SocialLinksContext.Provider value={{ socialLinks, isLoading, error }}>
      {children}
    </SocialLinksContext.Provider>
  );
};
