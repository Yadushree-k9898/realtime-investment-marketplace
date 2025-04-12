import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-900 shadow-md">
      {/* Logo / App Name */}
      <Link to="/dashboard" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
        Investment App
      </Link>

      {/* Nav Items */}
      <nav className="flex items-center gap-4">
        <Link
          to="/dashboard"
          className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:underline"
        >
          Dashboard
        </Link>
        <Link
          to="/dashboard/profile" // ✅ Updated path
          className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:underline"
        >
          My Profile
        </Link>

        {/* Logout */}
        {user && (
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-red-500 hover:underline ml-2"
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
