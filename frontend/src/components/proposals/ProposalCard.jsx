const ProposalCard = ({ proposal }) => {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4">
        <h3 className="text-lg font-bold mb-2">{proposal.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{proposal.description}</p>
        <p className="text-sm font-medium">Funding Goal: ${proposal.fundingGoal}</p>
        <p className="text-sm">Current: ${proposal.currentFunding || 0}</p>
        <p className="text-sm text-gray-500">Status: {proposal.status}</p>
      </div>
    );
  };
  
  export default ProposalCard;
  