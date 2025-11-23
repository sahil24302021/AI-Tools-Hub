import React from "react";

export default function LoadingSpinner({ size = 28 }) {
  return (
    <div
      className="animate-spin rounded-full border-2 border-gray-400 border-t-black"
      style={{ height: size, width: size }}
    />
  );
}
