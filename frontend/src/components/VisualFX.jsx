import React from "react";

export default function VisualFX({ children, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/0 to-white/50 mix-blend-soft-light" />
      {children}
    </div>
  );
}
