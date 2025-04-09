import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createProposal, updateProposal } from "@/redux/slices/proposalSlice";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";

const CreateProposalForm = ({ initialData = null, isEditMode = false, onClose }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fundingGoal: "",
  });

  useEffect(() => {
    if (initialData && isEditMode) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        fundingGoal: initialData.fundingGoal || "",
      });
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.fundingGoal) {
      return toast.error("Please fill all fields");
    }

    try {
      if (isEditMode) {
        await dispatch(updateProposal({ id: initialData._id, data: formData })).unwrap();
        toast.success("Proposal updated");
      } else {
        await dispatch(createProposal(formData)).unwrap();
        toast.success("Proposal created");
      }

      onClose?.(); // Close modal if available
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          type="text"
          name="title"
          className="w-full border rounded p-2 dark:bg-neutral-800"
          value={formData.title}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          name="description"
          className="w-full border rounded p-2 dark:bg-neutral-800"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Funding Goal ($)</label>
        <input
          type="number"
          name="fundingGoal"
          className="w-full border rounded p-2 dark:bg-neutral-800"
          value={formData.fundingGoal}
          onChange={handleChange}
        />
      </div>

      <Button type="submit" className="w-full">
        {isEditMode ? "Update Proposal" : "Create Proposal"}
      </Button>
    </form>
  );
};

export default CreateProposalForm;
