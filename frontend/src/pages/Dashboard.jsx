// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import {
  MessageSquare, Eye, FileText, FileQuestion, BookOpen,
  Sigma, NotebookPen, Clock, ArrowRight
} from "lucide-react";

const tools = [
  { label: "AI Chat", to: "/chat", icon: MessageSquare },
  { label: "AI Vision", to: "/vision", icon: Eye },
  { label: "Resume Builder", to: "/resume", icon: FileText },
  { label: "Quiz Maker", to: "/quiz", icon: FileQuestion },
  { label: "Research", to: "/research", icon: BookOpen },
  { label: "Math Solver", to: "/math", icon: Sigma },
  { label: "PDF Tools", to: "/pdf", icon: FileText },
  { label: "Notes Maker", to: "/notes", icon: NotebookPen },
];

export default function Dashboard() {
  const { user } = useAuth();
  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.displayName ||
    user?.email?.split("@")[0];

  const [recent, setRecent] = useState([]);

  useEffect(() => {
    // Load the 5 most recent usage logs
    (async () => {
      try {
        const res = await api.get("/usage/");
        const { ok, result } = res.data || {};
        const data = ok && Array.isArray(result?.usage) ? result.usage : [];
        setRecent(data.slice(0, 5));
      } catch {
        setRecent([]);
      }
    })();
  }, []);

  return (
    <div className="space-y-10">

      {/* WELCOME HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {name} 👋</h1>
        <p className="text-gray-600 mt-1">
          Here’s your activity and tools to get started.
        </p>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link
          to="/tools"
          className="rounded-xl border p-4 bg-white shadow-sm hover:shadow transition"
        >
          <div className="font-medium text-black">Explore Tools</div>
          <p className="text-gray-600 text-sm mt-1">Browse all AI features</p>
        </Link>

        <Link
          to="/account"
          className="rounded-xl border p-4 bg-white shadow-sm hover:shadow transition"
        >
          <div className="font-medium text-black">Account Settings</div>
          <p className="text-gray-600 text-sm mt-1">Manage your profile</p>
        </Link>

        <Link
          to="/usage"
          className="rounded-xl border p-4 bg-white shadow-sm hover:shadow transition"
        >
          <div className="font-medium text-black">Usage History</div>
          <p className="text-gray-600 text-sm mt-1">Track your activity</p>
        </Link>
      </div>

      {/* TOOLS GRID */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Your Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="border rounded-lg p-4 bg-white hover:shadow-md transition flex items-center gap-3"
            >
              <div className="rounded-md bg-gray-100 p-2">
                <Icon className="h-5 w-5 text-black/70" />
              </div>
              <div>
                <div className="font-medium">{label}</div>
                <div className="text-sm text-gray-500">Open {label}</div>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-gray-400" />
            </Link>
          ))}
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>

        <div className="bg-white border rounded-xl p-4">
          {recent.length === 0 ? (
            <div className="text-gray-500 text-sm">No recent activity yet.</div>
          ) : (
            <ul className="divide-y">
              {recent.map((r, index) => (
                <li key={index} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-black">{r.tool}</div>
                    <div className="text-gray-600 text-sm mt-0.5 whitespace-nowrap">
                      {new Date(r.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <Clock className="h-4 w-4 text-gray-400" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

    </div>
  );
}
