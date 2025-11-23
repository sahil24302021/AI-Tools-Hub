import React from "react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto py-4 px-4 sm:px-6 flex items-center justify-between">
          <span className="text-base font-semibold">AI Tools Hub</span>

          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-600 hover:text-black transition"
          >
            Back
          </button>
        </div>
      </div>

      {/* Page Wrapper */}
      <main className="px-4 sm:px-8 py-10">
        <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 max-w-4xl mx-auto">

          {/* Title */}
          <h1 className="text-4xl font-bold tracking-tight mb-6">Privacy Policy</h1>

          <p className="text-gray-600 leading-relaxed text-lg mb-10">
            This is a placeholder Privacy Policy for AI Tools Hub. Replace this text with
            your actual legal copy before launching.
          </p>

          {/* Sections */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3">Data We Collect</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-3">
              We collect minimal information required to operate the service:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-gray-600 text-lg">
              <li>Account information (email, authentication data)</li>
              <li>Usage logs to improve tool performance</li>
              <li>Billing metadata for paid plans</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3">How We Use Data</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-3">
              Your data is used strictly for:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-gray-600 text-lg">
              <li>Providing access to AI tools</li>
              <li>Improving performance and reliability</li>
              <li>Processing payments and subscriptions</li>
              <li>Preventing fraud or abuse</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3">Third Parties</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-3">
              We use reputable third-party services:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-gray-600 text-lg">
              <li><strong>Stripe</strong> — billing & payment processing</li>
              <li><strong>Supabase</strong> — authentication, database, sessions</li>
              <li><strong>OpenAI</strong> — AI model inference</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3">Your Rights</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              You may request deletion of your account or exported data at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Updates</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              This policy may be updated as the platform evolves. Significant changes
              will be communicated to users.
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}
