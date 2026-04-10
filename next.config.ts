import type { NextConfig } from "next";
import path from "node:path";
const appRoot = __dirname;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  outputFileTracingRoot: appRoot,
  turbopack: {
    root: appRoot,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve = config.resolve ?? {};
      config.resolve.alias = {
        ...(config.resolve.alias ?? {}),
        "@procore/cdn-translations": path.resolve(appRoot, "src/shims/procore-cdn-translations.ts"),
      };
    }

    return config;
  },
  transpilePackages: [
    "@procore/core-react",
    "@procore/globalization-toolkit",
    "@procore/cdn-translations",
    "@procore/core-icons",
  ],
};

export default nextConfig;
