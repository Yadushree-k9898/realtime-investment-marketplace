import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { setCurrentProposal, deleteProposal } from "@/redux/slices/proposalSlice";

const ProposalCard = ({ proposal }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // LOGGING
  console.log("User ID:", user?._id);
  console.log("Proposal Founder:", proposal?.founder);

  const founderId = typeof proposal?.founder === "string"
    ? proposal.founder
    : proposal?.founder?._id;

  const isFounder = user?._id && founderId === user._id;

  const handleEdit = () => {
    dispatch(setCurrentProposal(proposal));
    navigate("/proposals/edit");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this proposal?")) {
      dispatch(deleteProposal(proposal._id));
    }
  };

  const totalRaised = proposal?.investments?.reduce(
    (sum, inv) => sum + inv.amount,
    0
  ) || 0;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4">
      <h3 className="text-lg font-bold mb-2">{proposal.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{proposal.description}</p>
      <p className="text-sm font-medium">
        Funding Goal: ₹{proposal.expectedAmount}
      </p>
      <p className="text-sm">Raised: ₹{totalRaised}</p>
      <p className="text-sm text-gray-500">Status: {proposal.status || "Active"}</p>

      {isFounder ? (
        <div className="flex gap-2 mt-4">
          <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700 text-white">
            Edit
          </Button>
          <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
            Delete
          </Button>
        </div>
      ) : (
        <p className="text-xs text-gray-400 mt-2 italic">You are not the founder</p>
      )}
    </div>
  );
};

export default ProposalCard;
