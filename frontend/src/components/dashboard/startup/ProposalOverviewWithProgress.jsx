import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProposals, deleteProposal } from "@/redux/slices/proposalSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const ProposalOverviewWithProgress = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { proposals, loading, error } = useSelector((state) => state.proposals);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchProposals());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this proposal?")) {
      dispatch(deleteProposal(id));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {loading && <p>Loading proposals...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && proposals?.length === 0 && <p>No proposals found.</p>}

      {proposals?.map((proposal) => {
        const isOwner =
          proposal.founder?._id === user?._id || proposal.founder === user?._id;

        const totalRaised = proposal.investments?.reduce(
          (sum, inv) => sum + inv.amount,
          0
        ) || 0;

        const progress =
          (totalRaised / (proposal.expectedAmount || 1)) * 100;

        return (
          <Card key={proposal._id} className="p-4 shadow-md rounded-xl">
            <h3 className="text-xl font-semibold mb-2">{proposal.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {proposal.description}
            </p>
            <p className="text-sm mb-1">
              <strong>Category:</strong> {proposal.category}
            </p>
            <p className="text-sm mb-1">
              <strong>Expected Amount:</strong> ₹{proposal.expectedAmount}
            </p>
            <p className="text-sm mb-1">
              <strong>Raised:</strong> ₹{totalRaised}
            </p>

            <Progress value={progress} className="my-2" />
            <p className="text-xs text-muted-foreground mb-2">
              {progress.toFixed(2)}% funded
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              <Button
                size="sm"
                onClick={() => navigate(`/proposals/${proposal._id}`)}
              >
                View
              </Button>

              {isOwner && (
                <>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(`/proposals/edit/${proposal._id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(proposal._id)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ProposalOverviewWithProgress;
