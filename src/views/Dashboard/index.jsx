'use client';

import { getUser } from '../../utils/auth';

const Dashboard = () => {
  const user = getUser();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome to your dashboard, {user?.name || user?.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Courses</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>

        <div
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total University</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>

        <div
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Contacts</h3>
          <p className="text-3xl font-bold text-purple-600">0</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;