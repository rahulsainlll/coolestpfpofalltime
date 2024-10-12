/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "pbs.twimg.com",
      },
      {
        hostname: "via.placeholder.com", // Add this line
      },
      {
        hostname: "img.clerk.com"
      }
    ],
  },
};

export default nextConfig;
