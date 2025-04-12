// src/components/layout/MainLayout.jsx

import Header from "./Header";
import Sidebar from "./Sidebar"; // if you're using one
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar (optional) */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100 dark:bg-gray-800">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
