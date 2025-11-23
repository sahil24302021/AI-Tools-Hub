import React from "react";
import { useNavigate } from "react-router-dom";

export default function Support() {
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
            <h1 className="text-4xl font-bold tracking-tight mb-4">Support</h1>
            <p className="text-gray-600 leading-relaxed text-lg">
              Free users get basic support via email. Pro customers receive priority support,
              faster responses, and extended help for tool-related issues.
            </p>
          </header>

          {/* Common Issues */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3">Common Issues</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 text-lg">
              <li>
                <strong>Tool timeout:</strong> Wait 30 seconds and try again. Slow internet
                or large file input may cause delays.
              </li>
              <li>
                <strong>Session expired:</strong> Log in again to refresh your session.
              </li>
              <li>
                <strong>File upload failure:</strong> Ensure your PDF/image is not corrupted
                and under the max size limit.
              </li>
              <li>
                <strong>Payment issues:</strong> Check if your card supports international
                online transactions (Stripe requires this).
              </li>
            </ul>
          </section>

          {/* Contact Info */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">Need More Help?</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              If your issue persists, you can reach out anytime at:
            </p>
            <p className="mt-3 text-lg font-medium text-blue-600 underline">
              support@aitoolshub.com
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}
