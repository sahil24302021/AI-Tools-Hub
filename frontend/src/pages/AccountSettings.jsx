// frontend/src/pages/AccountSettings.jsx
import React, { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

export default function AccountSettings() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!isSupabaseConfigured) return;

      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      const u = data?.session?.user || null;
      setUser(u);
      setEmail(u?.email || "");

      // displayName from metadata
      setDisplayName(
        u?.user_metadata?.full_name ||
          u?.user_metadata?.displayName ||
          ""
      );

      setAvatarPreview(u?.user_metadata?.avatar || "");
    })();

    return () => (mounted = false);
  }, []);

  // Upload avatar to Supabase storage
  const uploadAvatar = async () => {
    if (!avatarFile) return null;

    const filename = `avatars/${user.id}-${Date.now()}-${avatarFile.name}`;
    const bucket = supabase.storage.from("public");

    const { error } = await bucket.upload(filename, avatarFile, {
      upsert: true,
    });
    if (error) throw error;

    return bucket.getPublicUrl(filename).data.publicUrl;
  };

  // Save profile changes
  const onSave = async (e) => {
    e.preventDefault();
    setBusy(true);
    setStatus(null);

    try {
      let avatarUrl = null;

      if (avatarFile) {
        avatarUrl = await uploadAvatar();
      }

      const updates = {
        data: {
          full_name: displayName,
          avatar: avatarUrl || avatarPreview,
        },
      };

      const { error } = await supabase.auth.updateUser(updates);
      if (error) throw error;

      // Email change
      if (email && email !== user?.email) {
        const { error: e2 } = await supabase.auth.updateUser({ email });
        if (e2) throw e2;
      }

      setStatus("Profile updated successfully.");
      const session = await supabase.auth.getSession();
      setUser(session?.data?.session?.user);

      // refresh preview
      if (avatarUrl) setAvatarPreview(avatarUrl);
    } catch (err) {
      setStatus("Error: " + err.message);
    } finally {
      setBusy(false);
    }
  };

  // Password change
  const onChangePassword = async () => {
    const newPass = prompt("Enter new password:");
    if (!newPass) return;

    setBusy(true);
    setStatus(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPass,
      });
      if (error) throw error;

      setStatus("Password updated!");
    } catch (err) {
      setStatus("Error: " + err.message);
    } finally {
      setBusy(false);
    }
  };

  // Delete account
  const onDelete = async () => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;

    setBusy(true);
    setStatus(null);

    try {
      await supabase.auth.signOut();
      setStatus(
        "Account deleted (or signed out). Use your admin backend to fully remove user from DB."
      );
    } catch (err) {
      setStatus("Error: " + err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!user)
    return (
      <PageLayout title="Account Settings">
        <div className="text-sm text-gray-500">Loading…</div>
      </PageLayout>
    );

  return (
    <PageLayout title="Account Settings">
      <div className="space-y-10">

        {/* ---------------- PROFILE SECTION ---------------- */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

          <form onSubmit={onSave} className="space-y-5">

            {/* Avatar */}
            <div className="flex items-center gap-4">
              <img
                src={
                  avatarPreview ||
                  "https://ui-avatars.com/api/?name=User&background=ddd"
                }
                alt="avatar"
                className="h-16 w-16 rounded-full object-cover border"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setAvatarFile(file);
                  if (file) setAvatarPreview(URL.createObjectURL(file));
                }}
                className="text-sm"
              />
            </div>

            {/* Display name */}
            <div>
              <label className="text-sm font-medium">Display Name</label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2 text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium">Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Changing your email may require verification depending on settings.
              </p>
            </div>

            <button
              disabled={busy}
              type="submit"
              className="rounded bg-black text-white px-4 py-2 text-sm hover:opacity-90"
            >
              Save Changes
            </button>
          </form>
        </section>

        {/* ---------------- SECURITY SECTION ---------------- */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Security</h2>

          <button
            onClick={onChangePassword}
            disabled={busy}
            className="border px-4 py-2 rounded text-sm hover:bg-gray-50"
          >
            Change Password
          </button>
        </section>

        {/* ---------------- DANGER ZONE ---------------- */}
        <section className="border-t pt-6">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Danger Zone
          </h2>

          <button
            onClick={onDelete}
            disabled={busy}
            className="bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded text-sm hover:bg-red-100"
          >
            Delete Account
          </button>
        </section>

        {status && (
          <div className="text-sm font-medium text-gray-700">{status}</div>
        )}
      </div>
    </PageLayout>
  );
}
