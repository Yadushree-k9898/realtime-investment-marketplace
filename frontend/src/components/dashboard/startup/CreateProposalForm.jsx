import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProposal, clearProposalState } from "../../../redux/slices/proposalSlice";
import Loader from "../common/Loader";


const CreateProposalForm = () => {
  const [form, setForm] = useState({ title: "", description: "", fundingGoal: "" });
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.proposals);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createProposal(form));
    setTimeout(() => dispatch(clearProposalState()), 3000);
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Create Proposal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Title" onChange={handleChange} value={form.title} className="input" required />
        <textarea name="description" placeholder="Description" onChange={handleChange} value={form.description} className="textarea" required />
        <input type="number" name="fundingGoal" placeholder="Funding Goal" onChange={handleChange} value={form.fundingGoal} className="input" required />

        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? <Loader size="sm" /> : "Submit Proposal"}
        </button>
      </form>

      {successMessage && <p className="text-green-600 mt-2 text-center">{successMessage}</p>}
      {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
    </div>
  );
};

export default CreateProposalForm;
