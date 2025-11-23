import React from "react";
import { useNavigate } from "react-router-dom";

export default function Roadmap() {
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
            <h1 className="text-4xl font-bold tracking-tight mb-4">Product Roadmap</h1>
            <p className="text-gray-600 leading-relaxed text-lg">
              A transparent view of the features and improvements coming soon to AI Tools Hub.
            </p>
          </header>

          {/* Roadmap Sections */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3">Q1 — Core Enhancements</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 text-lg">
              <li>Team workspaces for shared projects</li>
              <li>Improved chat memory & context window</li>
              <li>Optimized PDF & document parsing pipeline</li>
              <li>Usage analytics dashboard for users</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3">Q2 — Intelligence Upgrade</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 text-lg">
              <li>Fine-tuned domain models (education, coding, business)</li>
              <li>Smarter code generation & debugging tools</li>
              <li>AI-assisted long-form research workflows</li>
              <li>Better multilingual support across tools</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Q3 — Community Expansion</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 text-lg">
              <li>Marketplace for community prompts</li>
              <li>Template sharing for study notes & quizzes</li>
              <li>Public profiles for top creators</li>
              <li>Collaborative AI tool packs</li>
            </ul>
          </section>

        </div>
      </main>
    </div>
  );
}
