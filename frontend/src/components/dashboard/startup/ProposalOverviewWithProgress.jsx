import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProposals } from '@/redux/slices/proposalSlice';

const ProposalOverviewWithProgress = () => {
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
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Your Proposals</h3>

      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-300">Loading...</p>
      ) : proposals.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-300">No proposals found.</p>
      ) : (
        <div className="space-y-4">
          {proposals.map((p) => {
            const progress = p.fundingGoal ? (p.currentFunding / p.fundingGoal) * 100 : 0;

            return (
              <div
                key={p._id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700 shadow-sm"
              >
                <h4 className="text-md font-semibold text-gray-800 dark:text-white">{p.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                  {p.description}
                </p>

                {/* Modern Progress Bar */}
                <div className="relative w-full h-4 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden mb-1">
                  <div
                    className="h-4 transition-all duration-700 ease-in-out rounded-full"
                    style={{
                      width: `${progress.toFixed(2)}%`,
                      background: `linear-gradient(to right, #10b981, #34d399)`, // Tailwind green gradient
                    }}
                  ></div>
                  <span className="absolute right-2 top-0 text-[10px] text-white font-semibold">
                    {progress.toFixed(1)}%
                  </span>
                </div>

                <p className="text-xs text-gray-700 dark:text-gray-300">
                  ${p.currentFunding.toLocaleString()} raised of ${p.fundingGoal.toLocaleString()} ({progress.toFixed(1)}%)
                </p>

                {/* Extra Details */}
                <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600 dark:text-gray-300">
                  <span className="bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded">#{p.industry || "N/A"}</span>
                  <span className="bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded">
                    {p.durationInMonths || 0} months
                  </span>
                  <span className="bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded">
                    Status: {p.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProposalOverviewWithProgress;
