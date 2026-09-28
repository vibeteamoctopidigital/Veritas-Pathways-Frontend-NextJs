import InternationalFoundationYear from '@/views/InternationalFoundationYear';

// Same page as "/", kept so existing links and shared URLs keep working.
export const metadata = {
  title: 'International Foundation Year',
  description:
    'The International Foundation Year, delivered in partnership with NCUK, prepares international students for first-year entry to leading universities worldwide.',
};

export default function InternationalFoundationYearPage() {
  return <InternationalFoundationYear />;
}
