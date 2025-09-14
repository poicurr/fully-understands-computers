/** @type {import('next').NextConfig} */
const repo = 'fully-understands-computers';
const nextConfig = {
  output: 'export',
  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
