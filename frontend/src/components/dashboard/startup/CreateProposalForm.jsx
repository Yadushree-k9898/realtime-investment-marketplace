import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProposal } from '@/redux/slices/proposalSlice';
import { toast } from 'react-toastify';

const CreateProposalForm = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.proposals);
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fundingGoal: '',
    expectedReturn: '',
    durationInMonths: '',
    industry: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description, fundingGoal } = formData;

    if (!title || !description || !fundingGoal) {
      return toast.error("Please fill in all required fields");
    }

    if (!user?.token) {
      return toast.error("You must be logged in to create a proposal");
    }

    try {
      console.log("Submitting proposal:", formData);
      await dispatch(createProposal(formData)).unwrap();
      toast.success("Proposal created successfully");

      setFormData({
        title: '',
        description: '',
        fundingGoal: '',
        expectedReturn: '',
        durationInMonths: '',
        industry: '',
      });
    } catch (error) {
      console.error("Proposal creation failed:", error);
      toast.error(error || "Something went wrong");
    }
  };

  if (!user) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-800 rounded-xl shadow">
        You must be logged in to create a proposal.
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Create New Proposal
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          placeholder="Title *"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <textarea
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          placeholder="Description *"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          placeholder="Funding Goal (e.g. 100000) *"
          type="number"
          name="fundingGoal"
          value={formData.fundingGoal}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          placeholder="Expected Return (%)"
          type="number"
          name="expectedReturn"
          value={formData.expectedReturn}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          placeholder="Duration (in Months)"
          type="number"
          name="durationInMonths"
          value={formData.durationInMonths}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          placeholder="Industry"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Proposal"}
        </button>
      </form>
    </div>
  );
};

export default CreateProposalForm;
