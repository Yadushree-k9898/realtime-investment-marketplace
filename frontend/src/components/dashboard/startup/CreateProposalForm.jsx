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
    expectedAmount: "",
    status: "Under Review",
  });

  useEffect(() => {
    if (initialData && isEditMode) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        expectedAmount: initialData.expectedAmount || "",
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
    const { title, description, expectedAmount } = formData;
    if (!title || !description || !expectedAmount) {
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

      navigate("/dashboard"); // go back after success
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
        <label className="block mb-1 font-medium">Expected Amount (₹)</label>
        <input
          type="number"
          name="expectedAmount"
          className="w-full border rounded p-2 dark:bg-neutral-800"
          value={formData.expectedAmount}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Status</label>
        <select
          name="status"
          className="w-full border rounded p-2 dark:bg-neutral-800"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Under Review">Under Review</option>
          <option value="Negotiating">Negotiating</option>
          <option value="Funded">Funded</option>
        </select>
      </div>

      <Button type="submit" className="w-full">
        {isEditMode ? "Update Proposal" : "Create Proposal"}
      </Button>
    </form>
  );
};

export default CreateProposalForm;
