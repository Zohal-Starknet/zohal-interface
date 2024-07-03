/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("encoding");
    return config;
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/trade",
        permanent: true,
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_DISABLE_TYPECHECK === 'true',
  },
};

module.exports = nextConfig;
