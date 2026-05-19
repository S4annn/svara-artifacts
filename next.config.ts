import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize Phaser.js bundling
  serverExternalPackages: ['phaser'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
