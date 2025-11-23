// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
    })();
  }, []);

  if (!user)
    return (
      <PageLayout title="Profile">
        <div className="text-sm text-gray-500">Not signed in.</div>
      </PageLayout>
    );

  const avatar = user?.user_metadata?.avatar || "";
  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.displayName ||
    user?.email;

  return (
    <PageLayout title="Your Profile">
      <div className="space-y-10">

        {/* ------------------ PROFILE CARD ------------------ */}
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="h-24 w-24 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border">
            {avatar ? (
              <img
                src={avatar}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-3xl text-gray-400">
                {(name || "U").charAt(0)}
              </div>
            )}
          </div>

          {/* User Data */}
          <div>
            <div className="text-2xl font-semibold">{name}</div>
            <div className="text-sm text-gray-600">{user.email}</div>

            <div className="text-xs text-gray-400 mt-1">
              User ID: {user.id}
            </div>
            <div className="text-xs text-gray-400">
              Created:{" "}
              {user.created_at
                ? new Date(user.created_at).toLocaleString()
                : "—"}
            </div>
          </div>
        </div>

        {/* ------------------ QUICK LINKS ------------------ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/account"
            className="block p-4 border rounded-lg bg-white text-center hover:bg-gray-50 transition"
          >
            Account Settings
          </Link>

          <Link
            to="/usage"
            className="block p-4 border rounded-lg bg-white text-center hover:bg-gray-50 transition"
          >
            Usage History
          </Link>

          <Link
            to="/billing"
            className="block p-4 border rounded-lg bg-white text-center hover:bg-gray-50 transition"
          >
            Billing
          </Link>
        </div>

        {/* ------------------ PLAN INFO ------------------ */}
        <div className="p-4 border rounded-lg bg-white">
          <h3 className="text-lg font-semibold mb-2">Subscription</h3>
          <p className="text-gray-600 text-sm">
            Current Plan: <strong>Free</strong>  
            <br />
            (Backend plan lookup can replace this placeholder)
          </p>

          <Link
            to="/pricing"
            className="inline-block mt-3 text-sm px-4 py-2 rounded bg-black text-white hover:opacity-90"
          >
            Upgrade Plan
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
