import Navbar from '@/Main/Navbar';
import Footer from '@/Main/Footer';

// Public pages. The Vite version faded <main> in with framer-motion, which
// hides server-rendered content until JavaScript loads; it is left out so the
// page is visible as soon as the HTML arrives.
export default function SiteLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* No overflow-y here: it would make <main> the scroll container for
          every page, which breaks position: sticky in their content. The
          document scrolls instead. */}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
