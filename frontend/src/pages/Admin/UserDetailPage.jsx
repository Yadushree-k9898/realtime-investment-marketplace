import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetail } from "@/redux/slices/adminSlice";
import ProposalCard from "@/components/proposals/ProposalCard";

const UserDetailPage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { selectedUser, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchUserDetail(userId));
  }, [dispatch, userId]);

  if (loading || !selectedUser) return <p>Loading user details...</p>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">User Detail</h2>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow space-y-2">
        <p><strong>Name:</strong> {selectedUser.name}</p>
        <p><strong>Email:</strong> {selectedUser.email}</p>
        <p><strong>Role:</strong> {selectedUser.role}</p>
        <p><strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
      </div>

      {selectedUser.proposals?.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mt-6">Proposals by {selectedUser.name}</h3>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {selectedUser.proposals.map((p) => (
              <ProposalCard key={p._id} proposal={p} />
            ))}
          </div>
        </div>
      )}

      {selectedUser.investments?.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mt-6">Investments</h3>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            {selectedUser.investments.map((inv) => (
              <li key={inv._id}>
                Invested ${inv.amount} in <strong>{inv.proposal?.title || "a proposal"}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserDetailPage;
