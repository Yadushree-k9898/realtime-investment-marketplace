import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createProposal, updateProposal } from "@/redux/slices/proposalSlice";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CreateProposalForm = ({ initialData = null, isEditMode = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fundingGoal: "",
    status: "Under Review",
  });

  useEffect(() => {
    if (initialData && isEditMode) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        fundingGoal: initialData.fundingGoal || "",
        status: initialData.status || "Under Review",
      });
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description, fundingGoal } = formData;
    if (!title || !description || !fundingGoal) {
      return toast.error("Please fill all fields");
    }

    try {
      if (isEditMode) {
        if (!initialData?._id) {
          return toast.error("Invalid Proposal ID");
        }

        await dispatch(updateProposal({ id: initialData._id, data: formData })).unwrap();
        toast.success("Proposal updated");
      } else {
        await dispatch(createProposal(formData)).unwrap();
        toast.success("Proposal created");
      }

      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-lg space-y-5 border border-neutral-200 dark:border-neutral-700"
      >
        <h2 className="text-2xl font-semibold text-center mb-2 dark:text-white">
          {isEditMode ? "Edit Proposal" : "Create New Proposal"}
        </h2>

        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Title</label>
          <input
            type="text"
            name="title"
            className="w-full border rounded-lg p-3 bg-neutral-50 dark:bg-neutral-800 dark:text-white dark:border-neutral-700"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Description</label>
          <textarea
            name="description"
            rows={4}
            className="w-full border rounded-lg p-3 bg-neutral-50 dark:bg-neutral-800 dark:text-white dark:border-neutral-700"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Funding Goal (₹)</label>
          <input
            type="number"
            name="fundingGoal"
            className="w-full border rounded-lg p-3 bg-neutral-50 dark:bg-neutral-800 dark:text-white dark:border-neutral-700"
            value={formData.fundingGoal}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Status</label>
          <select
            name="status"
            className="w-full border rounded-lg p-3 bg-neutral-50 dark:bg-neutral-800 dark:text-white dark:border-neutral-700"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Under Review">Under Review</option>
            <option value="Negotiating">Negotiating</option>
            <option value="Funded">Funded</option>
          </select>
        </div>

        <Button type="submit" className="w-full mt-4">
          {isEditMode ? "Update Proposal" : "Create Proposal"}
        </Button>
      </form>
    </div>
  );
};

export default CreateProposalForm;
