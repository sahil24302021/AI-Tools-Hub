// frontend/src/pages/Pricing.jsx
import React from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    features: ["Basic tools", "Community access"],
    action: null,
  },
  {
    id: "pro-monthly",
    name: "Pro Monthly",
    price: "$19/mo",
    price_id: "price_pro_monthly",
    features: ["All tools", "Higher usage limits", "Priority support"],
    action: "subscribe",
  },
  {
    id: "pro-yearly",
    name: "Pro Yearly",
    price: "$190/yr",
    price_id: "price_pro_yearly",
    features: ["All tools", "Higher usage limits", "Priority support", "2 months free"],
    action: "subscribe",
  },
];

export default function Pricing() {
  const navigate = useNavigate();

  const createSession = async (price_id) => {
    try {
      const { data } = await api.post("/billing/create-checkout-session", { price_id });
      if (data.result?.url) window.location.href = data.result.url;
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to start checkout. Check console.");
    }
  };

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

      {/* Page container */}
      <main className="px-4 sm:px-8 py-10">
        <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 max-w-5xl mx-auto mt-12">

          {/* Header */}
          <header className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Pricing</h1>
            <p className="text-gray-600 leading-relaxed text-lg">
              Simple, transparent plans. Start free — upgrade anytime for more power and higher limits.
            </p>
          </header>

          {/* Pricing Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="border border-gray-200 rounded-2xl p-6 bg-white shadow-md flex flex-col"
              >
                <h2 className="text-2xl font-semibold">{plan.name}</h2>

                <div className="text-4xl font-bold mt-3">{plan.price}</div>

                <ul className="mt-6 space-y-2 text-gray-600 text-lg list-disc pl-6">
                  {plan.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>

                {plan.action ? (
                  <button
                    onClick={() => createSession(plan.price_id)}
                    className="mt-6 w-full rounded-xl bg-black text-white py-2.5 text-sm font-medium hover:opacity-90 transition"
                  >
                    Upgrade Now
                  </button>
                ) : (
                  <div className="mt-6 w-full text-center py-2.5 text-sm text-gray-500 border border-gray-200 rounded-xl">
                    Current Plan
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
