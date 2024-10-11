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
    ],
  },
};

export default nextConfig;
