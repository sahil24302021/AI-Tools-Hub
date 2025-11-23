import React from "react";

export default function GlowButton({ children, className = "", ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-lg text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_12px_rgba(139,92,246,0.6)] hover:shadow-[0_0_20px_rgba(139,92,246,0.9)] transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
