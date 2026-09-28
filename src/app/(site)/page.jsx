import InternationalFoundationYear from '@/views/InternationalFoundationYear';

// The International Foundation Year page is the site's landing page.
export const metadata = {
  title: 'International Foundation Year',
  description:
    'The International Foundation Year, delivered in partnership with NCUK, prepares international students for first-year entry to leading universities worldwide.',
};

export default function HomePage() {
  return <InternationalFoundationYear />;
}
