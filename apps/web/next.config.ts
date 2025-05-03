export default {
  transpilePackages: [
    "@zennui/web",
    "@zenncore/components",
    "@zenncore/utils",
    "@zenncore/types",
    "@zenncore/config",
    "@zenncore/hooks",
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
  experimental: {
    useCache: true,
  },
};
