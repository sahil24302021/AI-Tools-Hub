import React from "react";

export default function GradientTitle({ children }) {
  return (
    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
      {children}
    </h1>
  );
}
