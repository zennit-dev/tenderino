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
    remotePatterns: [],
  },
  experimental: {
    useCache: true,
  },
};
