// src/pages/Profile/EditProfile.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile, getUserProfile } from '@/services/authService';

const EditProfile = () => {
  const [formData, setFormData] = useState({ name: '', location: '', industry: '', bio: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      if (!token) return navigate('/login');
      try {
        const { user } = await getUserProfile(token);
        setFormData({
          name: user.name || '',
          location: user.location || '',
          industry: user.industry || '',
          bio: user.bio || '',
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem('user'))?.token;
    try {
      await updateUserProfile(formData, token);
      navigate('/dashboard/profile');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 space-y-4 bg-white dark:bg-gray-900 rounded-lg shadow">
      <h2 className="text-2xl font-bold">Edit Profile</h2>
      {['name', 'location', 'industry', 'bio'].map((field) => (
        <div key={field}>
          <label className="block mb-1 capitalize">{field}</label>
          <input
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border dark:bg-gray-800"
          />
        </div>
      ))}
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Save Changes
      </button>
    </form>
  );
};

export default EditProfile;
