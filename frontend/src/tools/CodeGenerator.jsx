// src/tools/CodeGenerator.jsx
import React, { useState } from "react";
import api from "../lib/api";
import { Code } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function CodeGenerator() {
  const [instruction, setInstruction] = useState("");
  const [language, setLanguage] = useState("JavaScript");
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

  const generate = async () => {
    if (!instruction.trim()) return;
    setLoading(true);
    setOutput("");
    try {
      const res = await api.post("/code-generator/", { description: instruction, language });
      const { ok, result, error } = res.data || {};
      if (!ok) {
        toast(error?.message || "Generation failed", "error");
        return;
      }
      const raw = result?.code;
      const code = typeof raw === "object" ? JSON.stringify(raw, null, 2) : (raw || "No code returned.");
      setOutput(code);
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
      {/* Left panel */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold">AI Code Generator</h2>
          </div>
          <Link to="/dashboard" className="text-xs underline">
            Back
          </Link>
        </div>

        <p className="text-sm text-gray-600 mb-3">
          Describe the code you want, and the AI will generate it in your chosen
          language.
        </p>

        {/* Instruction */}
        <textarea
          className="w-full rounded-lg border border-gray-300 p-3 mb-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Describe what you want to build..."
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
        />

        {/* Language select */}
        <select
          className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black/20"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option>JavaScript</option>
          <option>Python</option>
          <option>React</option>
          <option>Node.js</option>
          <option>HTML</option>
          <option>CSS</option>
          <option>C++</option>
          <option>Java</option>
          <option>Kotlin</option>
          <option>Swift</option>
          <option>PHP</option>
          <option>Go</option>
          <option>Rust</option>
        </select>

        <div className="mt-3 flex justify-end">
          <button
            onClick={generate}
            disabled={loading}
            className="rounded-lg bg-black text-white px-3 py-2 text-sm hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Generating…" : "Generate Code"}
          </button>
        </div>
      </div>

      {/* Right panel */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 flex flex-col">
        <div className="text-sm text-gray-600 mb-1">Generated Code</div>
        <pre className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs whitespace-pre-wrap overflow-x-auto flex-1 text-gray-800 min-h-[200px]">
          {output || (loading ? "Generating..." : "Your generated code will appear here.")}
        </pre>
      </div>
    </div>
  );
}
