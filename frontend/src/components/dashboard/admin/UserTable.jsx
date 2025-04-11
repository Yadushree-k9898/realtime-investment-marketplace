// import React, { useEffect, useState } from "react";
// import API from "@/services/api";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { Trash2, Loader2 } from "lucide-react"; // Icon package

// const UserTable = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [deletingId, setDeletingId] = useState(null);
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
//         setError(null);
//       } catch (err) {
//         console.error("Error fetching users:", err);
//         setError("Failed to fetch users.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user?.role === "admin") fetchUsers();
//   }, [user]);

//   const handleDelete = async (id) => {
//     const confirm = window.confirm("Are you sure you want to delete this user?");
//     if (!confirm) return;

//     try {
//       setDeletingId(id);
//       await API.delete(`/admin/users/${id}`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       setUsers((prev) => prev.filter((u) => u._id !== id));
//     } catch (err) {
//       console.error("Error deleting user:", err);
//       alert("Failed to delete user.");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   if (loading) return <p className="text-center py-4">Loading users...</p>;
//   if (error) return <p className="text-center text-red-500 py-4">{error}</p>;

//   return (
//     <div className="overflow-x-auto shadow-lg rounded-xl">
//       <h2 className="text-xl font-semibold p-4">All Users ({users.length})</h2>
//       <table className="min-w-full text-left border border-gray-300 dark:border-gray-700">
//         <thead className="bg-gray-100 dark:bg-gray-800">
//           <tr>
//             <th className="border px-4 py-2">Name</th>
//             <th className="border px-4 py-2">Email</th>
//             <th className="border px-4 py-2">Role</th>
//             <th className="border px-4 py-2 text-center">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="bg-white dark:bg-gray-900">
//           {users.map((userItem) => (
//             <tr key={userItem._id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
//               <td className="border px-4 py-2">
//                 <Link
//                   to={`/admin/users/${userItem._id}`}
//                   className="text-blue-600 hover:underline"
//                 >
//                   {userItem.name}
//                 </Link>
//               </td>
//               <td className="border px-4 py-2">{userItem.email}</td>
//               <td className="border px-4 py-2 capitalize">{userItem.role}</td>
//               <td className="border px-4 py-2 text-center">
//                 <button
//                   onClick={() => handleDelete(userItem._id)}
//                   disabled={deletingId === userItem._id}
//                   className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 disabled:opacity-50"
//                 >
//                   {deletingId === userItem._id ? (
//                     <>
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                       Deleting...
//                     </>
//                   ) : (
//                     <>
//                       <Trash2 className="w-4 h-4" />
//                       Delete
//                     </>
//                   )}
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default UserTable;


import React, { useEffect, useState } from "react";
import API from "@/services/api";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Trash2, Loader2 } from "lucide-react"; // Icon package

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
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

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    try {
      setDeletingId(id);
      await API.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p className="text-center py-4">Loading users...</p>;
  if (error) return <p className="text-center text-red-500 py-4">{error}</p>;

  // Filter out admin users before rendering
  const filteredUsers = users.filter((u) => u.role !== "admin");

  return (
    <div className="overflow-x-auto shadow-lg rounded-xl">
      <h2 className="text-xl font-semibold p-4">All Users ({filteredUsers.length})</h2>
      <table className="min-w-full text-left border border-gray-300 dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900">
          {filteredUsers.map((userItem) => (
            <tr key={userItem._id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
              <td className="border px-4 py-2">
                <Link
                  to={`/admin/users/${userItem._id}`}
                  className="text-blue-600 hover:underline"
                >
                  {userItem.name}
                </Link>
              </td>
              <td className="border px-4 py-2">{userItem.email}</td>
              <td className="border px-4 py-2 capitalize">{userItem.role}</td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => handleDelete(userItem._id)}
                  disabled={deletingId === userItem._id}
                  className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  {deletingId === userItem._id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
