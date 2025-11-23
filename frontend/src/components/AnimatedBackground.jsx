import React from "react";

export default function AnimatedBackground({ children }) {
  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-pink-200 to-indigo-200 opacity-20 blur-3xl transform rotate-45" />
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
