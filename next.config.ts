import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["res.cloudinary.com"],
    // Optional: if you use multiple Cloudinary subdomains
    // domains: ['res.cloudinary.com', 'example.cloudinary.com'],
  },
};

export default nextConfig;
