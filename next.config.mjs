/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      enabled: true,
    },
    serverComponentsExternalPackages: ["@node-rs/argon2"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "g4ffbh0dmxiksqrq.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
  pageExtensions: ["tsx", "ts", "jsx", "js"],
};

export default nextConfig;
