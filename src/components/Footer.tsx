'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PocketBase from 'pocketbase';
import {
  FooterContent,
  FooterLink,
  FooterContact
} from '@/lib/pocketbase';
import { useSocialLinks } from '@/contexts/SocialLinksContext';

export default function Footer() {
  const [footerContent, setFooterContent] = useState<FooterContent | null>(null);
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [footerContacts, setFooterContacts] = useState<FooterContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pbInstance, setPbInstance] = useState<PocketBase | null>(null);
  
  // Используем контекст для социальных ссылок
  const { socialLinks, isLoading: socialLinksLoading } = useSocialLinks();

  // Инициализация PocketBase
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');
    setPbInstance(pb);
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  // Загрузка данных из PocketBase
  useEffect(() => {
    if (!pbInstance) return;
    
    const abortController = new AbortController();
    
    // Создаем кастомный fetch с поддержкой AbortSignal
    const customFetch = (url: RequestInfo | URL, config?: RequestInit) => {
      return fetch(url, {
        ...config,
        signal: abortController.signal
      });
    };
    
    const loadFooterData = async () => {
      try {
        const [content, links, contacts] = await Promise.all([
          pbInstance.collection('footer_content').getFirstListItem<FooterContent>('is_active = true', {
            fetch: customFetch
          }),
          pbInstance.collection('footer_links').getFullList<FooterLink>({
            filter: 'is_active = true',
            sort: 'sort_order',
            fetch: customFetch
          }),
          pbInstance.collection('footer_contacts').getFullList<FooterContact>({
            filter: 'is_active = true',
            sort: 'sort_order',
            fetch: customFetch
          })
        ]);
        
        setFooterContent(content);
        setFooterLinks(links);
        setFooterContacts(contacts);
      } catch (error) {
        const err = error as Error;
        if (err.message?.includes('autocancelled') || err.message?.includes('cancelled') || err.name === 'AbortError') {
          console.log('Footer data request cancelled');
        } else {
          console.error('Error loading footer data:', err);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFooterData();
    
    return () => {
      abortController.abort();
    };
  }, [pbInstance]);
  return (
    <footer className="relative text-white py-16 border-t border-red-500/20 overflow-hidden">
      {/* Фоновый градиент */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
      
      {/* Декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Красные и синие акценты */}
        <div className="absolute top-8 left-8 w-20 h-20 bg-red-600/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '6s'}}></div>
        <div className="absolute bottom-8 right-8 w-16 h-16 bg-blue-500/08 rounded-full blur-xl animate-pulse" style={{animationDelay: '6.5s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-red-600/06 rounded-full blur-lg animate-pulse" style={{animationDelay: '3.2s'}}></div>
        
        {/* Белые линии движения */}
        <div className="absolute top-12 left-12 w-8 h-0.5 bg-white/08 transform rotate-45"></div>
        <div className="absolute bottom-12 right-12 w-6 h-0.5 bg-white/08 transform -rotate-45"></div>
        <div className="absolute top-1/3 right-1/4 w-4 h-0.5 bg-white/06 transform rotate-45"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Логотип и описание */}
          <div className="col-span-1 md:col-span-2">
            {isLoading || socialLinksLoading ? (
              // Заглушки во время загрузки
              <>
                <div className="h-8 w-16 bg-gray-700 rounded animate-pulse mb-4"></div>
                <div className="h-4 w-full bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-3/4 bg-gray-700 rounded animate-pulse mb-4"></div>
                <div className="flex space-x-4">
                  <div className="w-6 h-6 bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-6 h-6 bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-6 h-6 bg-gray-700 rounded animate-pulse"></div>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-red-500 mb-4">
                  {footerContent?.title || "JAB"}
                </h3>
                <p className="text-gray-300 mb-4">
                  {footerContent?.description || "Профессиональная школа единоборств. Развиваем силу, выносливость и характер."}
                </p>
                <div className="flex space-x-4">
                  {socialLinks.length > 0 ? (
                    socialLinks.map((social) => {
                      const hasIcon = social.icon && social.icon.trim() !== '';
                      const imageUrl = hasIcon && pbInstance ? pbInstance.files.getURL(social, social.icon) : '';
                      
                      return (
                        <a
                          key={social.id}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors cursor-glove"
                          title={social.title}
                        >
                          {hasIcon ? (
                            <Image
                              src={imageUrl}
                              alt={social.title}
                              width={24}
                              height={24}
                              className="w-6 h-6 object-contain filter brightness-0 invert hover:brightness-100 hover:invert-0 transition-all duration-300"
                            />
                          ) : (
                            <span className="text-xl">📱</span>
                          )}
                        </a>
                      );
                    })
                  ) : (
                    // Fallback социальные сети
                    <>
                      <a href="https://vk.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors cursor-glove">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M13.162 18.994c.609 0 .858-.406.858-.866v-3.504c0-.609-.406-.858-.858-.858h-1.162v4.228c0 .46.249.866.858.866h1.162zm-1.162-5.162h1.162c.609 0 .858-.406.858-.858V9.858c0-.609-.406-.858-.858-.858h-1.162v4.228zm-1.162 0v-4.228H9.676c-.609 0-.858.406-.858.858v3.504c0 .609.406.858.858.858h1.162zm-1.162-5.162h1.162c.609 0 .858-.406.858-.858V4.858c0-.609-.406-.858-.858-.858H9.676v4.228z"/>
                        </svg>
                      </a>
                      <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors cursor-glove">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                      </a>
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors cursor-glove">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                        </svg>
                      </a>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Быстрые ссылки */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Навигация</h4>
            {isLoading || socialLinksLoading ? (
              // Заглушки во время загрузки
              <ul className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <li key={i}>
                    <div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-2">
                {footerLinks.length > 0 ? (
                  footerLinks
                    .filter(link => link.section === 'navigation')
                    .map((link) => (
                      <li key={link.id}>
                        <Link href={link.href} className="text-gray-300 hover:text-white transition-colors cursor-glove">
                          {link.title}
                        </Link>
                      </li>
                    ))
                ) : (
                  // Fallback ссылки
                  <>
                    <li>
                      <Link href="#about" className="text-gray-300 hover:text-white transition-colors cursor-glove">
                        О школе
                      </Link>
                    </li>
                    <li>
                      <Link href="#coaches" className="text-gray-300 hover:text-white transition-colors cursor-glove">
                        Тренеры
                      </Link>
                    </li>
                    <li>
                      <Link href="#schedule" className="text-gray-300 hover:text-white transition-colors cursor-glove">
                        Расписание
                      </Link>
                    </li>
                    <li>
                      <Link href="#contact" className="text-gray-300 hover:text-white transition-colors cursor-glove">
                        Контакты
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            )}
          </div>

          {/* Контакты */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Контакты</h4>
            {isLoading || socialLinksLoading ? (
              // Заглушки во время загрузки
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 w-32 bg-gray-700 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 text-gray-300">
                {footerContacts.length > 0 ? (
                  footerContacts.map((contact) => (
                    <p key={contact.id}>
                      <span className="mr-2">{contact.icon}</span>
                      {contact.value}
                    </p>
                  ))
                ) : (
                  // Fallback контакты
                  <>
                    <p>📞 +7 (XXX) XXX-XX-XX</p>
                    <p>📧 info@jab-martial-arts.ru</p>
                    <p>📍 Адрес школы</p>
                    <p>🕒 Пн-Вс: 7:00 - 22:00</p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Правовая информация */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Правовая информация</h4>
            {isLoading || socialLinksLoading ? (
              // Заглушки во время загрузки
              <ul className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <li key={i}>
                    <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-2">
                {footerLinks.length > 0 ? (
                  footerLinks
                    .filter(link => link.section === 'legal')
                    .map((link) => (
                      <li key={link.id}>
                        <Link href={link.href} className="text-gray-300 hover:text-white transition-colors cursor-glove">
                          {link.title}
                        </Link>
                      </li>
                    ))
                ) : (
                  // Fallback правовые ссылки
                  <>
                    <li>
                      <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors cursor-glove">
                        Политика конфиденциальности
                      </Link>
                    </li>
                    <li>
                      <Link href="/terms" className="text-gray-300 hover:text-white transition-colors cursor-glove">
                        Условия использования
                      </Link>
                    </li>
                    <li>
                      <Link href="/cookies" className="text-gray-300 hover:text-white transition-colors cursor-glove">
                        Политика cookies
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
          <p>{footerContent?.copyright_text || "© 2024 JAB - Школа единоборств. Все права защищены."}</p>
        </div>
      </div>
    </footer>
  );
}
