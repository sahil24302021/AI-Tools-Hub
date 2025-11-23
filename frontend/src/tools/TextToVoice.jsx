// src/tools/TextToVoice.jsx
import React, { useState } from "react";
import api from "../lib/api";
import { Volume2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

// Standardized to ChatTool pattern
export default function TextToVoice() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("Female");
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

  const convert = async () => {
    if (!text.trim()) {
      toast("Enter some text to convert", "error");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await api.post("/text-to-voice/", { text, style: voice });
      const { ok, result, error } = res.data || {};
      if (!ok) {
        toast(error?.message || "Generation failed", "error");
        return;
      }
      const scriptRaw = result?.voice_script;
      const script = typeof scriptRaw === "object" ? JSON.stringify(scriptRaw, null, 2) : (scriptRaw || "No voice script returned.");
      setOutput(script);
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
            <Volume2 className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold">AI Text → Voice Script</h2>
          </div>
          <Link to="/dashboard" className="text-xs underline">Back</Link>
        </div>
        <p className="text-sm text-gray-600 mb-2">Convert text into a natural-sounding voice script.</p>
        <textarea
          className="w-full rounded-lg border border-gray-300 p-3 mb-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Type or paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <select
          className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black/20"
          value={voice}
          onChange={(e) => setVoice(e.target.value)}
        >
          <option>Female</option>
          <option>Male</option>
          <option>Robotic</option>
        </select>
        <div className="mt-3 flex justify-end">
          <button
            onClick={convert}
            disabled={loading}
            className="rounded-lg bg-black text-white px-3 py-2 text-sm hover:opacity-85 disabled:opacity-50"
          >
            {loading ? "Generating…" : "Convert"}
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
        <div className="text-sm text-gray-600 mb-2">Generated Voice Script</div>
        <div className="rounded-lg border border-gray-200 bg-white p-3 min-h-[150px] whitespace-pre-wrap text-gray-800 text-sm">
          {output || (loading ? "Generating…" : "Your generated voice script will appear here.")}
        </div>
      </div>
    </div>
  );
}
