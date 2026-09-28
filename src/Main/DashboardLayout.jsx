'use client';

import React, { useEffect, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, LayoutDashboard, GraduationCap, Building2, Globe, LogOut, User, Image as ImageIcon, MessageSquare, ShieldCheck } from 'lucide-react';
import { getUser, clearAuth, isAuthenticated } from '../utils/auth';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import logo from '../assets/Logo.png';

const menuItems = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/dashboard/courses', label: 'Courses', icon: GraduationCap },
  { path: '/dashboard/university', label: 'Universities', icon: Building2 },
  { path: '/dashboard/country', label: 'Countries', icon: Globe },
  { path: '/dashboard/media', label: 'Media Library', icon: ImageIcon },
  { path: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  { path: '/dashboard/admins', label: 'Admins', icon: ShieldCheck },
];

// False during the server render and hydration, true once in the browser.
const subscribeNoop = () => () => {};
const useIsClient = () => useSyncExternalStore(subscribeNoop, () => true, () => false);

const SidebarContent = ({ pathname, user, onNavigate, onLogout }) => (
  <div className="flex flex-col h-full">
    <div className="p-6">
      <Link href="/" className="inline-block hover:opacity-80 transition">
        <Image className="w-[150px] h-[42px] object-contain" src={logo} alt="Veritas Pathways" priority />
      </Link>
      <p className="text-xs text-[#22B2A8] mt-1">Admin Dashboard</p>
    </div>

    <nav className="flex-1 p-4 space-y-1">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive
                ? 'bg-[#22B2A8] text-white shadow-md'
                : 'text-[#22B2A8] hover:bg-gray-100'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>

    <div className="p-4 bg-gray-50">
      <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-white rounded-lg">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-[#22B2A8]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user?.name || 'Admin'}
          </p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <LogOut className="h-5 w-5" />
        <span className="font-medium">Log out</span>
      </button>
    </div>
  </div>
);

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // The session lives in a cookie and localStorage, which only exist in the
  // browser. Nothing renders until it has been checked, so a signed-out visitor
  // never sees the dashboard and the server and client HTML match.
  // src/proxy.js already redirects requests that arrive without the cookie.
  const isClient = useIsClient();
  const signedIn = isClient && isAuthenticated();

  useEffect(() => {
    if (isClient && !signedIn) router.replace('/login');
  }, [isClient, signedIn, router]);

  if (!signedIn) return null;
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const sidebar = (
    <SidebarContent
      pathname={pathname}
      user={user}
      onNavigate={() => setSidebarOpen(false)}
      onLogout={handleLogout}
    />
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white shadow-lg fixed h-screen">
        {sidebar}
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" open={sidebarOpen}>
          {sidebar}
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      {/* min-w-0 lets wide tables scroll inside their own box instead of
          stretching the page. */}
      <div className="flex-1 min-w-0 flex flex-col lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm px-4 lg:px-6 py-4 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">
                {menuItems.find(item => item.path === pathname)?.label || 'Dashboard'}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">Manage your content</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
