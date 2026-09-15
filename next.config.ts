import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return ["/admin/:path*", "/auth/:path*", "/cart/:path*", "/my-assets/:path*"].map(source => ({
      source, headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
    }));
  },
  async redirects() {
    return [
      { source: "/product/:id", destination: "/marketplace/:id", permanent: true },
      { source: "/featured", destination: "/pages/featured", permanent: true },
    ];
  },
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
