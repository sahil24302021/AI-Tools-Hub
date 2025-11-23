// frontend/src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const redirect = `${window.location.origin}/reset-password`; // Redirect URL after email link
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirect,
      });

      if (error) throw error;

      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Forgot Password</h1>

      {sent ? (
        <div className="text-sm text-green-600">
          Password reset link sent to your email.
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="you@example.com"
            />
          </div>

          {error && <div className="text-xs text-red-600">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black text-white py-2 text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      )}
    </div>
  );
}
