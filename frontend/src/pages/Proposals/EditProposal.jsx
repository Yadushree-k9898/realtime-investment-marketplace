// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { updateProposal } from '@/redux/slices/proposalSlice';
// import { toast } from 'react-toastify';
// import { Loader } from 'lucide-react';

// const EditProposal = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { proposals} = useSelector((state) => state.proposals);

//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     fundingGoal: '',
//     industry: '',
//     expectedReturn: '',
//     durationInMonths: ''
//   });

//   const [isLoadingProposal, setIsLoadingProposal] = useState(true);

//   useEffect(() => {
//     const proposal = proposals.find((p) => p._id === id);
//     if (proposal) {
//       setFormData({
//         title: proposal.title || '',
//         description: proposal.description || '',
//         fundingGoal: proposal.fundingGoal || '',
//         industry: proposal.industry || '',
//         expectedReturn: proposal.expectedReturn || '',
//         durationInMonths: proposal.durationInMonths || ''
//       });
//       setIsLoadingProposal(false);
//     } else {
//       // Wait briefly to simulate fetch delay
//       const timer = setTimeout(() => setIsLoadingProposal(false), 300);
//       return () => clearTimeout(timer);
//     }
//   }, [id, proposals]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await dispatch(updateProposal({ id, data: formData })).unwrap();
//       toast.success('Proposal updated successfully');
//       navigate('/dashboard');
//     } catch (error) {
//       toast.error(error.message || 'Failed to update proposal');
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const numericFields = ['fundingGoal', 'expectedReturn', 'durationInMonths'];

//     setFormData((prev) => ({
//       ...prev,
//       [name]: numericFields.includes(name) ? Number(value) : value
//     }));
//   };

//   if (isLoadingProposal) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
//       </div>
//     );
//   }

//   if (!formData.title) {
//     return (
//       <div className="text-center mt-10 text-red-500 font-medium">
//         Proposal not found or unavailable.
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-6">Edit Proposal</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {[
//           { name: 'title', type: 'text', placeholder: 'Title' },
//           { name: 'description', type: 'textarea', placeholder: 'Description', rows: 4 },
//           { name: 'fundingGoal', type: 'number', placeholder: 'Funding Goal' },
//           { name: 'industry', type: 'text', placeholder: 'Industry' },
//           { name: 'expectedReturn', type: 'number', placeholder: 'Expected Return (%)' },
//           { name: 'durationInMonths', type: 'number', placeholder: 'Duration (months)' }
//         ].map((field) =>
//           field.type === 'textarea' ? (
//             <textarea
//               key={field.name}
//               name={field.name}
//               value={formData[field.name]}
//               onChange={handleChange}
//               placeholder={field.placeholder}
//               rows={field.rows}
//               className="w-full p-3 border rounded"
//               required
//             />
//           ) : (
//             <input
//               key={field.name}
//               type={field.type}
//               name={field.name}
//               value={formData[field.name]}
//               onChange={handleChange}
//               placeholder={field.placeholder}
//               className="w-full p-3 border rounded"
//               required
//             />
//           )
//         )}

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
//         >
//           Update Proposal
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditProposal;


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateProposal } from "@/redux/slices/proposalSlice";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";

const EditProposal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { proposals } = useSelector((state) => state.proposals);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fundingGoal: "",
    industry: "",
    expectedReturn: "",
    durationInMonths: "",
  });

  const [isLoadingProposal, setIsLoadingProposal] = useState(true);

  useEffect(() => {
    const proposal = proposals.find((p) => p._id === id);
    if (proposal) {
      setFormData({
        title: proposal.title || "",
        description: proposal.description || "",
        fundingGoal: proposal.fundingGoal || "",
        industry: proposal.industry || "",
        expectedReturn: proposal.expectedReturn || "",
        durationInMonths: proposal.durationInMonths || "",
      });
    }
    setIsLoadingProposal(false);
  }, [id, proposals]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ["fundingGoal", "expectedReturn", "durationInMonths"];

    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(updateProposal({ id, data: formData })).unwrap();
      toast.success("Proposal updated successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.message || "Failed to update proposal");
    }
  };

  if (isLoadingProposal) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!formData.title) {
    return (
      <div className="text-center mt-10 text-red-500 font-medium">
        Proposal not found or unavailable.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Edit Proposal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-3 border rounded dark:bg-neutral-800"
          required
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          rows={4}
          className="w-full p-3 border rounded dark:bg-neutral-800"
          required
        />

        <input
          type="number"
          name="fundingGoal"
          value={formData.fundingGoal}
          onChange={handleChange}
          placeholder="Funding Goal (₹)"
          className="w-full p-3 border rounded dark:bg-neutral-800"
          required
        />

        <input
          type="text"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          placeholder="Industry"
          className="w-full p-3 border rounded dark:bg-neutral-800"
        />

        <input
          type="number"
          name="expectedReturn"
          value={formData.expectedReturn}
          onChange={handleChange}
          placeholder="Expected Return (%)"
          className="w-full p-3 border rounded dark:bg-neutral-800"
        />

        <input
          type="number"
          name="durationInMonths"
          value={formData.durationInMonths}
          onChange={handleChange}
          placeholder="Duration (months)"
          className="w-full p-3 border rounded dark:bg-neutral-800"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
        >
          Update Proposal
        </button>
      </form>
    </div>
  );
};

export default EditProposal;
