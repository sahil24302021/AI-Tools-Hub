// src/tools/SEOOptimizer.jsx
import React, { useState } from "react";
import api from "../lib/api";
import { BarChart } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function SEOOptimizer() {
  const [text, setText] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("Professional");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { show: toast } = useToast();

  const handleUnauthorized = async () => {
    show("Session expired — please login again", "error");
    await logout();
    const ret = encodeURIComponent(location.pathname + location.search);
    navigate(`/login?returnTo=${ret}`);
  };

  const optimize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setOutput("");
    try {
      const res = await api.post("/seo-optimizer/", {
        text,
        keywords: keywords ? keywords.split(",").map(k => k.trim()).filter(Boolean) : [],
        tone,
      });
      const { ok, result, error } = res.data || {};
      if (!ok) {
        toast(error?.message || "Optimization failed", "error");
        return;
      }
      const raw = result?.seo_text;
      const seo = typeof raw === "object" ? JSON.stringify(raw, null, 2) : (raw || "No optimized content returned.");
      setOutput(seo);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) {
        await handleUnauthorized();
        return;
      }
      const msg = e?.response?.data?.error?.message || e.message || "Failed";
      show(msg, "error");
      setOutput(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-4">
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold">SEO Optimizer</h2>
          </div>
          <Link to="/dashboard" className="text-xs underline">Back</Link>
        </div>
        <p className="text-sm text-gray-600 mb-4">Improve your content to be SEO-friendly and keyword-optimized.</p>
        <textarea
          className="w-full rounded-lg border border-gray-300 p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Paste text that needs SEO improvement"
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          className="w-full rounded-lg border border-gray-300 p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Target Keywords (comma-separated)"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
        <select
          className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black/20"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          <option>Professional</option>
          <option>Casual</option>
          <option>Friendly</option>
          <option>Technical</option>
        </select>
        <div className="mt-3 flex justify-end">
          <button
            onClick={optimize}
            disabled={loading}
            className="rounded-lg bg-black text-white px-3 py-2 text-sm hover:opacity-90"
          >
            {loading ? "Generating…" : "Optimize Content"}
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
        <div className="text-sm text-gray-600 mb-1">Optimized Result</div>
        <div className="rounded-lg border border-gray-200 bg-white p-3 min-h-[200px] whitespace-pre-wrap text-gray-800 leading-relaxed">
          {output || (loading ? "Generating…" : "Your SEO-optimized content will appear here.")}
        </div>
      </div>
    </div>
  );
}
