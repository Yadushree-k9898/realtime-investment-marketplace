import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createProposal, updateProposal, deleteProposal } from "@/redux/slices/proposalSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";

const CreateProposalForm = ({ initialData = null, isEditMode = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fundingGoal: "",
  });

  useEffect(() => {
    if (initialData && isEditMode) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        fundingGoal: initialData.fundingGoal,
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

      navigate("/dashboard/proposals");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this proposal?")) return;
    try {
      await dispatch(deleteProposal(initialData._id)).unwrap();
      toast.success("Proposal deleted");
      navigate("/dashboard/proposals");
    } catch (error) {
      toast.error("Failed to delete proposal", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-2xl mx-auto bg-white dark:bg-neutral-900 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">{isEditMode ? "Edit Proposal" : "Create Proposal"}</h2>

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

      <div className="flex justify-between items-center mt-6">
        <Button type="submit" className="px-6">
          {isEditMode ? "Update Proposal" : "Create Proposal"}
        </Button>

        {isEditMode && (
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Delete Proposal
          </Button>
        )}
      </div>
    </form>
  );
};

export default CreateProposalForm;
