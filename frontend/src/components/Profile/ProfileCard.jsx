import React from "react";
import { Link } from "react-router-dom";
import { UserCircle2 } from "lucide-react";

const ProfileCard = ({ user }) => {
  if (!user) return null;

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-4 flex items-center space-x-4">
      <div className="w-14 h-14 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-white">
        <UserCircle2 size={32} />
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{user.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-300">{user.email}</p>
        <span
          className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium 
          ${user.role === "admin"
              ? "bg-red-100 text-red-700"
              : user.role === "investor"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
            }`}
        >
          {user.role}
        </span>
      </div>

      <Link
        to="/dashboard/profile"
        className="text-sm text-blue-600 hover:underline"
      >
        Edit
      </Link>
    </div>
  );
};

export default ProfileCard;
