import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    // pdfjs-dist requires canvas to be aliased out in server environments
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
