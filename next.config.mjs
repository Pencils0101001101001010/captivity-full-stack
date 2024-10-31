/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // If you need to disable static optimization for certain paths
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "captivity.co.za",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  serverExternalPackages: ["@node-rs/argon2"],
  pageExtensions: ["tsx", "ts", "jsx", "js"],
};

export default nextConfig;
