/** @type {import('next').NextConfig} */
const nextConfig = {
     env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
    exportPathMap: async function () {
    return {
      '/': { page: '/' },
    };
  },
};

export default nextConfig;
