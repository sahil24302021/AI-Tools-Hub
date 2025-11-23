// src/tools/QuizMaker.jsx
import React, { useState } from "react";
import api from "../lib/api";
import { FileText } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

export default function QuizMaker() {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState("Medium");
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);

  const { show } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleUnauthorized = async () => {
    show("Session expired — please login again", "error");
    await logout();
    const ret = encodeURIComponent(location.pathname + location.search);
    navigate(`/login?returnTo=${ret}`);
  };

  const generateQuiz = async () => {
    if (!topic.trim()) {
      show("Please enter a topic", "error");
      return;
    }
    setLoading(true);
    setQuiz(null);
    try {
      const res = await api.post("/quiz/", {
        topic: topic.trim(),
        count: Number(count) || 5,
        difficulty: difficulty.toLowerCase(),
      });
      const { ok, result, error } = res.data || {};
      if (!ok) {
        show(error?.message || "Quiz generation failed", "error");
        return;
      }
      const questions = Array.isArray(result?.questions) ? result.questions : [];
      let finalQuestions = questions;
      if (finalQuestions.length === 0) {
        // synthesize fallback
        const desired = Number(count) || 5;
        finalQuestions = Array.from({ length: desired }, (_, i) => ({
          q: `Placeholder question ${i + 1} about ${topic || "topic"}?`,
          options: [],
          answer: "N/A",
        }));
      }
      setQuiz({ questions: finalQuestions });
  } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        await handleUnauthorized();
        return;
      }
      const msg = err?.response?.data?.error?.message || err?.message || "Failed to generate quiz";
      show(msg, "error");
      const desired = Number(count) || 5;
      const fallback = Array.from({ length: desired }, (_, i) => ({
        q: `Placeholder question ${i + 1} about ${topic || "topic"}?`,
        options: [],
        answer: "N/A",
      }));
      setQuiz({ questions: fallback });
    } finally {
      setLoading(false);
    }
  };

  const renderQuestions = () => {
    if (!quiz) {
      return <p className="text-sm text-gray-500">No questions generated.</p>;
    }

    const questions = Array.isArray(quiz?.questions) ? quiz.questions : [];
    if (!Array.isArray(questions) || questions.length === 0) {
      return <p className="text-sm text-gray-500">No questions in the response from server.</p>;
    }

    return (
      <ol className="space-y-4 text-sm">
        {questions.map((q, idx) => (
          <li key={idx} className="border-b border-gray-200 pb-3">
            <p className="font-medium">
              {idx + 1}. {q.q || q.question || "Untitled question"}
            </p>
            {Array.isArray(q.options) && q.options.length > 0 && (
              <ul className="mt-1 ml-4 list-disc space-y-1">
                {q.options.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
            )}
            {q.answer && (
              <p className="mt-1 text-xs text-gray-600">
                <span className="font-semibold">Answer:</span> {q.answer}
              </p>
            )}
          </li>
        ))}
      </ol>
    );
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-700" />
          <h1 className="text-lg font-semibold">AI Quiz/Test Maker</h1>
        </div>
        <Link to="/dashboard" className="text-xs underline">
          Back
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.3fr)] gap-6">
        {/* Left: Form */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
          <p className="text-xs text-gray-500">
            Generate quizzes from any topic.
          </p>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">
              Topic
            </label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Python basics, World War II…"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">
              Number of questions
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <button
            onClick={generateQuiz}
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-black text-white px-4 py-2 text-sm hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Generating…" : "Generate Test"}
          </button>
        </div>

        {/* Right: Preview */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-medium text-gray-600">Quiz Preview</p>
            {topic && (
              <p className="text-[11px] text-gray-500">
                Topic: <span className="font-semibold">{topic}</span> ·
                Difficulty:{" "}
                <span className="font-semibold">
                  {difficulty.toLowerCase()}
                </span>
              </p>
            )}
          </div>

          <div className="h-[320px] overflow-y-auto border border-gray-100 rounded-lg p-3 bg-gray-50">
            {loading ? (
              <p className="text-sm text-gray-500">Generating…</p>
            ) : renderQuestions()}
          </div>
        </div>
      </div>
    </div>
  );
}
