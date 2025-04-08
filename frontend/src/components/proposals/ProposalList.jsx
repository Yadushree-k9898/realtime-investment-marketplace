import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProposals } from "../../redux/slices/proposalSlice";
import ProposalCard from "./ProposalCard";

const ProposalList = () => {
  const dispatch = useDispatch();
  const { proposals, loading, error } = useSelector((state) => state.proposals);

  useEffect(() => {
    dispatch(fetchProposals());
  }, [dispatch]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {proposals.map((proposal) => (
        <ProposalCard key={proposal._id} proposal={proposal} />
      ))}
    </div>
  );
};

export default ProposalList;
