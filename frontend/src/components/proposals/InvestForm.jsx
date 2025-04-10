import React, { useState } from "react";
import investmentService from "@/services/investmentService"; // ✅ use default import
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const InvestForm = ({ proposalId, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const { user } = useSelector((state) => state.auth);

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
      };

      await investmentService.investInProposal(proposalId, investmentData); // ✅ correct call
      toast.success("Investment successful!");
      setAmount("");
      setMessage("");
      if (onSuccess) onSuccess(); // callback to refresh parent data
    } catch (error) {
      console.error("Investment failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to invest. Try again later."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-lg shadow-md bg-white dark:bg-gray-900">
      <h3 className="text-lg font-semibold mb-2">Invest in this Proposal</h3>

      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Amount (USD)
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
