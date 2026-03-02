import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // এটি ক্লাউডিনারির সব ইমেজ সাপোর্ট করবে
      },
    ],
  },
};

export default nextConfig;
