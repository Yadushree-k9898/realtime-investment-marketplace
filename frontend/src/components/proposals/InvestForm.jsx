import React, { useState } from "react";
import investmentService from "@/services/investmentService";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { updateProposal } from "@/redux/slices/proposalSlice"; // Adjust the path as needed

const InvestForm = ({ proposalId, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [industry, setIndustry] = useState("");
  const [investmentType, setInvestmentType] = useState("");
  const [investmentStage, setInvestmentStage] = useState("");

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        toast.error("You must be logged in to invest.");
        return;
      }
  
      const investmentData = {
        amount: parseFloat(amount),
        message,
        industry,
        investmentType,
        investmentStage,
      };
  
      // Invest in proposal
      const response = await investmentService.investInProposal(proposalId, investmentData);
      
      // Check if the response contains updated proposal data
      if (response?.proposal) {
        // Dispatch action to update the proposal in Redux
        dispatch(updateProposal(response.proposal)); // Example action
      }
  
      toast.success("Investment successful!");
      setAmount("");
      setMessage("");
      setIndustry("");
      setInvestmentType("");
      setInvestmentStage("");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Investment failed:", error);
      toast.error(error.message || "Failed to invest. Try again later.");
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-lg shadow-md bg-white dark:bg-gray-900">
      <h3 className="text-lg font-semibold mb-2">Invest in this Proposal</h3>

      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Amount (₹)
        </label>
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
          required
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Industry (optional)
        </label>
        <input
          type="text"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Investment Type
        </label>
        <select
          value={investmentType}
          onChange={(e) => setInvestmentType(e.target.value)}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
          required
        >
          <option value="">Select Type</option>
          <option value="equity">Equity</option>
          <option value="debt">Debt</option>
          <option value="convertible">Convertible Note</option>
        </select>
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Investment Stage
        </label>
        <select
          value={investmentStage}
          onChange={(e) => setInvestmentStage(e.target.value)}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
          required
        >
          <option value="">Select Stage</option>
          <option value="seed">Seed</option>
          <option value="seriesA">Series A</option>
          <option value="seriesB">Series B</option>
          <option value="IPO">IPO</option>
        </select>
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Message (optional)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Invest
      </button>
    </form>
  );
};

export default InvestForm;
