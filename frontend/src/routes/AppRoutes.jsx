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


// import { Routes, Route } from "react-router-dom";
// import Login from "@/pages/Auth/Login";
// import Register from "@/pages/Auth/Register";
// import LogoutPage from "@/pages/Auth/LogoutPage";
// import DashboardPage from "@/pages/Dashboard/DashboardPage";
// import CreateProposalPage from "@/pages/Proposals/CreateProposalPage";
// import EditProposal from "@/pages/Proposals/EditProposal";
// import AllProposals from "@/pages/Proposals/AllProposals";
// import NotFound from "@/pages/NotFound";
// import ProtectedRoute from "@/components/common/ProtectedRoute";
// import InvestProposalPage from "@/pages/Proposals/InvestProposalPage";
// import UserDetail from "@/components/dashboard/admin/UserDetail"; 
// import InvestmentsPage from '@/pages/Admin/InvestmentsPage';

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

//       <Route
//         path="/dashboard/proposals/invest/:id"
//         element={
//           <ProtectedRoute>
//             <InvestProposalPage />
//           </ProtectedRoute>
//         }
//       />

//       {/* Admin User Detail Page */}
//       <Route
//         path="/admin/users/:userId"
//         element={
//           <ProtectedRoute>
//             <UserDetail />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//   path="/admin/investments"
//   element={
//     <ProtectedRoute>
//       <InvestmentsPage />
//     </ProtectedRoute>
//   }
// />

//       {/* 404 */}
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// };

// export default AppRoutes;



// import { Routes, Route } from "react-router-dom";
// import Login from "@/pages/Auth/Login";
// import Register from "@/pages/Auth/Register";
// import LogoutPage from "@/pages/Auth/LogoutPage";
// import DashboardPage from "@/pages/Dashboard/DashboardPage";
// import CreateProposalPage from "@/pages/Proposals/CreateProposalPage";
// import EditProposal from "@/pages/Proposals/EditProposal";
// import AllProposals from "@/pages/Proposals/AllProposals";
// import NotFound from "@/pages/NotFound";
// import ProtectedRoute from "@/components/common/ProtectedRoute";
// import InvestProposalPage from "@/pages/Proposals/InvestProposalPage";

// // Admin Pages
// import UserDetail from "@/components/dashboard/admin/UserDetail";
// import InvestmentsPage from "@/pages/Admin/InvestmentsPage";
// import AdminAnalytics from "@/pages/Admin/AdminAnalytics";
// import AdminProposals from "@/pages/Admin/AllProposalsPage";

// const AppRoutes = () => {
//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/logout" element={<LogoutPage />} />

//       {/* Protected User Routes */}
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

//       <Route
//         path="/dashboard/proposals/invest/:id"
//         element={
//           <ProtectedRoute>
//             <InvestProposalPage />
//           </ProtectedRoute>
//         }
//       />

//       {/* Admin Routes */}
//       <Route
//         path="/admin/users/:userId"
//         element={
//           <ProtectedRoute>
//             <UserDetail />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/admin/investments"
//         element={
//           <ProtectedRoute>
//             <InvestmentsPage />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/admin/analytics"
//         element={
//           <ProtectedRoute>
//             <AdminAnalytics />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/admin/proposals"
//         element={
//           <ProtectedRoute>
//             <AdminProposals />
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

// Admin Pages
import UserDetail from "@/components/dashboard/admin/UserDetail";
import InvestmentsPage from "@/pages/Admin/InvestmentsPage";
import AdminAnalytics from "@/pages/Admin/AdminAnalytics";
import AdminProposals from "@/pages/Admin/AllProposalsPage";

// Layout
import MainLayout from "@/components/layout/MainLayout";

// Profile Page
import ProfilePage from "@/pages/Profile/ProfilePage";
import EditProfile from "@/pages/Profile/EditProfile"; // ✅ Import EditProfile
 // ✅ Import profile page

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/logout" element={<LogoutPage />} />

      {/* Protected Routes with Layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="proposals" element={<AllProposals />} />
        <Route path="proposals/create" element={<CreateProposalPage />} />
        <Route path="proposals/edit/:id" element={<EditProposal />} />
        <Route path="proposals/invest/:id" element={<InvestProposalPage />} />
        <Route path="profile" element={<ProfilePage />} /> 
        <Route path="profile/edit" element={<EditProfile />} /> {/* ✅ Add Profile Route */}
      </Route>

      {/* Admin Routes with Layout */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="users/:userId" element={<UserDetail />} />
        <Route path="investments" element={<InvestmentsPage />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="proposals" element={<AdminProposals />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
