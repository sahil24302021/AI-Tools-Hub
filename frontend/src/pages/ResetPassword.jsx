import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Reset Password</h1>

      {done ? (
        <div className="text-sm text-green-600">
          Password updated. You can close this tab.
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs mb-1">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          {error && <div className="text-xs text-red-600">{error}</div>}

          <button
            disabled={loading}
            className="w-full rounded-md bg-black text-white py-2 text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Saving..." : "Update password"}
          </button>
        </form>
      )}
    </div>
  );
}
