// src/routes/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import LogoutPage from '../pages/Auth/LogoutPage';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/common/ProtectedRoute';
import EditProposal from '../pages/Proposals/EditProposal'; // Correct relative path

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* ✅ Protected Edit Proposal Route */}
      <Route
        path="/dashboard/proposals/edit/:id"
        element={
          <ProtectedRoute>
            <EditProposal />
          </ProtectedRoute>
        }
      />

      <Route path="/logout" element={<LogoutPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
