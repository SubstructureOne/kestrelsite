/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   appDir: true
  // },
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  // webpack(config) {
  //   config.experiments = {...config.experiments, topLevelAwait: true}
  //   return config
  // }
}

module.exports = nextConfig
