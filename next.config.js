const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost",
      "*.supabase.co",
      "images.unsplash.com",
      "maps.googleapis.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

// Configuration pour GitHub Pages
const nextConfigWithPWA = {
  ...nextConfig,
  output: 'export',
  trailingSlash: true,
  images: {
    ...nextConfig.images,
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/mecamaster' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/mecamaster' : '',
};

module.exports = withPWA(nextConfigWithPWA);
