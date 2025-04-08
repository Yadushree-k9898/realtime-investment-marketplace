import CreateProposalForm from "../../components/dashboard/startup/CreateProposalForm";
import ProposalList from "../../components/proposals/ProposalList";

const FounderHome = () => {
  return (
    <div className="p-4 space-y-8">
      <CreateProposalForm />
      <hr className="my-6" />
      <h2 className="text-2xl font-semibold">Your Proposals</h2>
      <ProposalList />
    </div>
  );
};

export default FounderHome;
