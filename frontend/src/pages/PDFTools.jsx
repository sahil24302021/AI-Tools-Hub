import React, { useState } from "react";
import api from "../lib/api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function PDFTools() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { show: toast } = useToast();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) setFile(f);
  };

  const processPDF = async () => {
    if (!file) return;

    setLoading(true);
  setResult("");
  setError(null);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await api.post("/pdf-tools/", form, { headers: { "Content-Type": "multipart/form-data" } });
      const { ok, result, error } = res.data || {};
      if (!ok) {
        toast(error?.message || "PDF processing failed", "error");
        return;
      }
      let out = result?.text;
      if (typeof out === "object") out = JSON.stringify(out, null, 2);
      setResult(out || "No text returned.");
    } catch (e) {
      // Unauthenticated → redirect
      if (e?.response?.status === 401) {
        toast("Session expired — please login again", "error");
        await logout();
        const ret = encodeURIComponent(location.pathname + location.search);
        navigate(`/login?returnTo=${ret}`);
        return;
      }

  const msg = e?.response?.data?.error?.message || e.message || "PDF error";
  setError(msg);
  setResult(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">

      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">PDF Tools</h1>
        <Link to="/dashboard" className="text-xs underline">
          Back
        </Link>
      </div>

      {/* Upload Box */}
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        {!file ? (
          <label className="cursor-pointer flex flex-col items-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition text-center">
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
            <p className="mb-2 font-medium">{file.name}</p>
            <button
              onClick={() => setFile(null)}
              className="text-sm text-red-500 hover:underline mb-2"
            >
              Remove PDF
            </button>
          </div>
        )}

        <button
          onClick={processPDF}
          disabled={!file || loading}
          className="mt-4 px-4 py-2 bg-black text-white rounded-lg disabled:opacity-50 hover:opacity-90"
        >
          {loading ? "Generating…" : "Process PDF"}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 whitespace-pre-line">
          <h2 className="font-semibold mb-2">Result {error && <span className="text-red-500">• {error}</span>}</h2>
          <p className="text-gray-700">{result}</p>
        </div>
      )}
    </div>
  );
}
