import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProposals } from "@/redux/slices/proposalSlice";
import ProposalCard from "@/components/ProposalCard";

const ProposalsPage = () => {
  const dispatch = useDispatch();
  const { proposals } = useSelector((state) => state.proposals);

  useEffect(() => {
    dispatch(fetchProposals()); // Fetch all proposals
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {proposals.map((proposal) => (
        <ProposalCard key={proposal._id} proposal={proposal} />
      ))}
    </div>
  );
};

export default ProposalsPage;
