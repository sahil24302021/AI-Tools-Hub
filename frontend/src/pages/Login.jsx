import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

export default function Login() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const returnTo = params.get("returnTo") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // If already logged in, don't show login page
  if (!loading && user) {
    return <Navigate to={returnTo} replace />;
  }

  // -----------------------------------
  // EMAIL + PASSWORD LOGIN
  // -----------------------------------
  const onLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await login(email, password);
      navigate(returnTo, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  // -----------------------------------
  // GOOGLE LOGIN
  // -----------------------------------
  const onGoogle = async () => {
    setSubmitting(true);
    setError("");

    try {
      if (!isSupabaseConfigured || !supabase) {
        throw new Error("Supabase is not configured. Check .env");
      }

      const redirectTo = `${window.location.origin}/auth/callback`;
      // eslint-disable-next-line no-console
      console.debug("Google OAuth redirect:", redirectTo);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });

      if (error) throw error;
      // Supabase will redirect away
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Google OAuth error:", err);
      setError(err.message || "Google login failed");
      setSubmitting(false);
    }
  };

  useEffect(() => {
    // returning from OAuth is handled by AuthContext + AuthCallback
  }, []);

  return (
    <div className="min-h-screen bg-white text-black grid place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
          <h1 className="text-xl font-semibold mb-1">Welcome back</h1>
          <p className="text-sm text-gray-600 mb-4">Sign in to your account</p>

          {/* EMAIL / PASSWORD FORM */}
          <form onSubmit={onLogin} className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
            />

            {error && (
              <div className="text-sm text-red-600" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-black text-white px-3 py-2 text-sm hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="my-3 text-center text-xs text-gray-500">
            OR CONTINUE WITH
          </div>

          {/* GOOGLE LOGIN */}
          <button
            onClick={onGoogle}
            disabled={submitting}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm flex items-center justify-center gap-2 hover:bg-gray-50 disabled:opacity-50"
          >
            Google
          </button>

          {/* FOOTER LINKS */}
          <div className="mt-4 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to={`/register${
                returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""
              }`}
              className="underline"
            >
              Sign up
            </Link>
          </div>

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
