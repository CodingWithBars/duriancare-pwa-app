import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const CopyPlugin = require("copy-webpack-plugin");

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: "node_modules/@tensorflow/tfjs-tflite/wasm",
            to: "static/chunks", // This automatically resolves to .next/static/chunks/
          },
        ],
      })
    );
    return config;
  },
};

export default withPWA(nextConfig);