import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async rewrites() {
    return [
      {
        source: '/storage/:path*',
        destination: 'https://sgp.cloud.appwrite.io/v1/storage/buckets/images/files/:path*/view?project=6a8c438600024a08a21e',
      },
    ];
  },
};

export default nextConfig;
