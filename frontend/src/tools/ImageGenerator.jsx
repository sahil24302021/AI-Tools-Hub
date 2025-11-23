// src/tools/ImageGenerator.jsx
import React, { useState } from "react";
import api from "../lib/api";
import { Image as ImageIcon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Realistic");
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
    if (!prompt.trim()) return;
    setLoading(true);
    setOutput("");
    try {
      const res = await api.post("/image-generator/", { prompt, style });
      const { ok, result, error } = res.data || {};
      if (!ok) {
        toast(error?.message || "Generation failed", "error");
        return;
      }
      const raw = result?.image_prompt;
      const text = typeof raw === "object" ? JSON.stringify(raw, null, 2) : (raw || "No prompt returned.");
      setOutput(text);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) {
        await handleUnauthorized();
        return;
      }
      const msg = e?.response?.data?.error?.message || e.message || "Image prompt generation failed";
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
            <ImageIcon className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold">AI Image Prompt Generator</h2>
          </div>
          <Link to="/dashboard" className="text-xs underline">Back</Link>
        </div>
        <p className="text-sm text-gray-600 mb-3">Generate a highly detailed prompt you can use in an external image model.</p>
        <textarea
          rows={4}
          className="w-full rounded-lg border border-gray-300 p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Describe the image you want..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <select
          className="w-full rounded-lg border border-gray-300 p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-black/20"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
        >
          <option>Realistic</option>
          <option>Anime</option>
          <option>Cinematic</option>
          <option>Cartoon</option>
          <option>Digital Art</option>
          <option>3D Render</option>
        </select>
        <div className="mt-3 flex justify-end">
          <button
            onClick={generate}
            disabled={loading}
            className="rounded-lg bg-black text-white px-3 py-2 text-sm hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Generating…" : "Generate Prompt"}
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 flex flex-col">
        <div className="text-sm text-gray-600 mb-1">Generated Image Prompt</div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 min-h-[300px] whitespace-pre-wrap text-gray-800 leading-relaxed">
          {output || (loading ? "Generating…" : "Your refined image prompt will appear here.")}
        </div>
      </div>
    </div>
  );
}
