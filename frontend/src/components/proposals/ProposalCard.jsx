// import React from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { setCurrentProposal, deleteProposal } from "@/redux/slices/proposalSlice";

// const ProposalCard = ({ proposal }) => {
//   const { user } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const founderId = proposal?.founder?._id || proposal?.founder;
//   const userId = user?._id || user?.id;
//   const isFounder = userId && founderId && userId === founderId;

//   const handleEdit = () => {
//     dispatch(setCurrentProposal(proposal));
//     navigate(`/dashboard/proposals/edit/${proposal._id}`);
//   };

//   const handleDelete = () => {
//     if (window.confirm("Are you sure you want to delete this proposal?")) {
//       dispatch(deleteProposal(proposal._id));
//     }
//   };

//   const handleInvest = () => {
//     navigate(`/dashboard/proposals/invest/${proposal._id}`);
//   };

//   return (
//     <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow hover:shadow-lg transition duration-200 p-5">
//       <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
//         {proposal.title}
//       </h3>

//       <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
//         {proposal.description}
//       </p>

//       {/* Tab-like Info Section */}
//       <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700 dark:text-gray-300">
//         <p><span className="font-medium">Funding Goal:</span> ₹{proposal.fundingGoal}</p>
//         <p><span className="font-medium">Current Funding:</span> ₹{proposal.currentFunding || 0}</p>
//         <p><span className="font-medium">Status:</span> {proposal.status || "Active"}</p>
//         {proposal.returns && <p><span className="font-medium">Returns:</span> {proposal.returns}</p>}
//         {proposal.industry && <p><span className="font-medium">Industry:</span> {proposal.industry}</p>}
//         {proposal.equityOffered && <p><span className="font-medium">Equity:</span> {proposal.equityOffered}%</p>}
//         {proposal.valuation && <p><span className="font-medium">Valuation:</span> ₹{proposal.valuation} Cr</p>}
//         {proposal.location && <p><span className="font-medium">Location:</span> {proposal.location}</p>}
//         {proposal.milestones?.length > 0 && (
//           <p><span className="font-medium">Milestones:</span> {proposal.milestones.length}</p>
//         )}
//         {proposal.tags?.length > 0 && (
//           <p className="col-span-2"><span className="font-medium">Tags:</span> {proposal.tags.join(", ")}</p>
//         )}
//         {proposal.isPublic !== undefined && (
//           <p><span className="font-medium">Visibility:</span> {proposal.isPublic ? "Public" : "Private"}</p>
//         )}
//         {proposal.pitchDeckUrl && (
//           <p className="col-span-2">
//             <a
//               href={proposal.pitchDeckUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-600 dark:text-blue-400 underline font-medium hover:text-blue-800 dark:hover:text-blue-300 transition"
//             >
//               View Pitch Deck
//             </a>
//           </p>
//         )}
//       </div>

//       {/* Action Buttons */}
//       <div className="mt-5 flex flex-wrap gap-3">
//         {isFounder || user?.role === "admin" ? (
//           <>
//             <Button
//               onClick={handleEdit}
//               className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2"
//             >
//               Edit
//             </Button>
//             <Button
//               onClick={handleDelete}
//               className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-2"
//             >
//               Delete
//             </Button>
//           </>
//         ) : user?.role === "investor" ? (
//           <Button
//             onClick={handleInvest}
//             className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-4 py-2"
//           >
//             Invest
//           </Button>
//         ) : null}
//       </div>
//     </div>
//   );
// };

// export { setCurrentProposal };
// export default ProposalCard;


// import React from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { setCurrentProposal, deleteProposal } from "@/redux/slices/proposalSlice";

// const ProposalCard = ({ proposal }) => {
//   const { user } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const founderId = proposal?.founder?._id || proposal?.founder;
//   const userId = user?._id || user?.id;
//   const isFounder = userId && founderId && userId === founderId;

//   const handleEdit = () => {
//     dispatch(setCurrentProposal(proposal));
//     navigate(`/dashboard/proposals/edit/${proposal._id}`);
//   };

//   const handleDelete = () => {
//     if (window.confirm("Are you sure you want to delete this proposal?")) {
//       dispatch(deleteProposal(proposal._id));
//     }
//   };

//   const handleInvest = () => {
//     navigate(`/dashboard/proposals/invest/${proposal._id}`);
//   };

//   return (
//     <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 p-6 space-y-4">
//       <div>
//         <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
//           {proposal.title}
//         </h3>
//         <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
//           {proposal.description}
//         </p>
//       </div>

//       {/* Info Section */}
//       <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700 dark:text-gray-300">
//         <p><span className="font-semibold">Goal:</span> ₹{proposal.fundingGoal}</p>
//         <p><span className="font-semibold">Raised:</span> ₹{proposal.currentFunding || 0}</p>
//         <p><span className="font-semibold">Status:</span> {proposal.status || "Active"}</p>
//         {proposal.returns && <p><span className="font-semibold">Returns:</span> {proposal.returns}</p>}
//         {proposal.industry && <p><span className="font-semibold">Industry:</span> {proposal.industry}</p>}
//         {proposal.equityOffered && <p><span className="font-semibold">Equity:</span> {proposal.equityOffered}%</p>}
//         {proposal.valuation && <p><span className="font-semibold">Valuation:</span> ₹{proposal.valuation} Cr</p>}
//         {proposal.location && <p><span className="font-semibold">Location:</span> {proposal.location}</p>}
//         {proposal.milestones?.length > 0 && (
//           <p><span className="font-semibold">Milestones:</span> {proposal.milestones.length}</p>
//         )}
//         {proposal.tags?.length > 0 && (
//           <p className="col-span-2"><span className="font-semibold">Tags:</span> {proposal.tags.join(", ")}</p>
//         )}
//         {proposal.isPublic !== undefined && (
//           <p><span className="font-semibold">Visibility:</span> {proposal.isPublic ? "Public" : "Private"}</p>
//         )}
//         {proposal.pitchDeckUrl && (
//           <p className="col-span-2">
//             <a
//               href={proposal.pitchDeckUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-600 dark:text-blue-400 underline font-medium hover:text-blue-800 dark:hover:text-blue-300 transition"
//             >
//               View Pitch Deck
//             </a>
//           </p>
//         )}
//       </div>

//       {/* Buttons */}
//       <div className="flex flex-wrap gap-3 pt-2">
//         {isFounder || user?.role === "admin" ? (
//           <>
//             <Button
//               onClick={handleEdit}
//               className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2"
//             >
//               Edit
//             </Button>
//             <Button
//               onClick={handleDelete}
//               className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-2"
//             >
//               Delete
//             </Button>
//           </>
//         ) : user?.role === "investor" ? (
//           <Button
//             onClick={handleInvest}
//             className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-4 py-2"
//           >
//             Invest
//           </Button>
//         ) : null}
//       </div>
//     </div>
//   );
// };

// export { setCurrentProposal };
// export default ProposalCard;


import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { setCurrentProposal, deleteProposal } from "@/redux/slices/proposalSlice";

const ProposalCard = ({ proposal }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const founderId = proposal?.founder?._id || proposal?.founder;
  const userId = user?._id || user?.id;
  const isFounder = userId && founderId && userId === founderId;

  const handleEdit = () => {
    dispatch(setCurrentProposal(proposal));
    navigate(`/dashboard/proposals/edit/${proposal._id}`);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this proposal?")) {
      dispatch(deleteProposal(proposal._id));
    }
  };

  const handleInvest = () => {
    navigate(`/dashboard/proposals/invest/${proposal._id}`);
  };

  // Redirect to 'Not Found' page if the proposal doesn't exist or there's an error
  const handleClickProposal = () => {
    if (!proposal._id) {
      navigate("/not-found");
    } else {
      navigate(`/dashboard/proposals/${proposal._id}`);
    }
  };

  return (
    <div
      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 p-6 space-y-4"
      onClick={handleClickProposal} // Add onClick to navigate to the proposal detail page
    >
      <div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
          {proposal.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {proposal.description}
        </p>
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700 dark:text-gray-300">
        <p><span className="font-semibold">Goal:</span> ₹{proposal.fundingGoal}</p>
        <p><span className="font-semibold">Raised:</span> ₹{proposal.currentFunding || 0}</p>
        <p><span className="font-semibold">Status:</span> {proposal.status || "Active"}</p>
        {proposal.returns && <p><span className="font-semibold">Returns:</span> {proposal.returns}</p>}
        {proposal.industry && <p><span className="font-semibold">Industry:</span> {proposal.industry}</p>}
        {proposal.equityOffered && <p><span className="font-semibold">Equity:</span> {proposal.equityOffered}%</p>}
        {proposal.valuation && <p><span className="font-semibold">Valuation:</span> ₹{proposal.valuation} Cr</p>}
        {proposal.location && <p><span className="font-semibold">Location:</span> {proposal.location}</p>}
        {proposal.milestones?.length > 0 && (
          <p><span className="font-semibold">Milestones:</span> {proposal.milestones.length}</p>
        )}
        {proposal.tags?.length > 0 && (
          <p className="col-span-2"><span className="font-semibold">Tags:</span> {proposal.tags.join(", ")}</p>
        )}
        {proposal.isPublic !== undefined && (
          <p><span className="font-semibold">Visibility:</span> {proposal.isPublic ? "Public" : "Private"}</p>
        )}
        {proposal.pitchDeckUrl && (
          <p className="col-span-2">
            <a
              href={proposal.pitchDeckUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline font-medium hover:text-blue-800 dark:hover:text-blue-300 transition"
            >
              View Pitch Deck
            </a>
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 pt-2">
        {isFounder || user?.role === "admin" ? (
          <>
            <Button
              onClick={handleEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2"
            >
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-2"
            >
              Delete
            </Button>
          </>
        ) : user?.role === "investor" ? (
          <Button
            onClick={handleInvest}
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-4 py-2"
          >
            Invest
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export { setCurrentProposal };
export default ProposalCard;
