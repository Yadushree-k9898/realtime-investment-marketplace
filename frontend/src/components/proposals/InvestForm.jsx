import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { investInProposal } from '@/redux/slices/investmentSlice';

const InvestForm = ({ proposalId }) => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;
    dispatch(investInProposal({ proposalId, amount: Number(amount) }));
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <label className="block">
        <span className="text-gray-700 dark:text-gray-200">Investment Amount (₹)</span>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </label>
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Confirm Investment
      </button>
    </form>
  );
};

export default InvestForm;
