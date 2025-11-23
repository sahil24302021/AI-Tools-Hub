// src/tools/BlogWriter.jsx
import React, { useState } from "react";
import api from "../lib/api";
import { PenSquare } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

// Standardized to ChatTool pattern
export default function BlogWriter() {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { show: toast } = useToast();

  const handleUnauthorized = async () => {
    toast("Session expired — please login again", "error");
    await logout();
    const ret = encodeURIComponent(location.pathname + location.search);
    navigate(`/login?returnTo=${ret}`);
  };

  const generate = async () => {
    if (!title.trim() && !topic.trim()) {
      toast("Provide a title or a topic", "error");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const wordMap = { Short: 600, Medium: 1000, Long: 1500 };
      const prompt = [
        title ? `Title: ${title}` : null,
        topic ? `Topic: ${topic}` : null,
        keywords ? `Keywords: ${keywords}` : null,
        tone ? `Tone: ${tone}` : null,
      ].filter(Boolean).join("\n");
      const res = await api.post("/blog-writer/", { prompt, word_count: wordMap[length] || 800 });
      const { ok, result, error } = res.data || {};
      if (!ok) {
        toast(error?.message || "Generation failed", "error");
        return;
      }
      const blogRaw = result?.blog;
      const blog = typeof blogRaw === "object" ? JSON.stringify(blogRaw, null, 2) : (blogRaw || "No output returned from server.");
      setOutput(blog);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) {
        await handleUnauthorized();
        return;
      }
      const msg = e?.response?.data?.error?.message || e.message || "Request failed";
      toast(msg, "error");
      setOutput(msg);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setTitle("");
    setTopic("");
    setKeywords("");
    setTone("Professional");
    setLength("Medium");
    setOutput("");
  };

  return (
    <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-4">
      {/* Left: Controls */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <PenSquare className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold">Blog Writer</h2>
          </div>
          <Link to="/dashboard" className="text-xs underline">Back</Link>
        </div>

        <p className="text-sm text-gray-600 mb-3">Generate a blog post from a title or topic. Add keywords for SEO and pick tone & length.</p>

        <label className="text-xs font-medium text-gray-700">Title (optional)</label>
        <input
          className="w-full rounded-lg border border-gray-300 p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Write a title (e.g. 'How to Learn React in 2025')"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="text-xs font-medium text-gray-700">Topic (optional)</label>
        <input
          className="w-full rounded-lg border border-gray-300 p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Or enter a topic (e.g. 'state management with hooks')"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <label className="text-xs font-medium text-gray-700">Keywords (comma separated)</label>
        <input
          className="w-full rounded-lg border border-gray-300 p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="react, hooks, beginners"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="text-xs font-medium text-gray-700">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-black/20 text-sm"
            >
              <option>Professional</option>
              <option>Casual</option>
              <option>Persuasive</option>
              <option>Conversational</option>
              <option>Technical</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700">Length</label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-black/20 text-sm"
            >
              <option>Short</option>
              <option>Medium</option>
              <option>Long</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <button
            onClick={generate}
            disabled={loading}
            className="inline-flex items-center rounded-md bg-black text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Generating…" : "Generate Post"}
          </button>

          <button
            onClick={clear}
            disabled={loading}
            className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-50"
          >
            Clear
          </button>
        </div>

        <p className="text-[11px] text-gray-500 mt-2">Tip: Provide either a clear title or a good topic + keywords for best results.</p>
      </div>

      {/* Right: Result */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-700">Generated Blog</div>
          {output && !loading && <button onClick={() => setOutput("")} className="text-xs text-gray-500 hover:text-gray-700">Clear</button>}
        </div>
        <div className="flex-1 text-sm">
          {loading && (
            <div className="space-y-3" aria-busy="true">
              <div className="h-3 w-32 rounded bg-gray-200 animate-pulse" />
              <div className="h-3 w-full rounded bg-gray-200 animate-pulse" />
              <div className="h-3 w-5/6 rounded bg-gray-200 animate-pulse" />
              <div className="h-3 w-3/4 rounded bg-gray-200 animate-pulse" />
            </div>
          )}
          {!loading && !output && <div className="text-gray-400">Generated blog will appear here.</div>}
          {!loading && output && (
            <div className="prose max-w-none break-words">
              {/<\/?[a-z][\s\S]*>/i.test(output) ? (
                <div dangerouslySetInnerHTML={{ __html: output }} />
              ) : (
                <div style={{ whiteSpace: "pre-wrap" }}>{output}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
