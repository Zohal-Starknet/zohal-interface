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
};

module.exports = nextConfig;
