import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import ErrorBoundary from "./components/ErrorBoundary";
import reportWebVitals from "./reportWebVitals";

import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>
);

// Optional performance tracking
reportWebVitals();
