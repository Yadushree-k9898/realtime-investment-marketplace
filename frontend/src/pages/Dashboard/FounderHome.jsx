// import CreateProposalForm from "../../components/dashboard/startup/CreateProposalForm";
// import ProposalList from "../../components/proposals/ProposalList";

// const FounderHome = () => {
//   return (
//     <div className="p-4 space-y-8">
//       <CreateProposalForm />
//       <hr className="my-6" />
//       <h2 className="text-2xl font-semibold">Your Proposals</h2>
//       <ProposalList />
//     </div>
//   );
// };

// export default FounderHome;


import React, { useState } from "react";
import CreateProposalForm from "../../components/dashboard/startup/CreateProposalForm";
import ProposalList from "../../components/proposals/ProposalList";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

const FounderHome = () => {
  const [tab, setTab] = useState("create");

  return (
    <div className="p-4 space-y-4">
      <Tabs defaultValue="create" value={tab} onValueChange={setTab}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="create" className="flex-1">
            Create Proposal
          </TabsTrigger>
          <TabsTrigger value="list" className="flex-1">
            Your Proposals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <CreateProposalForm />
        </TabsContent>

        <TabsContent value="list">
          <h2 className="text-2xl font-semibold mb-4">Your Proposals</h2>
          <ProposalList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FounderHome;
