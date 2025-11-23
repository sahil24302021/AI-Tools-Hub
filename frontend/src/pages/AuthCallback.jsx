import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        // Supabase will parse the hash fragment implicitly on getSession
        await supabase?.auth?.getSession();
      } catch (_) {
        // ignore
      } finally {
        // Clear URL fragment to avoid blank hash page
        if (window.location.hash) {
          try { window.history.replaceState({}, document.title, window.location.pathname + window.location.search); } catch (_) {}
        }
        if (active) navigate("/dashboard", { replace: true });
      }
    })();
    return () => { active = false; };
  }, [navigate]);

  return (
    <div className="min-h-screen grid place-items-center text-gray-600">
      Loading...
    </div>
  );
}
