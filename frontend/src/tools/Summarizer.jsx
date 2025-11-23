// src/tools/Summarizer.jsx
import React, { useState } from "react";
import api from "../lib/api";
import { ListCollapse } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Summarizer() {
  const [text, setText] = useState("");
  const [length, setLength] = useState("Medium");
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

  const summarize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setOutput("");
    try {
      const res = await api.post("/summarizer/", { text, length });
      const { ok, result, error } = res.data || {};
      if (!ok) {
        toast(error?.message || "Summarization failed", "error");
        return;
      }
      const summaryRaw = result?.summary;
      const summary = typeof summaryRaw === "object" ? JSON.stringify(summaryRaw, null, 2) : (summaryRaw || "");
      setOutput(summary || "No summary generated.");
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) {
        await handleUnauthorized();
        return;
      }
      const msg = e?.response?.data?.error?.message || e.message || "Failed";
      toast(msg, "error");
      setOutput(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-4">

      {/* LEFT PANEL */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ListCollapse className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold">AI Text Summarizer</h2>
          </div>
          <Link to="/dashboard" className="text-xs underline">Back</Link>
        </div>

        <p className="text-sm text-gray-600 mb-3">
          Paste any long text and generate a short, medium, or long summary instantly.
        </p>

        <textarea
          className="w-full rounded-lg border border-gray-300 p-3 mb-3 min-h-[120px]
                    focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Paste your text here..."
          aria-label="Text to summarize"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <select
          className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none 
                    focus:ring-2 focus:ring-black/20"
          value={length}
          onChange={(e) => setLength(e.target.value)}
        >
          <option>Short</option>
          <option>Medium</option>
          <option>Long</option>
        </select>

        <div className="mt-3 flex justify-end">
          <button
            onClick={summarize}
            disabled={loading}
            className="rounded-lg bg-black text-white px-3 py-2 text-sm hover:opacity-85"
          >
            {loading ? "Generating…" : "Summarize"}
          </button>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
        <div className="text-sm text-gray-600 mb-2">Summary Result</div>
        <div className="rounded-lg border border-gray-200 bg-white p-3 min-h-[200px] whitespace-pre-wrap text-gray-800 text-sm">
          {output || (loading ? "Generating…" : "Your summarized text will appear here.")}
        </div>
      </div>

    </div>
  );
}
