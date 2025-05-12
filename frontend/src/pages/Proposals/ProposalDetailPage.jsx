import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProposalById } from "@/redux/slices/proposalSlice"; // Assuming you have this action

const ProposalDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const proposal = useSelector((state) => state.proposals.currentProposal);
  const investors = proposal?.investors || []; // Get investors from the proposal object

  useEffect(() => {
    const fetchProposalDetail = async () => {
      try {
        await dispatch(fetchProposalById(id)); // Dispatch action to fetch proposal by ID
      } catch (error) {
        setError("Failed to load proposal details.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposalDetail();
  }, [id, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>{proposal?.title}</h1>
      <p>{proposal?.description}</p>

      <div>
        <h3>Funding Goal: ₹{proposal?.fundingGoal}</h3>
        <h3>Current Funding: ₹{proposal?.currentFunding || 0}</h3>
        <h3>Industry: {proposal?.industry}</h3>
        <h3>Equity Offered: {proposal?.equityOffered}%</h3>
        <h3>Status: {proposal?.status}</h3>
      </div>

      {/* Investor Details Section */}
      <div>
        <h3>Investors:</h3>
        {investors.length === 0 ? (
          <p>No investors yet.</p>
        ) : (
          <ul>
            {investors.map((investor) => (
              <li key={investor._id}>
                <p>{investor.name}</p>
                <p>Invested: ₹{investor.amount}</p>
                {/* Add more investor details if needed */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProposalDetailPage;
