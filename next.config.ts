import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const localProjectRoot = fileURLToPath(new URL("./", import.meta.url));

const sharedConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "*.supabase.co",
        protocol: "https",
      },
    ],
  },
} satisfies NextConfig;

const nextConfig: NextConfig =
  process.env.VERCEL === "1"
    ? sharedConfig
    : {
        ...sharedConfig,
        turbopack: {
          root: localProjectRoot,
        },
      };

export default nextConfig;
