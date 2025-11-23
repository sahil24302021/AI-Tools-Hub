// frontend/src/pages/Changelog.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Changelog() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto py-4 px-4 sm:px-6 flex items-center justify-between">
          <div className="text-base font-semibold">AI Tools Hub</div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-600 hover:text-black transition"
          >
            Back
          </button>
        </div>
      </div>

      {/* Page Content */}
      <main className="px-4 sm:px-8 py-10">
        <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 max-w-4xl mx-auto">

          {/* Header */}
          <header className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Changelog</h1>
            <p className="text-gray-600 leading-relaxed text-lg">
              A historical record of improvements, bug fixes, and product updates to AI Tools Hub.
            </p>
          </header>

          {/* VERSION SECTION */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mt-6 mb-3">v0.3.0 — UI Polishing Update</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 text-lg">
              <li>Redesigned all static pages (Privacy, Terms, Support, FAQ, etc.)</li>
              <li>Added consistent sticky header with Back button</li>
              <li>Improved spacing, responsiveness, and readability across the app</li>
              <li>Standardized typography system (H1, H2, body text, lists)</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mt-6 mb-3">v0.2.0 — Tools & Routing Update</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 text-lg">
              <li>Added Chat, Resume Builder, Quiz Maker, Notes Maker, PDF Tools</li>
              <li>Enhanced ProtectedRoute authentication wrapper</li>
              <li>Improved AppLayout with sidebar, navbar, and content outlet</li>
              <li>Added loading fallback + error boundaries</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-6 mb-3">v0.1.0 — Initial Launch</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 text-lg">
              <li>Initial SaaS scaffold with routing & authentication</li>
              <li>Unified ToolPage architecture added</li>
              <li>18 AI tools integrated with backend APIs</li>
              <li>Supabase Auth + JWT backend integration</li>
              <li>Stripe billing structure prepared for Pro plans</li>
            </ul>
          </section>

        </div>
      </main>
    </div>
  );
}
