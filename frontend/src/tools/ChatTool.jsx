// src/tools/ChatTool.jsx
import React, { useState, useRef, useEffect } from "react";
import api from "../lib/api";
import { MessageSquare } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function ChatTool() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const bottomRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { show } = useToast();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const t = setTimeout(() => setInitializing(false), 350);
    return () => clearTimeout(t);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.post("/chat/", { messages: [...messages, userMessage] });
      const { ok, result, error } = res.data || {};
      if (!ok) {
        const msg = error?.details || error?.message || "Chat request failed";
        show(msg, "error");
        return;
      }
      const reply = result?.message || "No response";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
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
      show(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="mx-auto max-w-4xl h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-gray-700" />
          <h1 className="text-lg font-semibold">AI Chat Assistant</h1>
        </div>
        <Link to="/dashboard" className="text-xs underline">Back</Link>
      </div>

      <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-sm p-4 space-y-4">
        {initializing && (
          <div className="space-y-3 animate-pulse">
            <div className="w-40 h-5 bg-gray-200 rounded" />
            <div className="w-64 h-4 bg-gray-200 rounded" />
            <div className="w-52 h-4 bg-gray-200 rounded" />
          </div>
        )}

        {!initializing && messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] p-3 rounded-lg whitespace-pre-wrap text-sm ${
              msg.role === "user"
                ? "ml-auto bg-black text-white"
                : "mr-auto bg-gray-100 text-gray-800"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="mr-auto bg-gray-100 text-gray-700 p-3 rounded-lg text-sm">
            Generating…
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="mt-3 flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          placeholder="Ask anything…"
          className="flex-1 rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="rounded-lg bg-black text-white px-4 py-2 text-sm hover:opacity-90 disabled:opacity-50 h-fit"
        >
          {loading ? "Generating…" : "Send"}
        </button>
      </div>
    </div>
  );
}
