// src/tools/VisionTool.jsx
import React, { useState } from "react";
import ToolSkeleton from "./ToolSkeleton";
import { Eye } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function VisionTool() {
  const [file, setFile] = useState(null);

  // Custom submission for vision (file upload)
  const { logout } = useAuth();
  const { show: toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const handleUnauthorized = async () => {
    toast("Session expired — please login again", "error");
    await logout();
    const ret = encodeURIComponent(location.pathname + location.search);
    navigate(`/login?returnTo=${ret}`);
  };

  const externalSubmit = async (form, { setError, setResult, setLoading, push }) => {
    if (!file) {
      setError("Please upload an image first.");
      push("Upload an image", { type: "error" });
      return;
    }

    const fd = new FormData();
    fd.append("file", file);
    fd.append("prompt", form.prompt || "Describe this image");

    try {
      const res = await api.post("/vision/", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const { ok, result, error } = res.data || {};
      if (!ok) {
        setError(error?.message || "Vision analysis failed");
        push(error?.message || "Vision analysis failed", { type: "error" });
        return;
      }
      const raw = result?.text;
      const text = typeof raw === "object" ? JSON.stringify(raw, null, 2) : (raw || "No result.");
      setResult(text);
      push("Done", { type: "info" });
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) {
        await handleUnauthorized();
        return;
      }
      const msg = e?.response?.data?.error?.message || e.message || "Vision error";
      setError(msg);
      push(msg, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolSkeleton
      icon={Eye}
      title="AI Vision Tool"
      subtitle="Analyze images, detect objects, extract text, and get smart AI insights."
  endpoint="/vision/"
      fields={[
        {
          name: "prompt",
          label: "Prompt/Instruction",
          type: "textarea",
          placeholder: "Describe what you want the AI to analyze...",
        },
      ]}
      externalSubmit={externalSubmit}
      extraActions={
        <label className="text-xs cursor-pointer underline">
          Upload Image
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>
      }
  transform={(r) => (typeof r?.text === 'object' ? JSON.stringify(r.text, null, 2) : (r?.text || (typeof r === 'string' ? r : '')))}
      onBeforeSubmit={() => true}
    />
  );
}
