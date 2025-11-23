import React from "react";
import { Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">

        {/* Brand */}
        <Link to="/" className="text-lg font-semibold">
          AI Tools Hub
        </Link>

        {/* Right Menu */}
        <nav className="flex items-center gap-5 text-sm">

          {/* Always show */}
          <Link to="/pricing" className="hover:text-black/70">
            Pricing
          </Link>

          {user ? (
            <>
              {/* Logged-in menu */}
              <Link to="/dashboard" className="hover:text-black/70">
                Dashboard
              </Link>

              <Link to="/tools" className="hover:text-black/70">
                Tools
              </Link>

              <Link
                to="/profile"
                className="inline-flex items-center gap-1 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
              >
                <User size={16} />
                Profile
              </Link>

              <button
                onClick={logout}
                className="inline-flex items-center gap-1 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Logged-out menu */}
              <Link to="/login" className="hover:text-black/70">
                Login
              </Link>

              <Link
                to="/register"
                className="border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
