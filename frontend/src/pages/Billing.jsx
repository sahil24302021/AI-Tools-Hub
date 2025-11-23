// frontend/src/pages/Billing.jsx
import React, { useEffect, useState } from "react";
import api from "../lib/api";

export default function Billing() {
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load subscription status
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await api.get("/billing/status/");
        const { ok, result, error } = res.data || {};
        if (alive) {
          if (!ok) {
            setSub(null);
            setError(error?.message || "Failed to load billing status");
          } else {
            setSub(result || null);
          }
        }
      } catch (err) {
        if (alive) setError(err?.response?.data?.error || err.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const openPortal = async () => {
    setError(null);
    try {
      const res = await api.post("/billing/portal/");
      const { ok, result, error } = res.data || {};
      if (!ok) {
        setError(error?.message || "Could not open billing portal.");
        return;
      }
      const redirectUrl = result?.url;

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        setError("Could not open billing portal.");
      }
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-2xl font-semibold">Billing</h1>

      {loading && (
        <div className="text-sm text-gray-500">Loading billing status...</div>
      )}

      {error && <div className="text-xs text-red-600">{error}</div>}

      {sub && (
        <div className="text-sm space-y-2 border rounded-md p-3 bg-gray-50">
          <div>
            <span className="font-medium">Plan:</span>{" "}
            {sub.plan || "Free"}
          </div>

          <div>
            <span className="font-medium">Status:</span>{" "}
            {sub.status || "unknown"}
          </div>

          {sub.current_period_end && (
            <div>
              <span className="font-medium">Renews:</span>{" "}
              {new Date(sub.current_period_end * 1000).toLocaleDateString()}
            </div>
          )}
        </div>
      )}

      <button
        onClick={openPortal}
        className="rounded-md bg-black text-white px-4 py-2 text-sm"
      >
        Open Customer Portal
      </button>
    </div>
  );
}
