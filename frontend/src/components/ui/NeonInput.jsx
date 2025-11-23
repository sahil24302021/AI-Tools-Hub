import React from "react";

export default function NeonInput({ className = "", ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 rounded-lg border border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.7)] text-white bg-black/70 focus:outline-none ${className}`}
      {...props}
    />
  );
}
