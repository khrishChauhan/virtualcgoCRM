/** @type {import('next').NextConfig} */
const nextConfig = {
  // ─── Server External Packages ─────────────────────────────────────────────
  // These packages use native Node.js modules (binary addons, crypto, etc.)
  // and must NOT be bundled by Turbopack/Webpack. They are kept as external
  // Node.js modules and required at runtime instead.
  serverExternalPackages: ['@prisma/client', 'prisma', 'bcryptjs'],

  // ─── Turbopack config ──────────────────────────────────────────────────────
  // Set the workspace root so Turbopack doesn't get confused in a monorepo.
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
