/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("encoding");
    config.externals.push("utf-8-validate");
    config.externals.push("bufferutil");
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
    ignoreBuildErrors: process.env.NEXT_PUBLIC_DISABLE_TYPECHECK === "true",
  },
};

module.exports = nextConfig;
