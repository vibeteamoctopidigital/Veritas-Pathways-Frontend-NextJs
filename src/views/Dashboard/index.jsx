'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUser } from '../../utils/auth';
import { baseAPI } from '../../config/api';

// Each count reads only the pagination total, so the requests stay tiny.
const loadCounts = async () => {
  const [courses, universities, contacts] = await Promise.all([
    baseAPI.course.getAllCourse({ limit: 1 }).catch(() => null),
    baseAPI.course.getUniversities({ limit: 1 }).catch(() => null),
    baseAPI.contact.getAll({ limit: 1 }).catch(() => null),
  ]);
  return {
    courses: courses?.data?.pagination?.total ?? null,
    universities: universities?.data?.pagination?.total ?? null,
    contacts: contacts?.data?.pagination?.total ?? null,
    unread: contacts?.data?.pagination?.unread ?? null,
  };
};

const StatCard = ({ title, value, color, href, note }) => (
  <Link href={href} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className={`text-3xl font-bold ${color}`}>{value ?? '…'}</p>
    {note && <p className="mt-1 text-sm text-gray-500">{note}</p>}
  </Link>
);

const Dashboard = () => {
  const user = getUser();
  const [counts, setCounts] = useState({});

  useEffect(() => {
    let cancelled = false;
    loadCounts().then((result) => {
      if (!cancelled) setCounts(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome to your dashboard, {user?.name || user?.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Courses" value={counts.courses?.toLocaleString()} color="text-blue-600" href="/dashboard/courses" />
        <StatCard title="Total Universities" value={counts.universities?.toLocaleString()} color="text-green-600" href="/dashboard/university" />
        <StatCard
          title="Total Contacts"
          value={counts.contacts?.toLocaleString()}
          color="text-purple-600"
          href="/dashboard/messages"
          note={counts.unread ? `${counts.unread} unread` : null}
        />
      </div>
    </div>
  );
};

export default Dashboard;
