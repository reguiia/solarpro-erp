/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  i18n: {
    locales: ['en', 'fr', 'ar'],
    defaultLocale: 'en',
    localeDetection: true,
  },
};

module.exports = nextConfig;
