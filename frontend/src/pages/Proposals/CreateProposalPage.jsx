import React from "react";
import DashboardHeader from "@/components/dashboard/common/DashboardHeader";
import CreateProposalForm from "@/components/dashboard/startup/CreateProposalForm";

const CreateProposalPage = () => {
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <DashboardHeader title="Create New Proposal" />
      <CreateProposalForm />
    </div>
  );
};

export default CreateProposalPage;
