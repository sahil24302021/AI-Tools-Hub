// frontend/src/pages/Contact.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Contact() {
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
            <h1 className="text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
            <p className="text-gray-600 leading-relaxed text-lg">
              Have questions, feedback, or need help? We’re here for you.  
              Reach out anytime and our team will get back to you as soon as possible.
            </p>
          </header>

          {/* Support Email */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3">Support Email</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              For general issues, troubleshooting, or account help:
            </p>
            <div className="mt-3 p-4 bg-gray-100 rounded-xl text-lg font-medium text-gray-800">
              support@example.com
            </div>
          </section>

          {/* Feedback */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3">Feedback & Improvements</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              We actively improve AI Tools Hub every week.  
              If you have ideas, requests, or want to report bugs, send them anytime:
            </p>
            <div className="mt-3 p-4 bg-gray-100 rounded-xl text-lg font-medium text-gray-800">
              feedback@example.com
            </div>
          </section>

          {/* Business */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">Business & Partnerships</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              For collaborations, team plans, integrations, or licensing:
            </p>
            <div className="mt-3 p-4 bg-gray-100 rounded-xl text-lg font-medium text-gray-800">
              business@example.com
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
