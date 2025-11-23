// frontend/src/components/layout/PageLayout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function PageLayout({ title, children, back = true }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-base font-semibold">AI Tools Hub</div>

          {back && (
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-gray-600 hover:text-black"
            >
              Back
            </button>
          )}
        </div>
      </div>

      {/* Page Container */}
      <div className="max-w-4xl mx-auto mt-12 px-4 sm:px-6">
        <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-10">
          {title && (
            <h1 className="text-4xl font-bold tracking-tight mb-6">{title}</h1>
          )}

          <div className="text-gray-700 leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
