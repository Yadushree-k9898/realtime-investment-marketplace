// components/dashboard/investor/NegotiationModal.jsx
import React from 'react';

const NegotiationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Negotiate Deal</h3>
        <textarea className="w-full p-2 border rounded mb-4" placeholder="Enter your terms..." />
        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded mr-2">Cancel</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
        </div>
      </div>
    </div>
  );
};

export default NegotiationModal;