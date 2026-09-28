import { Nunito_Sans, Plus_Jakarta_Sans } from 'next/font/google';
import Providers from './providers';
import '../index.css';

// Self-hosted at build time: no request to Google Fonts and no layout shift
// while the font loads.
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const nunito = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito-sans',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'Veritas Pathways',
    template: '%s | Veritas Pathways',
  },
  description:
    'Veritas Pathways prepares international students for undergraduate and postgraduate study at partner universities in the UK and worldwide.',
  // The site is kept out of search engines for now. The X-Robots-Tag header in
  // next.config.mjs and public/robots.txt say the same; change all three together.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${nunito.variable}`}>
      <body>
        {children}
        <Providers />
      </body>
    </html>
  );
}
