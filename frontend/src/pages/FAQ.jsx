import React from "react";
import { useNavigate } from "react-router-dom";

export default function FAQ() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sticky top header */}
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

      {/* Page container */}
      <main className="px-4 sm:px-8 py-10">
        <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 max-w-4xl mx-auto">

          <header className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight mb-4">FAQ</h1>
            <p className="text-gray-600 leading-relaxed text-lg">
              Answers to common questions about privacy, billing, usage, and access.
            </p>
          </header>

          {/* FAQ SECTIONS */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3">Will my data be private?</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Yes. None of your tool inputs (chat, uploads, text, or files) are used to train
              any models. Your data always stays private and secure.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3">Can I cancel anytime?</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Absolutely. You can cancel your subscription anytime through the billing 
              portal. Your access stays active until the end of the billing period.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3">Do you store my uploaded files?</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              PDFs and images are processed temporarily for AI generation and then deleted.
              We do not store long-term copies of your files.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3">Is there a free plan?</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Yes! You can use basic tools for free with limited daily usage. Pro plans
              unlock higher limits and premium tools.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3">What payment methods are supported?</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              All major debit and credit cards are supported through secure Stripe processing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Need more help?</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Visit our{" "}
              <a href="/support" className="underline text-blue-600 hover:text-blue-800">
                Support page
              </a>{" "}
              or contact us directly for assistance.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
