import React, { useEffect, useState } from 'react';
import API from '@/services/api';
import { useSelector } from 'react-redux';
import { Users, FileText } from 'lucide-react';

const PlatformStats = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalProposals: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/admin/stats', {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        // Check response format
        if (res.data?.totalUsers !== undefined && res.data?.totalProposals !== undefined) {
          setStats(res.data);
          setError(null);
        } else {
          console.warn('Unexpected response format:', res.data);
          setError('Unexpected data format from server.');
        }
      } catch (err) {
        console.error('Failed to fetch platform stats', err);
        setError('Failed to load platform stats.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin' && user?.token) {
      fetchStats();
    }
  }, [user]);

  if (loading) {
    return <p className="text-center py-4">Loading platform stats...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-4">{error}</p>;
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">📊 Platform Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Total Users */}
        <div className="flex items-center space-x-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 p-3 rounded-full">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Registered Users</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{stats.totalUsers}</p>
          </div>
        </div>

        {/* Total Proposals */}
        <div className="flex items-center space-x-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 p-3 rounded-full">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Proposals Submitted</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{stats.totalProposals}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformStats;

