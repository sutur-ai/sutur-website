import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/sutur-website',
  images: { unoptimized: true },
  reactStrictMode: true,
};
export default nextConfig;
