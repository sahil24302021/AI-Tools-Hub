// src/components/layout/AppLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./sidebar";
import Footer from "./Footer";

export default function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">

      {/* Top Navbar */}
      <Navbar />

      {/* Main dashboard layout */}
      <div className="flex flex-1">

        {/* Sidebar */}
        <aside className="hidden md:block w-64 border-r border-gray-200 h-[calc(100vh-56px)] overflow-y-auto">
          <Sidebar />
        </aside>

        {/* Content area */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 sm:p-6 min-h-[calc(100vh-120px)]">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
