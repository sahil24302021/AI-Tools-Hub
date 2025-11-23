import React, { useState } from "react";
import api from "../lib/api";
import { NotebookPen } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function NotesMaker() {
  const [subject, setSubject] = useState("");
  const [time, setTime] = useState("");
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { show: toast } = useToast();

  const generate = async () => {
    if (!subject.trim()) return;

    setLoading(true);
  setResult("");
  setError(null);

    try {
      const res = await api.post("/notes/", { topic: subject, time, goal });
      const { ok, result, error } = res.data || {};
      if (!ok) {
        toast(error?.message || "Notes generation failed", "error");
        return;
      }
      let out = result?.notes;
      if (typeof out === "object") out = JSON.stringify(out, null, 2);
      setResult(out || "No notes returned.");
    } catch (e) {
      // Session expired
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

      {/* LEFT SIDE */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <NotebookPen className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold">AI Study Planner / Notes Maker</h2>
          </div>
          <Link to="/dashboard" className="text-xs underline">
            Back
          </Link>
        </div>

        <p className="text-sm text-gray-600 mb-3">
          Generate detailed study notes and plans based on your goals.
        </p>

        <input
          className="w-full rounded-lg border border-gray-300 p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <input
          className="w-full rounded-lg border border-gray-300 p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Study Time (e.g. 2 weeks)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <input
          className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Goal (e.g. Score 90% in exam)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />

        <div className="mt-4 flex justify-end">
          <button
            onClick={generate}
            disabled={loading}
            className="rounded-lg bg-black text-white px-4 py-2 text-sm hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Generating…" : "Generate Plan"}
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
  <div className="text-sm text-gray-600 mb-1">Generated Notes / Plan {error && <span className="text-red-500">• {error}</span>}</div>

        <div className="rounded-lg border border-gray-200 bg-white p-3 min-h-[200px] text-gray-800 whitespace-pre-wrap">
          {result || "Your generated notes or study plan will appear here."}
        </div>
      </div>
    </div>
  );
}
