import React from "react";

export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-sm ${className}`}
      {...props}
    />
  );
}
