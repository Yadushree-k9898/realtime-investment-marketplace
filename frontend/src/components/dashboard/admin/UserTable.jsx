// import React, { useEffect, useState } from "react";
// import API from "@/services/api";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";

// const UserTable = () => {
//   const [users, setUsers] = useState([]);
//   const { user } = useSelector((state) => state.auth);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await API.get("/admin/users", {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         });
//         setUsers(res.data);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     if (user?.role === "admin") fetchUsers();
//   }, [user]);

//   return (
//     <table className="w-full text-left border">
//       <thead>
//         <tr>
//           <th className="border px-4 py-2">Name</th>
//           <th className="border px-4 py-2">Email</th>
//           <th className="border px-4 py-2">Role</th>
//         </tr>
//       </thead>
//       <tbody>
//         {users.map((user) => (
//           <tr key={user._id}>
//             <td className="border px-4 py-2">
//               <Link
//                 to={`/admin/users/${user._id}`}
//                 className="text-blue-600 hover:underline"
//               >
//                 {user.name}
//               </Link>
//             </td>
//             <td className="border px-4 py-2">{user.email}</td>
//             <td className="border px-4 py-2 capitalize">{user.role}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default UserTable;


import React, { useEffect, useState } from "react";
import API from "@/services/api";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/admin/users", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setUsers(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "admin") fetchUsers();
  }, [user]);

  if (loading) return <p className="text-center py-4">Loading users...</p>;
  if (error) return <p className="text-center text-red-500 py-4">{error}</p>;

  return (
    <div className="overflow-x-auto shadow-lg rounded-xl">
      <h2 className="text-xl font-semibold p-4">All Users ({users.length})</h2>
      <table className="min-w-full text-left border border-gray-300 dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900">
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
              <td className="border px-4 py-2">
                <Link
                  to={`/admin/users/${user._id}`}
                  className="text-blue-600 hover:underline"
                >
                  {user.name}
                </Link>
              </td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2 capitalize">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
