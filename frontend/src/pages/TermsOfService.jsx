import React from "react";
import { useNavigate } from "react-router-dom";

export default function TermsOfService() {
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

      {/* Page Content */}
      <main className="px-4 sm:px-8 py-10">
        <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 max-w-4xl mx-auto">

          {/* Header */}
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            Terms of Service
          </h1>

          <p className="text-gray-600 leading-relaxed text-lg mb-10">
            These are placeholder terms. Replace with a real, legally reviewed Terms of Service 
            before launching your product.
          </p>

          {/* Sections */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3">Use of Service</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              You agree not to abuse system rate limits, attack the platform, or attempt 
              to reverse-engineer any internal models or backend logic.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3">Subscriptions</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Paid subscriptions automatically renew unless canceled through the customer 
              billing portal. Refunds are subject to platform policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Liability</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              The service is provided “as is” without warranties of any kind. Liability is 
              limited to the maximum extent permitted by law.
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}
