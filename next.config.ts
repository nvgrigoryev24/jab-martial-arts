import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8090',
        pathname: '/api/files/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8090',
        pathname: '/api/files/**',
      },
    ],
    qualities: [25, 50, 75, 90, 100],
  },
  // Оптимизация для production
  eslint: {
    ignoreDuringBuilds: false, // Включаем ESLint для production
  },
  typescript: {
    ignoreBuildErrors: false, // Включаем TypeScript проверки для production
  },
  // Исключаем папки из сборки
  exclude: ['backups/**/*', 'notes_and_docs/**/*'],
  // Настройки для ускорения разработки
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
};

export default nextConfig;
