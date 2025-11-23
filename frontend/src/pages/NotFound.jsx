import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl text-center py-12">
      <h1 className="text-3xl font-semibold mb-2">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <Link
        to="/dashboard"
        className="inline-flex items-center rounded-md bg-black text-white px-4 py-2 text-sm font-medium"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
