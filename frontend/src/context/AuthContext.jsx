import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until we know session

  // -----------------------------------------
  // INITIAL SESSION + LISTENER
  // -----------------------------------------
  useEffect(() => {
    let active = true;

    async function loadSession() {
      if (!isSupabaseConfigured || !supabase) {
        if (active) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const { data } = await supabase.auth.getSession();
        if (active) {
          setUser(data?.session?.user || null);
        }
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSession();

    // Listen for login / logout / refresh
    const sub = supabase?.auth?.onAuthStateChange?.((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      active = false;
      try {
        sub?.data?.subscription?.unsubscribe?.();
      } catch {
        // ignore
      }
    };
  }, []);

  // -----------------------------------------
  // AUTH FUNCTIONS
  // -----------------------------------------
  const login = async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Auth not configured");
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const register = async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Auth not configured");
    }
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const loginWithGoogle = async () => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Auth not configured");
    }
    const redirect = `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirect },
    });

    if (error) throw error;
  };

  const logout = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
