// src/tools/VoiceToText.jsx
import React, { useState } from "react";
import ToolSkeleton from "./ToolSkeleton";
import { Mic } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

export default function VoiceToText() {
  const [audioFile, setAudioFile] = useState(null);
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { show: toast } = useToast();

  const handleUnauthorized = async () => {
    toast("Session expired — please login again", "error");
    await logout();
    const ret = encodeURIComponent(location.pathname + location.search);
    navigate(`/login?returnTo=${ret}`);
  };

  const externalSubmit = async (form, { setError, setResult, setLoading, push }) => {
    if (!audioFile) {
      const msg = "Please upload an audio file first.";
      setError(msg);
      push(msg, { type: "error" });
      return;
    }
    const fd = new FormData();
    fd.append("file", audioFile);
    fd.append("prompt", form.prompt || "Transcribe this audio.");
    try {
      const res = await api.post("/voice-to-text/", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const { ok, result, error } = res.data || {};
      if (!ok) {
        setError(error?.message || "Transcription failed");
        push(error?.message || "Transcription failed", { type: "error" });
        return;
      }
      const transcriptRaw = result?.transcript;
      const transcript = typeof transcriptRaw === "object" ? JSON.stringify(transcriptRaw, null, 2) : (transcriptRaw || "No transcription returned.");
      setResult(transcript);
      push("Done", { type: "info" });
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) {
        await handleUnauthorized();
        return;
      }
      const msg = e?.response?.data?.error?.message || e.message || "Failed";
      setError(msg);
      push(msg, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolSkeleton
      icon={Mic}
      title="Voice → Text (Speech Recognition)"
      subtitle="Upload an audio file and convert speech into text using AI."
      endpoint="/voice-to-text/"
      fields={[{ name: "prompt", label: "Instruction (optional)", type: "textarea", rows: 3, placeholder: "e.g. 'Transcribe exactly' or 'Summarize the audio'" }]}
      externalSubmit={externalSubmit}
      extraActions={<label className="text-xs cursor-pointer underline">Upload Audio<input type="file" accept="audio/*" className="hidden" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} /></label>}
    />
  );
}
