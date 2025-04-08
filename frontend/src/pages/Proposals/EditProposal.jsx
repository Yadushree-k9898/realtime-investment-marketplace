import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateProposal } from '@/redux/slices/proposalSlice';
import { toast } from 'react-toastify';

const EditProposal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { proposals } = useSelector((state) => state.proposals);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fundingGoal: '',
    industry: '',
    expectedReturn: '',
    durationInMonths: ''
  });

  useEffect(() => {
    const proposal = proposals.find((p) => p._id === id);
    if (proposal) {
      setFormData({
        title: proposal.title || '',
        description: proposal.description || '',
        fundingGoal: proposal.fundingGoal || '',
        industry: proposal.industry || '',
        expectedReturn: proposal.expectedReturn || '',
        durationInMonths: proposal.durationInMonths || ''
      });
    }
  }, [id, proposals]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProposal({ id, data: formData })).unwrap(); // ✅ fixed structure
      toast.success('Proposal updated successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to update proposal');
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Proposal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
          rows="4"
        />
        <input
          type="number"
          name="fundingGoal"
          value={formData.fundingGoal}
          onChange={handleChange}
          placeholder="Funding Goal"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          placeholder="Industry"
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="expectedReturn"
          value={formData.expectedReturn}
          onChange={handleChange}
          placeholder="Expected Return (%)"
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="durationInMonths"
          value={formData.durationInMonths}
          onChange={handleChange}
          placeholder="Duration (months)"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Update Proposal
        </button>
      </form>
    </div>
  );
};

export default EditProposal;
