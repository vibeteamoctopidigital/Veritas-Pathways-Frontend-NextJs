'use client';

import { Toaster } from 'react-hot-toast';

// Client-only pieces the root layout needs. The layout itself stays a server
// component so every page can render on the server.
export default function Providers() {
  return <Toaster position="top-right" />;
}
