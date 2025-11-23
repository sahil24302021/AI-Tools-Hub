// src/tools/MathSolver.jsx
import React, { useState } from "react";
import api from "../lib/api";
import { Sigma } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function MathSolver() {
  const [equation, setEquation] = useState("");
  const [result, setResult] = useState("");
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

  const solve = async () => {
    if (!equation.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const res = await api.post("/math/", { problem: equation });
      const { ok, result, error } = res.data || {};
      if (!ok) {
        toast(error?.message || "Solving failed", "error");
        return;
      }
      const steps = result?.steps || "No steps.";
      const answer = result?.answer ? `\n\nAnswer: ${result.answer}` : "";
      setResult(`${steps}${answer}`.trim());
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) {
        await handleUnauthorized();
        return;
      }
      const errMsg = e?.response?.data?.error?.message || e?.message || "Error solving equation";
      toast(errMsg, "error");
      setResult(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-4">

      {/* LEFT PANEL */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sigma className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold">AI Math Solver</h2>
          </div>
          <Link to="/dashboard" className="text-xs underline">Back</Link>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-2">
          Enter a math equation to get step-by-step solutions.
        </p>

        {/* Input */}
        <input
          type="text"
          placeholder="Example: integrate x^2 dx"
          aria-label="Equation"
          value={equation}
          onChange={(e) => setEquation(e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-3 
          focus:outline-none focus:ring-2 focus:ring-black/20"
        />

        {/* Button */}
        <div className="mt-3 flex justify-end">
          <button
            onClick={solve}
            disabled={loading}
            className="rounded-lg bg-black text-white px-3 py-2 text-sm 
            hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Generating…" : "Solve"}
          </button>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
        <div className="text-sm text-gray-600 mb-1">Solution</div>

        <div className="rounded-lg border border-gray-200 bg-white p-3 min-h-[180px] whitespace-pre-wrap text-gray-800">
          {loading
            ? "Generating…"
            : result || "Your step-by-step solution will appear here."}
        </div>
      </div>
    </div>
  );
}
