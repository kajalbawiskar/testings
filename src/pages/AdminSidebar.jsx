// AdminSidebar.js
import React from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaChartBar } from "react-icons/fa"; // Using react-icons for icons

const AdminSidebar = () => {
  return (
    <div className="w-16 h-screen bg-gray-800 flex flex-col items-center py-4">
      {/* Link to AdminDashboard */}
      <Link to="/admin-dashboard" className="mb-4">
        <FaUsers className="text-white text-2xl hover:text-blue-400" />
      </Link>

      {/* Link to MarketDashboard */}
      <Link to="/marketing-dashboard" className="mt-4">
        <FaChartBar className="text-white text-2xl hover:text-blue-400" />
      </Link>
    </div>
  );
};

export default AdminSidebar;
