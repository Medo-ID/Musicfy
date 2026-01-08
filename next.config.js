/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dhhkbliiujumuouxayxi.supabase.co",
        port: "",
        pathname: "/",
        search: "",
      },
    ],
  },
};

module.exports = nextConfig;
