import React, { useState } from "react";
import api from "../lib/api";
import { BookOpen } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function ResearchGenerator() {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [style, setStyle] = useState("APA");
  const [result, setResult] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { show: toast } = useToast();

  const generate = async () => {
    if (!topic.trim()) return;

    setLoading(true);
  setResult("");
  setError(null);

    try {
      const res = await api.post("/research/", { topic, keywords, style });
      const { ok, result, error } = res.data || {};
      if (!ok) {
        toast(error?.message || "Research generation failed", "error");
        return;
      }
      let out = result?.research;
      if (typeof out === "object") out = JSON.stringify(out, null, 2);
      setResult(out || "No research returned.");
    } catch (e) {
      // Token expired
      if (e?.response?.status === 401) {
        toast("Session expired — please login again", "error");
        await logout();
        const ret = encodeURIComponent(location.pathname + location.search);
        navigate(`/login?returnTo=${ret}`);
        return;
      }

  const msg = e?.response?.data?.error?.message || e.message || "Error";
  setError(msg);
  setResult(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-4">
      {/* Left Panel */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold">AI Research Paper Generator</h2>
          </div>
          <Link to="/dashboard" className="text-xs underline">
            Back
          </Link>
        </div>

        <p className="text-sm text-gray-600 mb-2">
          Generate a structured research paper with citations.
        </p>

        {/* Topic */}
        <input
          className="w-full rounded-lg border border-gray-300 p-3 mb-2
                     focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Topic"
          aria-label="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        {/* Keywords */}
        <input
          className="w-full rounded-lg border border-gray-300 p-3 mb-2
                     focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Keywords (comma-separated)"
          aria-label="Keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />

        {/* Citation Style */}
        <select
          className="w-full rounded-lg border border-gray-300 p-3
                     focus:outline-none focus:ring-2 focus:ring-black/20"
          value={style}
          aria-label="Citation style"
          onChange={(e) => setStyle(e.target.value)}
        >
          <option>APA</option>
          <option>MLA</option>
        </select>

        <div className="mt-3 flex justify-end">
          <button
            onClick={generate}
            disabled={loading}
            className="rounded-lg bg-black text-white px-3 py-2 text-sm hover:opacity-90"
          >
            {loading ? "Generating…" : "Generate Paper"}
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
  <div className="text-sm text-gray-600 mb-1">Generated Paper {error && <span className="text-red-500">• {error}</span>}</div>

        <div
          className="rounded-lg border border-gray-200 bg-white p-3
                     min-h-[180px] whitespace-pre-wrap text-gray-800"
        >
          {result ||
            "The generated paper (Title, Abstract, Introduction, etc.) will appear here."}
        </div>
      </div>
    </div>
  );
}
