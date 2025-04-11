// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import adminService from "@/services/adminService";
// import { useSelector } from "react-redux";

// const UserDetail = () => {
//   const { userId } = useParams();
//   const { user } = useSelector((state) => state.auth);
//   const [userData, setUserData] = useState(null);
//   const [userProposals, setUserProposals] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [userRes, proposalsRes] = await Promise.all([
//           adminService.getUserById(userId, user.token),
//           adminService.getUserProposals(userId, user.token),
//         ]);

//         setUserData(userRes.data);
//         setUserProposals(proposalsRes.data);
//       } catch (error) {
//         console.error("Error fetching user detail:", error);
//       }
//     };

//     if (user?.token) fetchData();
//   }, [userId, user]);

//   if (!userData) return <div>Loading...</div>;

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-semibold mb-2">User Info</h2>
//       <div className="mb-4">
//         <p><strong>Name:</strong> {userData.name}</p>
//         <p><strong>Email:</strong> {userData.email}</p>
//         <p><strong>Role:</strong> {userData.role}</p>
//       </div>

//       <h3 className="text-lg font-semibold mb-2">Proposals Created</h3>
//       {userProposals.length === 0 ? (
//         <p>No proposals found.</p>
//       ) : (
//         <ul className="list-disc pl-6">
//           {userProposals.map((proposal) => (
//             <li key={proposal._id}>
//               {proposal.title} – ${proposal.fundingGoal.toLocaleString()}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default UserDetail;


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminService from "@/services/adminService";
import { useSelector } from "react-redux";

const UserDetail = () => {
  const { userId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState(null);
  const [userProposals, setUserProposals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, proposalsRes] = await Promise.all([
          adminService.getUserById(userId, user.token),
          adminService.getUserProposals(userId, user.token),
        ]);
        setUserData(userRes.data);
        setUserProposals(proposalsRes.data);
      } catch (error) {
        console.error("Error fetching user detail:", error);
      }
    };

    if (user?.token) fetchData();
  }, [userId, user]);

  if (!userData) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        👤 User Details
      </h2>

      {/* User Info Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
          Personal Information
        </h3>
        <div className="space-y-2 text-gray-600 dark:text-gray-300">
          <p><span className="font-medium">Name:</span> {userData.name}</p>
          <p><span className="font-medium">Email:</span> {userData.email}</p>
          <p><span className="font-medium">Role:</span> {userData.role}</p>
        </div>
      </div>

      <hr className="my-6 border-gray-300 dark:border-gray-700" />

      {/* Proposals Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
          📄 Proposals Created ({userProposals.length})
        </h3>

        {userProposals.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No proposals found.</p>
        ) : (
          <div className="space-y-2">
            {userProposals.map((proposal, index) => (
              <div
                key={proposal._id}
                className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md shadow-sm"
              >
                <p className="text-gray-800 dark:text-white font-medium">
                  {index + 1}. {proposal.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Funding Goal: ${proposal.fundingGoal.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
