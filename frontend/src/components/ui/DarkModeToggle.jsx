import React from "react";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle({ dark, setDark }) {
  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
