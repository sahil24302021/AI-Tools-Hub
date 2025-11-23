// frontend/src/pages/About.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function About() {
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

      {/* Content */}
      <main className="px-4 sm:px-8 py-10">
        <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 max-w-4xl mx-auto">

          {/* Header */}
          <header className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight mb-4">About AI Tools Hub</h1>
            <p className="text-gray-600 leading-relaxed text-lg">
              AI Tools Hub is an all-in-one platform designed to accelerate learning,
              productivity, and creativity through modular AI-powered tools that work
              seamlessly together.
            </p>
          </header>

          {/* Mission */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Our mission is to empower students, developers, creators, and teams with
              reliable, privacy-friendly AI tools that help them work smarter—not harder.
            </p>
          </section>

          {/* Who it's for */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3">Who We Built This For</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 text-lg">
              <li>Students looking for study notes, summaries, and research assistance</li>
              <li>Developers needing faster debugging and code generation</li>
              <li>Professionals drafting emails, blogs, and content</li>
              <li>Teams collaborating on AI-assisted tasks</li>
            </ul>
          </section>

          {/* Tech Stack */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3">Technology Stack</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-3">
              Our platform uses a modern, scalable, and secure tech foundation:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 text-lg">
              <li>React + Vite + Tailwind — fast and optimized frontend</li>
              <li>Supabase — authentication, database, and user sessions</li>
              <li>Python / Flask backend — reliable API layer</li>
              <li>Stripe — secure payment processing</li>
              <li>OpenAI + Vision AI — advanced text & image intelligence</li>
            </ul>
          </section>

          {/* Values */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">Our Values</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 text-lg">
              <li><strong>Privacy First:</strong> Your data is never used to train models.</li>
              <li><strong>Transparency:</strong> Clear pricing, no hidden rules.</li>
              <li><strong>Speed:</strong> Tools that deliver results instantly.</li>
              <li><strong>Reliability:</strong> Built for real work, not gimmicks.</li>
            </ul>
          </section>

        </div>
      </main>
    </div>
  );
}
