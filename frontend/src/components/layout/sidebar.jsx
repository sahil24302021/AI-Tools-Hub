// frontend/src/components/layout/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  MessageSquare,
  Eye,
  FileText,
  FileQuestion,
  BookOpen,
  Sigma,
  NotebookPen,
  Code,
  Image as ImageIcon,
  ListCollapse,
  Languages,
  Mic,
  Volume2,
  Mail,
  Share2,
  PenSquare,
  BarChart,
  Settings,
  Clock,
  LayoutDashboard,
} from "lucide-react";

// ------------- TOOL LIST -------------
const tools = [
  { label: "AI Chat", to: "/chat", icon: MessageSquare },
  { label: "AI Vision", to: "/vision", icon: Eye },
  { label: "Resume Builder", to: "/resume", icon: FileText },
  { label: "Quiz Maker", to: "/quiz", icon: FileQuestion },
  { label: "Research", to: "/research", icon: BookOpen },
  { label: "Math Solver", to: "/math", icon: Sigma },
  { label: "PDF Tools", to: "/pdf", icon: FileText },
  { label: "Notes Maker", to: "/notes", icon: NotebookPen },
  { label: "Code Generator", to: "/code-generator", icon: Code },
  { label: "Image Generator", to: "/image-generator", icon: ImageIcon },
  { label: "Summarizer", to: "/summarizer", icon: ListCollapse },
  { label: "Translator", to: "/translator", icon: Languages },
  { label: "Voice → Text", to: "/voice-to-text", icon: Mic },
  { label: "Text → Voice", to: "/text-to-voice", icon: Volume2 },
  { label: "Email Writer", to: "/email-writer", icon: Mail },
  { label: "Social Writer", to: "/social-media-writer", icon: Share2 },
  { label: "Blog Writer", to: "/blog-writer", icon: PenSquare },
  { label: "SEO Optimizer", to: "/seo-optimizer", icon: BarChart },
];

// Single item UI
const Item = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all
      ${isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"}`
    }
  >
    <Icon className="h-4 w-4 opacity-70" />
    {label}
  </NavLink>
);

// -----------------------------------
export default function Sidebar() {
  return (
    <div className="p-4">

      {/* MENU */}
      <h2 className="text-xs font-semibold text-gray-500 mb-3 tracking-wide">
        MENU
      </h2>
      <div className="flex flex-col gap-1 mb-6">
        <Item to="/dashboard" label="Dashboard" icon={LayoutDashboard} />
        <Item to="/tools" label="All Tools" icon={LayoutDashboard} />
      </div>

      {/* TOOLS */}
      <h2 className="text-xs font-semibold text-gray-500 mb-3 tracking-wide">
        TOOLS
      </h2>
      <ul className="flex flex-col gap-1 mb-8">
        {tools.map((t) => (
          <li key={t.to}>
            <Item to={t.to} label={t.label} icon={t.icon} />
          </li>
        ))}
      </ul>

      {/* ACCOUNT */}
      <h2 className="text-xs font-semibold text-gray-500 mb-3 tracking-wide">
        ACCOUNT
      </h2>
      <div className="flex flex-col gap-1">
        <Item to="/account" label="Account Settings" icon={Settings} />
        <Item to="/usage" label="Usage History" icon={Clock} />
        {/* Credits removed permanently */}
      </div>
    </div>
  );
}
