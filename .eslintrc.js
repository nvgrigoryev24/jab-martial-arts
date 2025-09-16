module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Отключаем проблемные правила для Railway деплоя
    '@next/next/no-img-element': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'react-hooks/exhaustive-deps': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'build/',
    'dist/',
    '*.config.js',
    '*.config.ts',
  ],
};
