/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
      remotePatterns: [
         {
            protocol: "https",
            hostname: "cirkjfqyxgzormomgkca.supabase.co",
         },
         {
            protocol: "https",
            hostname: "img.clerk.com",
         },
      ],
   },
};

export default nextConfig;
