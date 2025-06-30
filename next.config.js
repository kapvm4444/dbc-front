/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["placeholder.svg", "dbcapi.khush.pro"],
    unoptimized: true,
  },
  // Remove the proxy rewrites since we're using direct API calls
};

module.exports = nextConfig;
