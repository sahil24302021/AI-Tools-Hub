import React from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">

      {/* Navbar */}
      <Navbar />

      {/* Dashboard Body */}
      <div className="flex flex-1">

        {/* Sidebar */}
        <aside className="hidden md:block w-64 border-r border-gray-200 h-[calc(100vh-56px)] overflow-y-auto">
          <Sidebar />
        </aside>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

    </div>
  );
}
