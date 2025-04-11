// import { Routes, Route } from "react-router-dom";
// import Login from "@/pages/Auth/Login";
// import Register from "@/pages/Auth/Register";
// import LogoutPage from "@/pages/Auth/LogoutPage";
// import DashboardPage from "@/pages/Dashboard/DashboardPage";
// import CreateProposalPage from "@/pages/Proposals/CreateProposalPage";
// import EditProposal from "@/pages/Proposals/EditProposal";
// import AllProposals from "@/pages/Proposals/AllProposals"; // ✅ this should contain ProposalList
// import NotFound from "@/pages/NotFound";
// import ProtectedRoute from "@/components/common/ProtectedRoute";
// import InvestProposalPage from "@/pages/Proposals/InvestProposalPage"; 

// const AppRoutes = () => {
//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/logout" element={<LogoutPage />} />

//       {/* Protected Routes */}
//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute>
//             <DashboardPage />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/dashboard/proposals"
//         element={
//           <ProtectedRoute>
//             <AllProposals />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/dashboard/proposals/create"
//         element={
//           <ProtectedRoute>
//             <CreateProposalPage />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/dashboard/proposals/edit/:id"
//         element={
//           <ProtectedRoute>
//             <EditProposal />
//           </ProtectedRoute>
//         }
//       />
//         <Route
//         path="/dashboard/proposals/invest/:id"
//         element={
//           <ProtectedRoute>
//             <InvestProposalPage />
//           </ProtectedRoute>
//         }
//       />

//       {/* 404 */}
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// };

// export default AppRoutes;


import { Routes, Route } from "react-router-dom";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import LogoutPage from "@/pages/Auth/LogoutPage";
import DashboardPage from "@/pages/Dashboard/DashboardPage";
import CreateProposalPage from "@/pages/Proposals/CreateProposalPage";
import EditProposal from "@/pages/Proposals/EditProposal";
import AllProposals from "@/pages/Proposals/AllProposals";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import InvestProposalPage from "@/pages/Proposals/InvestProposalPage";
import UserDetail from "@/components/dashboard/admin/UserDetail"; // ✅ NEW

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/logout" element={<LogoutPage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/proposals"
        element={
          <ProtectedRoute>
            <AllProposals />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/proposals/create"
        element={
          <ProtectedRoute>
            <CreateProposalPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/proposals/edit/:id"
        element={
          <ProtectedRoute>
            <EditProposal />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/proposals/invest/:id"
        element={
          <ProtectedRoute>
            <InvestProposalPage />
          </ProtectedRoute>
        }
      />

      {/* Admin User Detail Page */}
      <Route
        path="/admin/users/:userId"
        element={
          <ProtectedRoute>
            <UserDetail />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

