import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SocialLinksProvider } from "@/contexts/SocialLinksContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JAB - Школа единоборств | Бокс, ММА, Кикбоксинг",
  description: "Профессиональная школа единоборств JAB. Обучение боксу, ММА, кикбоксингу. Опытные тренеры, современный зал, индивидуальный подход. Запишись на первую тренировку!",
  keywords: "единоборства, бокс, ММА, кикбоксинг, тренировки, школа, тренер",
  openGraph: {
    title: "JAB - Школа единоборств",
    description: "Профессиональная школа единоборств JAB. Обучение боксу, ММА, кикбоксингу.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SocialLinksProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </SocialLinksProvider>
      </body>
    </html>
  );
}
