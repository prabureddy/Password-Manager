/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: process.env.BASE_URL || "http://localhost:3000",
};

module.exports = nextConfig;
