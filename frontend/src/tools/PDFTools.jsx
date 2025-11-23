// src/tools/PDFTools.jsx
import React, { useState } from "react";
import api from "../lib/api";
import { FileText } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function PDFTools() {
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { show: toast } = useToast();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f && f.type === "application/pdf") {
      setFile(f);
    } else {
      toast("Please upload a valid PDF file", "error");
    }
  };

  const handleUnauthorized = async () => {
    toast("Session expired — please login again", "error");
    await logout();
    const ret = encodeURIComponent(location.pathname + location.search);
    navigate(`/login?returnTo=${ret}`);
  };

  const processPDF = async () => {
    if (!file) return;
    setLoading(true);
    setOutput("");
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await api.post("/pdf-tools/", form, { headers: { "Content-Type": "multipart/form-data" } });
      const { ok, result, error } = res.data || {};
      if (!ok) {
        toast(error?.message || "Processing failed", "error");
        return;
      }
      const raw = result?.text;
      const text = typeof raw === "object" ? JSON.stringify(raw, null, 2) : (raw || "No output generated.");
      setOutput(text);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) {
        await handleUnauthorized();
        return;
      }
      const msg = e?.response?.data?.error?.message || e.message || "PDF processing failed";
      toast(msg, "error");
      setOutput(`⚠️ ${msg}`);
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
            <FileText className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold">AI PDF Tools</h2>
          </div>
          <Link to="/dashboard" className="text-xs underline">Back</Link>
        </div>

        <p className="text-sm text-gray-600 mb-3">
          Upload a PDF to extract text, summarize, or analyze content.
        </p>

        {/* Upload */}
        {!file ? (
          <label className="cursor-pointer flex flex-col items-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
            <span className="text-gray-600">Click to upload a PDF file</span>
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFile}
            />
          </label>
        ) : (
          <div className="flex flex-col items-center text-center">
            <p className="mb-3 font-medium">{file.name}</p>
            <button
              className="text-sm text-red-500 hover:underline mb-2"
              onClick={() => setFile(null)}
            >
              Remove PDF
            </button>
          </div>
        )}

        {/* Process */}
        <button
          onClick={processPDF}
          disabled={!file || loading}
          className="mt-4 px-4 py-2 bg-black text-white rounded-lg text-sm disabled:opacity-50"
        >
          {loading ? "Generating…" : "Process PDF"}
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
        <div className="text-sm text-gray-600 mb-1">Result</div>

        <div className="rounded-lg border border-gray-200 bg-white p-3 min-h-[200px] whitespace-pre-wrap text-gray-800">
          {loading ? "Generating…" : output || "Upload a PDF to view the output here."}
        </div>
      </div>

    </div>
  );
}
