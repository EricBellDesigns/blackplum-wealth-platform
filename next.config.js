/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  swcMinify: true,
  images: {
    domains: ["localhost", "investor-portal-uploads.s3.us-east-1.amazonaws.com"],
  },
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/offerings",
        permanent: true
      }
    ]
  }
};

module.exports = nextConfig;
