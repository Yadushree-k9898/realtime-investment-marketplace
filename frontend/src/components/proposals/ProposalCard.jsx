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

  const totalRaised = proposal?.investments?.reduce(
    (sum, inv) => sum + inv.amount,
    0
  ) || 0;

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
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4">
      <h3 className="text-lg font-bold mb-2">{proposal.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{proposal.description}</p>
      <p className="text-sm font-medium">Funding Goal: ₹{proposal.expectedAmount}</p>
      <p className="text-sm">Raised: ₹{totalRaised}</p>
      <p className="text-sm text-gray-500">Status: {proposal.status || "Active"}</p>

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
export {
  setCurrentProposal,
};


export default ProposalCard;
