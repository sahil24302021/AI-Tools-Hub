// frontend/src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  Eye,
  FileText,
  FileQuestion,
  BookOpen,
  Sigma,
  NotebookPen
} from "lucide-react";

export default function HomePage() {
  const toolDefs = [
    { label: "AI Chat", to: "/chat", icon: MessageSquare, sub: "Conversational AI assistant" },
    { label: "AI Vision", to: "/vision", icon: Eye, sub: "Describe and analyze images" },
    { label: "Resume Builder", to: "/resume", icon: FileText, sub: "Generate a polished resume" },
    { label: "Quiz Maker", to: "/quiz", icon: FileQuestion, sub: "Create tests from any topic" },
    { label: "Research", to: "/research", icon: BookOpen, sub: "Draft structured papers" },
    { label: "Math Solver", to: "/math", icon: Sigma, sub: "Step-by-step math solutions" },
    { label: "PDF Tools", to: "/pdf", icon: FileText, sub: "Summaries & conversions" },
    { label: "Notes Maker", to: "/notes", icon: NotebookPen, sub: "Study plans and notes" },
  ];

  return (
    <div className="bg-white text-black">
      
      {/* HERO SECTION */}
      <section className="mx-auto max-w-5xl px-4 py-14 text-center">
        <span className="inline-block text-xs text-gray-600 rounded-full border border-gray-200 px-3 py-1">
          All-in-one AI toolkit
        </span>

        <h1 className="mt-4 text-5xl font-bold tracking-tight">AI Tools Hub</h1>

        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          Your complete suite of AI-powered tools — chat, vision, research,
          PDFs, quizzes, resume builder, and more.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-lg bg-black text-white px-4 py-2 text-sm hover:opacity-90"
          >
            Explore Tools
          </Link>

          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* TOOLS GRID */}
      <section className="mx-auto max-w-5xl px-4 pb-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {toolDefs.map(({ label, to, icon: Icon, sub }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-black/70" />
                <div className="font-medium">{label}</div>
              </div>
              <div className="mt-1 text-sm text-gray-600">{sub}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
