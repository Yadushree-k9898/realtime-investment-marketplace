// src/routes/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import LogoutPage from '../pages/Auth/LogoutPage';  // Import the LogoutPage
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/common/ProtectedRoute';

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
      <Route path="/logout" element={<LogoutPage />} />  {/* Logout route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
