// src/routes/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import LogoutPage from '@/pages/Auth/LogoutPage';
import DashboardPage from '@/pages/Dashboard/DashboardPage';
import EditProposal from '@/pages/Proposals/EditProposal';
import CreateProposalPage from '@/pages/Proposals/CreateProposalPage'; // ✅ NEW
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/common/ProtectedRoute';


const AppRoutes = () => {
  return (
    <Routes>
      {/* 🔓 Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/logout" element={<LogoutPage />} />

      {/* 🔐 Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
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

      {/* 🔍 Fallback Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
