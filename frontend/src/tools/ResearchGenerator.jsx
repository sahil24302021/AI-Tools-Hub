// src/tools/ResearchGenerator.jsx
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
  const [output, setOutput] = useState("");

  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { show: toast } = useToast();

  const handleUnauthorized = async () => {
    toast("Session expired — please login again", "error");
    await logout();
    const ret = encodeURIComponent(location.pathname + location.search);
    navigate(`/login?returnTo=${ret}`);
  };

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setOutput("");
    try {
      const res = await api.post("/research/", { topic, keywords, style });
      const { ok, result, error } = res.data || {};
      if (!ok) {
        toast(error?.message || "Generation failed", "error");
        return;
      }
      const raw = result?.research;
      const display = typeof raw === "object" ? JSON.stringify(raw, null, 2) : (raw || "No result.");
      setOutput(display);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) {
        await handleUnauthorized();
        return;
      }
      const msg = e?.response?.data?.error?.message || e.message || "Something went wrong";
      toast(msg, "error");
      setOutput(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-4">

      {/* LEFT SIDE */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">

        {/* Title */}
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

        {/* Inputs */}
        <input
          className="w-full rounded-lg border border-gray-300 p-3 mb-2 
                     focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Topic"
          aria-label="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <input
          className="w-full rounded-lg border border-gray-300 p-3 mb-2 
                     focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Keywords (comma-separated)"
          aria-label="Keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />

        <select
          className="w-full rounded-lg border border-gray-300 p-3 
                     focus:outline-none focus:ring-2 focus:ring-black/20"
          value={style}
          aria-label="Citation Style"
          onChange={(e) => setStyle(e.target.value)}
        >
          <option>APA</option>
          <option>MLA</option>
        </select>

        {/* Generate Button */}
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

      {/* RIGHT SIDE */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
        <div className="text-sm text-gray-600 mb-1">Generated Paper</div>

        <div
          className="rounded-lg border border-gray-200 bg-white p-3 min-h-[180px]
                     whitespace-pre-wrap text-gray-800"
        >
          {output || (loading ? "Generating…" : "The generated paper (Title, Abstract, Introduction, etc.) will appear here.")}
        </div>
      </div>
    </div>
  );
}
