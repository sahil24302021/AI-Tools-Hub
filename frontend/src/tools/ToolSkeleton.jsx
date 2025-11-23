// src/tools/ToolSkeleton.jsx
import React, { useState } from "react";
import api from "../lib/api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

/**
 * ToolSkeleton
 * Reusable layout for ALL tools.
 *
 * Props:
 * - icon: Icon component (Lucide)
 * - title: string
 * - subtitle: string
 * - endpoint: backend route (e.g. "/chat", "/seo", "/summarize")
 * - fields: array of form fields
 *   { name, placeholder, type: "text" | "textarea" | "number", label }
 * - transform?: fn(result) to modify output
 */
export default function ToolSkeleton({
  icon: Icon,
  title,
  subtitle,
  endpoint,
  fields = [{ name: "input", placeholder: "Enter text...", label: "Input", type: "textarea" }],
  transform,
}) {
  const [form, setForm] = useState(() =>
    Object.fromEntries(fields.map((f) => [f.name, ""]))
  );

  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { show: toast } = useToast();

  const updateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    const primary = fields[0].name;
    if (!form[primary]?.trim()) return;
    setLoading(true);
    setOutput("");
    try {
      const res = await api.post(endpoint.endsWith("/") ? endpoint : `${endpoint}/`, form);
      const { ok, result, error } = res.data || {};
      if (!ok) {
        toast(error?.message || "Request failed", "error");
        setOutput("");
        setLoading(false);
        return;
      }
      let finalResult = transform ? transform(result) : result;
      if (finalResult && typeof finalResult === "object") {
        finalResult = JSON.stringify(finalResult, null, 2);
      }
      setOutput(finalResult || "No result.");
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) {
        toast("Session expired — please login again", "error");
        await logout();
        navigate(`/login?returnTo=${encodeURIComponent(location.pathname)}`);
        return;
      }
      const msg = e?.response?.data?.error?.message || e?.message || "Something went wrong";
      toast(msg, "error");
      setOutput(msg);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setForm(Object.fromEntries(fields.map((f) => [f.name, ""])));
    setOutput("");
  };

  return (
    <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-4">

      {/* LEFT SIDE (FORM) */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 text-gray-700" />}
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          <Link to="/dashboard" className="text-xs underline">Back</Link>
        </div>

        <p className="text-sm text-gray-600 mb-3">{subtitle}</p>

        {fields.map((f) => (
          <div key={f.name} className="mb-3">
            <label className="block text-xs font-medium mb-1">{f.label}</label>
            {f.type === "textarea" ? (
              <textarea
                name={f.name}
                placeholder={f.placeholder}
                value={form[f.name]}
                onChange={updateField}
                className="w-full rounded-lg border border-gray-300 p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            ) : (
              <input
                name={f.name}
                type={f.type || "text"}
                placeholder={f.placeholder}
                value={form[f.name]}
                onChange={updateField}
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            )}
          </div>
        ))}

        <div className="flex gap-2 mt-3 justify-end">
          <button
            onClick={submit}
            disabled={loading}
            className="rounded-lg bg-black text-white px-3 py-2 text-sm hover:opacity-90"
          >
            {loading ? "Working…" : "Run"}
          </button>

          <button
            onClick={reset}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
          >
            Clear
          </button>
        </div>
      </div>

      {/* RIGHT SIDE (RESULT) */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">

        <div className="text-sm text-gray-600 mb-2">Output</div>

        <div className="rounded-lg border border-gray-200 bg-white p-3 min-h-[180px] whitespace-pre-wrap text-gray-800 overflow-y-auto">
          {loading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-4/5"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-2/4"></div>
            </div>
          ) : output ? (
            output
          ) : (
            <div className="text-gray-400">Your result will appear here.</div>
          )}
        </div>
      </div>

    </div>
  );
}
