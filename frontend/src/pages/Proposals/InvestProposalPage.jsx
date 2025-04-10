import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProposalById } from '@/redux/slices/proposalSlice';
import InvestForm from '@/components/proposals/InvestForm';

const InvestProposalPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProposal, loading, error } = useSelector((state) => state.proposals);

  useEffect(() => {
    dispatch(fetchProposalById(id));
  }, [dispatch, id]);

  if (loading) return <p>Loading proposal...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!currentProposal) return <p>No proposal found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">{currentProposal.title}</h2>
      <p className="mb-2">{currentProposal.description}</p>
      <p className="mb-4 text-gray-600">Goal: ₹{currentProposal.expectedAmount}</p>
      <InvestForm proposalId={id} />
    </div>
  );
};

export default InvestProposalPage;
