// frontend/src/layouts/AppLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";

export default function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">

      {/* Top Navbar */}
      <Navbar />

      {/* Main layout */}
      <div className="flex flex-1">

        {/* Sidebar (desktop only) */}
        <aside className="hidden md:block w-64 border-r border-gray-200 h-[calc(100vh-56px)] overflow-y-auto">
          {/* Sidebar already contains links including Account, Usage, Credits */}
          <Sidebar />
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 sm:p-6">
            <Outlet />
          </div>
        </main>

      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
