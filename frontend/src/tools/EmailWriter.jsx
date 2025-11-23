// src/tools/EmailWriter.jsx
import React, { useState } from "react";
import api from "../lib/api";
import { Mail } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

// Standardized to ChatTool pattern
export default function EmailWriter() {
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState("Professional");
  const [details, setDetails] = useState("");
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
    if (!details.trim()) {
      toast("Provide details about the email", "error");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await api.post("/email-writer/", { purpose: subject || details, tone, details });
      const { ok, result, error } = res.data || {};
      if (!ok) {
        toast(error?.message || "Generation failed", "error");
        return;
      }
      const emailRaw = result?.email;
      const email = typeof emailRaw === "object" ? JSON.stringify(emailRaw, null, 2) : (emailRaw || "No email generated.");
      setOutput(email);
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
            <Mail className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold">AI Email Writer</h2>
          </div>
          <Link to="/dashboard" className="text-xs underline">Back</Link>
        </div>
        <p className="text-sm text-gray-600 mb-3">Generate professional emails from short instructions.</p>
        <input
          className="w-full rounded-lg border border-gray-300 p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Subject (Optional)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <select
          className="w-full rounded-lg border border-gray-300 p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-black/20"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          <option>Professional</option>
          <option>Friendly</option>
          <option>Formal</option>
          <option>Casual</option>
          <option>Persuasive</option>
          <option>Apologetic</option>
        </select>
        <textarea
          className="w-full rounded-lg border border-gray-300 p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Explain what the email is about..."
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
        <div className="mt-3 flex justify-end">
          <button
            onClick={generate}
            disabled={loading}
            className="rounded-lg bg-black text-white px-3 py-2 text-sm hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Generating…" : "Generate Email"}
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 flex flex-col">
        <div className="text-sm text-gray-600 mb-1">Generated Email</div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm whitespace-pre-wrap min-h-[200px] flex-1 text-gray-800">
          {output || (loading ? "Generating…" : "Your generated email will appear here.")}
        </div>
      </div>
    </div>
  );
}
