import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const localProjectRoot = fileURLToPath(new URL("./", import.meta.url));

const nextConfig: NextConfig =
  process.env.VERCEL === "1"
    ? {}
    : {
        turbopack: {
          root: localProjectRoot,
        },
      };

export default nextConfig;
