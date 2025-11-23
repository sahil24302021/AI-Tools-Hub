import React from "react";

export default function PageHeader() {
  return (
    <header className="w-full bg-white border-b">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-3 px-4 sm:px-6">
        <h1 className="text-xl font-semibold">AI Tools Hub</h1>

        <button
          onClick={() => window.history.back()}
          className="text-gray-600 hover:text-black transition"
        >
          Back
        </button>
      </div>
    </header>
  );
}
