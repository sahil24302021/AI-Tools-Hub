// src/tools/SocialMediaWriter.jsx
import React, { useState } from "react";
import api from "../lib/api";
import { Share2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

// Standardized to ChatTool pattern: unified ok/result/error handling and 401 redirect.
export default function SocialMediaWriter() {
  const [platform, setPlatform] = useState("Instagram");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Casual");
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
    if (!topic.trim()) {
      toast("Please enter a topic", "error");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await api.post("/social-media-writer/", { platform, prompt: topic, tone });
      const { ok, result, error } = res.data || {};
      if (!ok) {
        toast(error?.message || "Generation failed", "error");
        return;
      }
      const postRaw = result?.post;
      const post = typeof postRaw === "object" ? JSON.stringify(postRaw, null, 2) : (postRaw || "No content generated.");
      setOutput(post);
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

  return (
    <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-4">
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold">AI Social Media Writer</h2>
          </div>
          <Link to="/dashboard" className="text-xs underline">Back</Link>
        </div>
        <p className="text-sm text-gray-600 mb-3">Generate multi-post content for any platform.</p>
        <select
          className="w-full rounded-lg border border-gray-300 p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-black/20"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          <option>Instagram</option>
          <option>Twitter</option>
          <option>LinkedIn</option>
          <option>Facebook</option>
          <option>YouTube</option>
        </select>
        <input
          className="w-full rounded-lg border border-gray-300 p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Topic (e.g. AI Tools, Fitness, Finance...)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <select
          className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black/20"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          <option>Casual</option>
          <option>Professional</option>
          <option>Funny</option>
          <option>Motivational</option>
          <option>Educational</option>
        </select>
        <div className="mt-3 flex justify-end">
          <button
            onClick={generate}
            disabled={loading}
            className="rounded-lg bg-black text-white px-3 py-2 text-sm hover:opacity-85 disabled:opacity-50"
          >
            {loading ? "Generating…" : "Generate Content"}
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
        <div className="text-sm text-gray-600 mb-2">Generated Post(s)</div>
        <div className="rounded-lg border border-gray-200 bg-white p-3 min-h-[200px] whitespace-pre-wrap text-gray-800 text-sm">
          {output || (loading ? "Generating…" : "Your social media content will appear here.")}
        </div>
      </div>
    </div>
  );
}
