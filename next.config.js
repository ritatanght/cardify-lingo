/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "6ndlkx7fzdluif8n.public.blob.vercel-storage.com",
      },
    ],
  },
};

module.exports = nextConfig;
