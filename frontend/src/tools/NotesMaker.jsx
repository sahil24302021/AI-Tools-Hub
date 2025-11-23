// src/tools/NotesMaker.jsx
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
    if (!subject.trim()) return;
    setLoading(true);
    setOutput("");
        try {
          const res = await api.post("/notes/", { topic: subject });
          const { ok, result, error } = res.data || {};
          if (!ok) {
            toast(error?.message || "Generation failed", "error");
            return;
          }
          const raw = result?.notes;
          const display = typeof raw === "object" ? JSON.stringify(raw, null, 2) : (raw || "No notes returned.");
          setOutput(display);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) {
        await handleUnauthorized();
        return;
      }
      const msg = e?.response?.data?.error?.message || e.message || "Something went wrong";
      toast(msg, "error");
      setOutput(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-4">
      
      {/* LEFT SIDE */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <NotebookPen className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold">AI Study Planner / Notes Maker</h2>
          </div>
          <Link to="/dashboard" className="text-xs underline">Back</Link>
        </div>

        <p className="text-sm text-gray-600 mb-3">
          Enter details and let AI create a full syllabus, plan, and notes.
        </p>

        {/* INPUTS */}
        <input
          className="w-full rounded-lg border border-gray-300 p-3 mb-2
          focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <input
          className="w-full rounded-lg border border-gray-300 p-3 mb-2
          focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Study Duration (e.g. 2 weeks, 10 days)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <input
          className="w-full rounded-lg border border-gray-300 p-3
          focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Goal (e.g. score 90%, finish syllabus)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />

        <div className="mt-3 flex justify-end">
          <button
            onClick={generate}
            disabled={loading}
            className="rounded-lg bg-black text-white px-4 py-2 text-sm 
            hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Plan"}
            {loading ? "Generating…" : "Generate Notes"}
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
        <div className="text-sm text-gray-600 mb-1">AI Generated Study Plan</div>

        <div className="rounded-lg border border-gray-200 bg-white p-3 min-h-[200px] text-gray-800 whitespace-pre-wrap">
          {loading ? "Creating your study plan..." : output || "Your notes and study plan will appear here."}
        </div>
      </div>

    </div>
  );
}
