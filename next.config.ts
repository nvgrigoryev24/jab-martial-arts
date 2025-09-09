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
  // Оптимизация для разработки
  eslint: {
    ignoreDuringBuilds: true, // Отключаем ESLint при сборке для ускорения
  },
  typescript: {
    ignoreBuildErrors: true, // Отключаем TypeScript ошибки при сборке
  },
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
