/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // pdfjs-dist requires canvas to be aliased out in server environments
    config.resolve.alias.canvas = false;
    return config;
  },
};

module.exports = nextConfig;
