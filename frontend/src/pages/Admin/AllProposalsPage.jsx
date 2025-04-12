import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProposals, deleteProposalById } from "@/redux/slices/adminSlice";
import ProposalTable from "@/components/dashboard/admin/ProposalTable";

const AllProposalsPage = () => {
  const dispatch = useDispatch();
  const { allProposals, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllProposals());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this proposal?")) {
      dispatch(deleteProposalById(id));
    }
  };

  if (loading) return <p>Loading proposals...</p>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">All Proposals</h2>
      <ProposalTable proposals={allProposals} onDelete={handleDelete} />
    </div>
  );
};

export default AllProposalsPage;
