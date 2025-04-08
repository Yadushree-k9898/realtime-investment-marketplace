// components/dashboard/admin/UserTable.jsx
import React from 'react';

const UserTable = () => {
  const users = [
    { name: 'Alice', role: 'Founder' },
    { name: 'Bob', role: 'Investor' },
  ];
  return (
    <table className="w-full text-left border">
      <thead>
        <tr>
          <th className="border px-4 py-2">Name</th>
          <th className="border px-4 py-2">Role</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, idx) => (
          <tr key={idx}>
            <td className="border px-4 py-2">{user.name}</td>
            <td className="border px-4 py-2">{user.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
