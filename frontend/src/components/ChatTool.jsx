import React, { useState } from "react";
import api from "../lib/api";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function ChatTool() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("The assistant will reply here.");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { show } = useToast();

  const send = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/chat/", { messages: [{ role: "user", content: prompt }] });
      const { ok, result, error } = res.data || {};
      if (!ok) {
        const msg = error?.details || error?.message || "Chat request failed";
        setError(msg);
        setResponse(msg);
        return;
      }
      let reply = result?.message || "No response";
      if (typeof reply === "object") reply = JSON.stringify(reply, null, 2);
      setResponse(reply);
      setPrompt("");
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        show("Session expired — please login again", "error");
        await logout();
        const ret = encodeURIComponent(location.pathname + location.search);
        navigate(`/login?returnTo=${ret}`);
        return;
      }
      const apiErr = err?.response?.data?.error;
      const msg = apiErr?.details || apiErr?.message || err.message || "Chat request failed";
      setError(msg);
      setResponse(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">AI Chat</h3>
        </div>
        <p className="text-sm text-gray-600 mt-2">Chat with the model.</p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask anything..."
          className="w-full mt-4 h-40 p-3 border rounded-md resize-none"
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={send}
            disabled={loading}
            className="px-4 py-2 bg-black text-white rounded"
          >
            {loading ? "Generating…" : "Send"}
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 p-6">
  <h4 className="text-sm font-medium">Response {error && <span className="text-red-500">• {error}</span>}</h4>
        <div className="mt-3 p-3 border rounded h-64 overflow-auto bg-gray-50">
          <pre className="whitespace-pre-wrap text-sm">{response}</pre>
        </div>
      </div>
    </div>
  );
}
