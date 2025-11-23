import React from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";

export default function AppShell({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">

      {/* Navbar */}
      <Navbar />

      {/* Content Grid */}
      <div className="flex flex-1">

        {/* Sidebar */}
        <aside className="hidden md:block w-64 border-r border-gray-200 h-[calc(100vh-56px)] overflow-y-auto">
          <Sidebar />
        </aside>

        {/* Page Content */}
        <main className="flex-1 p-5">
          <div className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
