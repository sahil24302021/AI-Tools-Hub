import React from "react";

export default function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`backdrop-blur-md bg-white/30 border border-white/40 shadow-lg rounded-xl p-5 ${className}`}
    >
      {children}
    </div>
  );
}
