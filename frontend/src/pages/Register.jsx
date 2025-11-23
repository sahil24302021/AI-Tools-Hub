import React, { useState } from "react";
import { useNavigate, useLocation, Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const returnTo = params.get("returnTo");
  const redirectTo = returnTo || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // If already logged in, do NOT show register page
  if (!loading && user) {
    return <Navigate to={redirectTo} replace />;
  }

  const onRegister = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await register(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black grid place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
          <h1 className="text-xl font-semibold mb-1">Create an account</h1>
          <p className="text-sm text-gray-600 mb-4">Get started with AI Tools Hub</p>

          {/* Form */}
          <form onSubmit={onRegister} className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-black/20"
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-black/20"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-black/20"
            />

            {error && (
              <div className="text-sm text-red-600" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-black text-white px-3 py-2 text-sm
                         hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Creating…" : "Create Account"}
            </button>
          </form>

          {/* Existing account */}
          <div className="mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to={`/login${
                returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""
              }`}
              className="underline"
            >
              Sign in
            </Link>
          </div>

          {/* Back to home */}
          <div className="mt-2 text-xs text-gray-600">
            <Link to="/" className="underline">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
