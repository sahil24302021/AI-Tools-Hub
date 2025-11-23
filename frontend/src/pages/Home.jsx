// frontend/src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";

// Tools for marketing section
const features = [
  { label: "AI Chat", to: "/chat", icon: MessageSquare, sub: "Conversational AI assistant" },
  { label: "AI Vision", to: "/vision", icon: Eye, sub: "Analyze & describe images" },
  { label: "Resume Builder", to: "/resume", icon: FileText, sub: "Create resumes instantly" },
  { label: "Quiz Maker", to: "/quiz", icon: FileQuestion, sub: "Generate MCQs instantly" },
  { label: "Research Generator", to: "/research", icon: BookOpen, sub: "Write research drafts" },
  { label: "Math Solver", to: "/math", icon: Sigma, sub: "Solve equations step-by-step" },
  { label: "PDF Tools", to: "/pdf", icon: FileText, sub: "Summaries, extraction & more" },
  { label: "Notes Maker", to: "/notes", icon: NotebookPen, sub: "Study notes & plans" },
  { label: "Code Generator", to: "/code-generator", icon: Code, sub: "Generate code in any language" },
  { label: "Image Generator", to: "/image-generator", icon: ImageIcon, sub: "Generate images using AI" },
];

export default function Home() {
  return (
    <div className="relative bg-white text-black overflow-hidden">

      {/* Soft glow backgrounds */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] rounded-full bg-blue-200 blur-[140px]" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] rounded-full bg-purple-200 blur-[160px]" />
      </div>

      {/* HERO SECTION */}
      <section className="relative mx-auto max-w-6xl px-4 py-28 text-center">
        
        <div className="inline-block text-xs text-gray-700 rounded-full border border-gray-300 px-4 py-1 bg-white/80 backdrop-blur-sm shadow-sm">
          ⚡ Your Personal All-in-One AI Workspace
        </div>

        <h1 className="mt-6 text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          Supercharge your workflow<br />
          with <span className="text-black">AI Tools Hub</span>
        </h1>

        <p className="mt-5 text-gray-600 max-w-2xl mx-auto text-lg">
          Write, research, code, design, analyze, and create — all powered by one intelligent platform.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/tools"
            className="rounded-lg bg-black text-white px-7 py-3 text-sm font-medium hover:opacity-90 transition shadow-md"
          >
            🚀 Explore Tools
          </Link>

          <Link
            to="/register"
            className="rounded-lg border border-gray-300 bg-white px-7 py-3 text-sm font-medium hover:bg-gray-50 transition shadow-sm"
          >
            Create Free Account
          </Link>
        </div>

        {/* (Removed TRASH — no hero image here) */}
      </section>

      {/* TOOLS GRID SECTION */}
      <section className="relative mx-auto max-w-6xl px-4 pb-24">
        <h2 className="text-3xl font-semibold mb-10 text-center">
          20+ AI Tools — One Dashboard
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ label, to, icon: Icon, sub }) => (
            <Link
              key={to}
              to={to}
              className="group bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-gray-100 p-3 group-hover:bg-gray-200 transition">
                  <Icon className="h-6 w-6 text-black/70" />
                </div>

                <div>
                  <div className="font-semibold text-base">{label}</div>
                  <div className="text-sm text-gray-500">{sub}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/tools"
            className="text-sm text-black underline hover:opacity-70"
          >
            View all tools →
          </Link>
        </div>
      </section>
    </div>
  );
}
