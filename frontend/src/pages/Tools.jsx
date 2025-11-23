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
  ListCollapse,
  Languages,
  Mic,
  Volume2,
  Mail,
  Share2,
  PenSquare,
  BarChart
} from "lucide-react";

const tools = [
  { label: "AI Chat", to: "/chat", icon: MessageSquare, sub: "Conversational AI assistant" },
  { label: "AI Vision", to: "/vision", icon: Eye, sub: "Analyze images and screenshots" },
  { label: "Resume Builder", to: "/resume", icon: FileText, sub: "Generate a polished resume" },
  { label: "Quiz Maker", to: "/quiz", icon: FileQuestion, sub: "Create tests instantly" },
  { label: "Research Generator", to: "/research", icon: BookOpen, sub: "Generate research drafts" },
  { label: "Math Solver", to: "/math", icon: Sigma, sub: "Solve math problems" },
  { label: "PDF Tools", to: "/pdf", icon: FileText, sub: "Summaries & extraction" },
  { label: "Notes Maker", to: "/notes", icon: NotebookPen, sub: "Study notes & plans" },

  // New AI tools
  { label: "Code Generator", to: "/code-generator", icon: Code, sub: "Generate code in any language" },
  { label: "Image Generator", to: "/image-generator", icon: ImageIcon, sub: "AI Image creation" },
  { label: "Summarizer", to: "/summarizer", icon: ListCollapse, sub: "Summarize long text" },
  { label: "Translator", to: "/translator", icon: Languages, sub: "Translate any language" },
  { label: "Voice → Text", to: "/voice-to-text", icon: Mic, sub: "Speech recognition" },
  { label: "Text → Voice", to: "/text-to-voice", icon: Volume2, sub: "AI voice generation" },
  { label: "Email Writer", to: "/email-writer", icon: Mail, sub: "Professional email drafts" },
  { label: "Social Media Writer", to: "/social-media-writer", icon: Share2, sub: "Posts & captions" },
  { label: "Blog Writer", to: "/blog-writer", icon: PenSquare, sub: "Write blog content" },
  { label: "SEO Optimizer", to: "/seo-optimizer", icon: BarChart, sub: "SEO-friendly rewriting" }
];

export default function Tools() {
  return (
    <div>
      <h1 className="text-2xl font-bold">All AI Tools</h1>
      <p className="text-gray-600 mt-1">Explore all tools available on AI Tools Hub.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {tools.map(({ label, to, icon: Icon, sub }) => (
          <Link
            key={to}
            to={to}
            className="border rounded-lg p-4 bg-white hover:shadow transition flex flex-col"
          >
            <div className="flex items-center gap-2 text-black font-medium">
              <Icon className="h-5 w-5" />
              {label}
            </div>
            <p className="text-sm text-gray-600 mt-1">{sub}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
