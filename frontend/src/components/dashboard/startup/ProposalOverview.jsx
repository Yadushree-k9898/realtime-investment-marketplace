import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProposals } from '@/redux/slices/proposalSlice';

const ProposalOverview = () => {
  const dispatch = useDispatch();
  const { proposals, loading } = useSelector((state) => state.proposals);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
      dispatch(fetchProposals());
    }
  }, [dispatch]);

  return (
    <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Your Proposals</h3>
      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-300">Loading...</p>
      ) : proposals?.length > 0 ? (
        <ul className="space-y-2">
          {proposals.map((p) => (
            <li key={p._id} className="p-2 border rounded bg-gray-100 dark:bg-gray-700 text-sm">
              <strong>{p.title}</strong> - Status: {p.status} - Raised: ${p.currentFunding}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-300">No proposals found.</p>
      )}
    </div>
  );
};

export default ProposalOverview;
