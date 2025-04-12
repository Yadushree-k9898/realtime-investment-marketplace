import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserCircle2, Briefcase, MapPin, Mail, BadgeDollarSign } from 'lucide-react';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;

if (!token) {
  setError('User not authenticated');
  setLoading(false);
  return;
}

const res = await axios.get('/api/auth/me', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

        setUser(res.data.user);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p className="text-center py-6 text-gray-500">Loading profile...</p>;
  if (error) return <p className="text-center py-6 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow">
      <div className="flex items-center space-x-6 mb-6">
        <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-white text-4xl">
          <UserCircle2 size={48} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{user.name}</h2>
          <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium 
            ${user.role === 'admin' ? 'bg-red-200 text-red-800' :
              user.role === 'investor' ? 'bg-green-200 text-green-800' :
              'bg-blue-200 text-blue-800'}
          `}>
            {user.role}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-200">
        <div className="flex items-start space-x-3">
          <Mail className="mt-1" />
          <div>
            <p className="font-semibold">Email</p>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MapPin className="mt-1" />
          <div>
            <p className="font-semibold">Location</p>
            <p>{user.location || 'Not specified'}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Briefcase className="mt-1" />
          <div>
            <p className="font-semibold">Industry</p>
            <p>{user.industry || 'Not specified'}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <BadgeDollarSign className="mt-1" />
          <div>
            <p className="font-semibold">Account Created</p>
            <p>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="font-semibold mb-1">Bio</p>
        <p className="text-gray-600 dark:text-gray-300 italic">
          {user.bio || 'This user hasn’t added a bio yet.'}
        </p>
      </div>

      <div className="mt-8 flex justify-end">
        <Link
          to="/dashboard/profile/edit"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Edit Profile
        </Link>
      </div>
    </div>
  );
};

export default UserProfile;
