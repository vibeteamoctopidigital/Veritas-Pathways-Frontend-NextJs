import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // A package-lock.json further up (D:ODL Projects) otherwise makes Next
  // guess that folder as the workspace root.
  turbopack: {
    root: path.dirname(fileURLToPath(import.meta.url)),
  },

  // Keep the whole site out of search engines while it is being built. The
  // root layout's robots metadata and public/robots.txt say the same thing.
  // Remove all three together when the site should be indexed.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
};

export default nextConfig;
