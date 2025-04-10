import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { setCurrentProposal, deleteProposal } from "@/redux/slices/proposalSlice";

const ProposalCard = ({ proposal }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const founderId = proposal?.founder?._id || proposal?.founder;
  const userId = user?._id || user?.id;
  const isFounder = userId && founderId && userId === founderId;

  

  const handleEdit = () => {
    dispatch(setCurrentProposal(proposal));
    navigate(`/dashboard/proposals/edit/${proposal._id}`);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this proposal?")) {
      dispatch(deleteProposal(proposal._id));
    }
  };

  const handleInvest = () => {
    navigate(`/dashboard/proposals/invest/${proposal._id}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 space-y-2">
      <h3 className="text-lg font-bold">{proposal.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{proposal.description}</p>

      <div className="text-sm space-y-1">
        <p><strong>Funding Goal:</strong> ₹{proposal.fundingGoal}</p>
        <p>Current Funding: ₹{proposal.currentFunding || 0}</p>

        <p><strong>Status:</strong> {proposal.status || "Active"}</p>

        {proposal.returns && <p><strong>Returns:</strong> {proposal.returns}</p>}
        {proposal.industry && <p><strong>Industry:</strong> {proposal.industry}</p>}
        {proposal.equityOffered && <p><strong>Equity Offered:</strong> {proposal.equityOffered}%</p>}
        {proposal.valuation && <p><strong>Valuation:</strong> ₹{proposal.valuation} Cr</p>}
        {proposal.milestones?.length > 0 && (
          <p><strong>Milestones:</strong> {proposal.milestones.length}</p>
        )}
        {proposal.tags?.length > 0 && (
          <p><strong>Tags:</strong> {proposal.tags.join(", ")}</p>
        )}
        {proposal.location && <p><strong>Location:</strong> {proposal.location}</p>}
        {proposal.isPublic !== undefined && (
          <p><strong>Visibility:</strong> {proposal.isPublic ? "Public" : "Private"}</p>
        )}
        {proposal.pitchDeckUrl && (
          <p>
            <a
              href={proposal.pitchDeckUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              View Pitch Deck
            </a>
          </p>
        )}
      </div>

      <div className="flex gap-2 mt-4 flex-wrap">
        {isFounder || user?.role === "admin" ? (
          <>
            <Button
              onClick={handleEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </>
        ) : user?.role === "investor" ? (
          <Button
            onClick={handleInvest}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Invest
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export { setCurrentProposal };
export default ProposalCard;
