import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProposals, clearProposalState } from "@/redux/slices/proposalSlice";
import ProposalCard from "./ProposalCard";

const ProposalList = () => {
  const dispatch = useDispatch();
  const { proposals, loading, error} = useSelector((state) => state.proposals);

  useEffect(() => {
    dispatch(fetchProposals());

    return () => {
      dispatch(clearProposalState());
    };
  }, [dispatch]);

  if (loading) return <p className="text-center">Loading proposals...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {proposals?.length > 0 ? (
        proposals.map((proposal) => (
          <ProposalCard key={proposal._id} proposal={proposal} />
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">No proposals found.</p>
      )}
    </div>
  );
};

export default ProposalList;
