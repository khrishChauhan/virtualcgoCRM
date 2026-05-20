import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tell Next.js NOT to bundle these server-only packages.
  // Prisma and bcryptjs use native Node.js modules that must run
  // in the Node.js runtime, not be bundled by webpack/turbopack.
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
};

export default nextConfig;
