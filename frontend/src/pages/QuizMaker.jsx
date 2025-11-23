import React, { useState } from "react";
import api from "../lib/api";
import { FileQuestion } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function QuizMaker() {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState("Medium");
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
      const res = await api.post("/quiz/", { topic, count, difficulty });
      const { ok, result, error } = res.data || {};
      if (!ok) {
        toast(error?.message || "Quiz generation failed", "error");
        return;
      }
      const qs = result?.questions || [];
      setResult(qs.length ? JSON.stringify(qs, null, 2) : "No questions returned.");
    } catch (e) {
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
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileQuestion className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold">AI Quiz/Test Maker</h2>
          </div>

          <Link to="/dashboard" className="text-xs underline">
            Back
          </Link>
        </div>

        <p className="text-sm text-gray-600 mb-3">
          Generate quizzes instantly from any topic.
        </p>

        {/* Topic */}
        <input
          className="w-full rounded-lg border border-gray-300 p-3 mb-2
                     focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        {/* Count */}
        <input
          type="number"
          min={1}
          max={50}
          className="w-full rounded-lg border border-gray-300 p-3 mb-2
                     focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Question Count"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        />

        {/* Difficulty */}
        <select
          className="w-full rounded-lg border border-gray-300 p-3
                     focus:outline-none focus:ring-2 focus:ring-black/20"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        {/* Button */}
        <div className="mt-3 flex justify-end">
          <button
            onClick={generate}
            disabled={loading}
            className="rounded-lg bg-black text-white px-3 py-2 text-sm
                       hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Generating…" : "Generate Test"}
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
  <div className="text-sm text-gray-600 mb-1">Quiz Preview {error && <span className="text-red-500">• {error}</span>}</div>
        <div
          className="rounded-lg border border-gray-200 bg-white p-3 min-h-[180px]
                     whitespace-pre-wrap text-gray-800"
        >
          {result || "Your generated quiz will appear here."}
        </div>
      </div>
    </div>
  );
}
