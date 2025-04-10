import React, { useEffect, useState } from "react";
import proposalService from "@/services/proposalService"; // ✅ Default import
import ProposalCard from "@/components/proposals/ProposalCard";
import { Input } from "@/components/ui/input";

const AllProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadProposals = async () => {
      try {
        const data = await proposalService.getProposals(); // ✅ Correct method
        setProposals(data);
        setFiltered(data);
      } catch (err) {
        setError("Failed to fetch proposals.", err);
      } finally {
        setLoading(false);
      }
    };

    loadProposals();
  }, []);

  useEffect(() => {
    const filteredList = proposals.filter((p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(filteredList);
  }, [searchTerm, proposals]);

  if (loading) return <p className="text-center mt-4">Loading proposals...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!filtered.length) return <p className="text-center mt-4">No proposals found.</p>;

  return (
    <div className="p-4">
      <div className="mb-4 max-w-md mx-auto">
        <Input
          placeholder="Search proposals by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((proposal) => (
          <ProposalCard key={proposal._id} proposal={proposal} />
        ))}
      </div>
    </div>
  );
};

export default AllProposals;
