import React from "react";
import { useNavigate } from "react-router-dom";

const ProposalTable = ({ proposals, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 rounded-xl">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium">Founder</th>
            <th className="px-6 py-3 text-left text-xs font-medium">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium">Goal</th>
            <th className="px-6 py-3 text-left text-xs font-medium">Funding</th>
            <th className="px-6 py-3 text-left text-xs font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {proposals.map((proposal) => (
            <tr key={proposal._id}>
              <td className="px-6 py-4 font-medium text-blue-600 cursor-pointer hover:underline" onClick={() => navigate(`/proposals/${proposal._id}`)}>
                {proposal.title}
              </td>
              <td className="px-6 py-4">{proposal.founder?.name || "Unknown"}</td>
              <td className="px-6 py-4">{proposal.status}</td>
              <td className="px-6 py-4">${proposal.fundingGoal}</td>
              <td className="px-6 py-4">${proposal.currentFunding}</td>
              <td className="px-6 py-4 space-x-2">
                <button onClick={() => navigate(`/proposals/edit/${proposal._id}`)} className="text-indigo-600 hover:underline">Edit</button>
                <button onClick={() => onDelete(proposal._id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProposalTable;
