import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default 1MB derruba upload de foto de celular antes da action rodar.
      // Editor/wall aceitam até 5MB no servidor — damos 6MB de folga aqui.
      bodySizeLimit: '6mb',
    },
  },
};

export default nextConfig;
