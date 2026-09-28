import DashboardLayout from '@/Main/DashboardLayout';

export const metadata = {
  title: { default: 'Dashboard', template: '%s | Veritas Pathways Admin' },
};

export default function Layout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
