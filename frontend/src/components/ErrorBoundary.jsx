import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Optionally log error to monitoring service
    // console.error('ErrorBoundary caught', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Something went wrong</h2>
          <pre className="text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded border">{String(this.state.error)}</pre>
          <div className="mt-6">
            <button
              className="px-4 py-2 rounded border"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
