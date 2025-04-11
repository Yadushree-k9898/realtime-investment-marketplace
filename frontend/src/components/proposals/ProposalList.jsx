import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProposals, clearProposalState } from "@/redux/slices/proposalSlice";
import ProposalCard from "./ProposalCard";

const ProposalList = () => {
  const dispatch = useDispatch();
  const { proposals, loading, error } = useSelector((state) => state.proposals);

  useEffect(() => {
    dispatch(fetchProposals());

    return () => {
      dispatch(clearProposalState());
    };
  }, [dispatch]);

  if (loading)
    return (
      <div className="flex justify-center py-10">
        <p className="text-gray-600 dark:text-gray-400 text-lg">Loading proposals...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center py-10">
        <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {proposals?.length > 0 ? (
          proposals.map((proposal) => (
            <ProposalCard key={proposal._id} proposal={proposal} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10 text-lg">
            No proposals found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProposalList;
