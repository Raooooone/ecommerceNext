/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Les deux étoiles signifient : "Accepter tous les sites web"
      },
    ],
  },
};

export default nextConfig;