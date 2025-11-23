// src/tools/ResumeBuilder.jsx
import React, { useState } from "react";
import api from "../lib/api";
import { FileText } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function ResumeBuilder() {
  const [jobTitle, setJobTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState("");
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

  const generateResume = async () => {
    if (!jobTitle.trim()) return;
    setLoading(true);
    setOutput("");
    try {
      const payload = {
        role: jobTitle.trim(),
        experience: experience.trim(),
        skills: skills ? skills.split(",").map(s => s.trim()).filter(Boolean) : [],
        education: education.trim() || undefined,
      };
      const res = await api.post("/resume/", payload);
      const { ok, result, error } = res.data || {};
      if (!ok) {
        show(error?.message || "Generation failed", "error");
        return;
      }
      const raw = result?.resume;
      const resume = typeof raw === "object" ? JSON.stringify(raw, null, 2) : (raw || "No resume generated.");
      setOutput(resume);
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
      {/* LEFT SIDE: Inputs */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold">AI Resume Builder</h2>
          </div>
          <Link to="/dashboard" className="text-xs underline">Back</Link>
        </div>

        <p className="text-sm text-gray-600 mb-4">Generate a professional resume tailored to your role.</p>

        <input
          className="w-full rounded-lg border border-gray-300 p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Job Title (e.g., React Native Developer)"
          aria-label="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />

        <textarea
          className="w-full rounded-lg border border-gray-300 p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Experience (describe your work)"
          aria-label="Experience"
          rows={4}
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />

        <textarea
          className="w-full rounded-lg border border-gray-300 p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Skills (comma-separated)"
          aria-label="Skills"
          rows={3}
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <textarea
          className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Education (your background)"
          aria-label="Education"
          rows={3}
          value={education}
          onChange={(e) => setEducation(e.target.value)}
        />

        <div className="mt-3 flex justify-end">
          <button
            onClick={generateResume}
            disabled={loading}
            className="rounded-lg bg-black text-white px-3 py-2 text-sm hover:opacity-90"
          >
            {loading ? "Creating..." : "Generate Resume"}
          </button>
        </div>
      </div>

      {/* RIGHT SIDE: Output */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
        <div className="text-sm text-gray-600 mb-1">Generated Resume</div>
        <div className="rounded-lg border border-gray-200 bg-white p-3 min-h-[200px] whitespace-pre-wrap text-gray-800 leading-relaxed">
          {output || (loading ? "Creating..." : "Your generated resume will appear here.")}
        </div>
      </div>
    </div>
  );
}
