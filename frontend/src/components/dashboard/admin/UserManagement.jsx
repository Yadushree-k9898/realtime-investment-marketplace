// ✅ Updated: components/dashboard/admin/UserManagement.jsx
import React from 'react';
import UserTable from './UserTable';

const UserManagement = () => (
  <div className="mt-4">
    <h3 className="text-lg font-semibold mb-2">User Management</h3>
    <UserTable />
  </div>
);

export default UserManagement;