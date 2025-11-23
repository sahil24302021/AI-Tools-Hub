import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-6">
      <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-gray-600 flex flex-wrap gap-4">
        <Link to="/privacy" className="hover:underline">Privacy</Link>
        <Link to="/terms" className="hover:underline">Terms</Link>
        <Link to="/faq" className="hover:underline">FAQ</Link>
        <Link to="/support" className="hover:underline">Support</Link>
        <Link to="/changelog" className="hover:underline">Changelog</Link>
        <Link to="/roadmap" className="hover:underline">Roadmap</Link>
        <Link to="/about" className="hover:underline">About</Link>
        <Link to="/contact" className="hover:underline">Contact</Link>
      </div>
    </footer>
  );
}
