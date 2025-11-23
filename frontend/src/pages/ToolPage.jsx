import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useToast } from "../components/ToastProvider";

/**
 * Reusable ToolPage Component
 * ------------------------------------------
 * PROPS:
 *  title: string
 *  description?: string
 *  endpoint: string     (e.g., "/chat", "/resume")
 *  fields: [
 *    { name, label, type?, placeholder?, rows? }
 *  ]
 *  buildPayload?: (form) => any
 *  transformResult?: (result) => string | object
 *  rightHeader?: string
 *  onBeforeSubmit?: (form) => false | void
 *  externalSubmit?: async(form, { setError, setResult, setLoading, push })
 *  extraActions?: ReactNode
 */
export default function ToolPage({
  title,
  description = "",
  endpoint,
  fields = [
    {
      name: "prompt",
      label: "Prompt",
      type: "textarea",
      rows: 4,
      placeholder: "Enter your prompt...",
    },
  ],
  buildPayload,
  transformResult,
  rightHeader = "Result",
  onBeforeSubmit,
  externalSubmit,
  extraActions,
}) {
  const [form, setForm] = useState(() =>
    Object.fromEntries(fields.map((f) => [f.name, ""]))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const navigate = useNavigate();
  const { push } = useToast() || { push: () => {} };

  const primaryField = fields[0]?.name;

  const updateField = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const payloadBuilder = buildPayload || ((f) => f);

  const submit = useCallback(async () => {
    if (!form[primaryField]?.trim()) {
      push("Input required", { type: "error" });
      return;
    }

    if (onBeforeSubmit && onBeforeSubmit(form) === false) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      if (externalSubmit) {
        // For use cases like file upload (Vision, PDF)
        await externalSubmit(form, { setError, setResult, setLoading, push });
      } else {
        const body = payloadBuilder(form);
        const { data } = await api.post(endpoint, body);

        if (data.error) {
          setError(data.error);
          push(data.error, { type: "error" });
        } else if (!data.result) {
          setError("Empty result");
        } else {
          const finalOutput = transformResult
            ? transformResult(data.result)
            : data.result;

          setResult(finalOutput);
          push("Done", { type: "info" });
        }
      }
    } catch (e) {
      const msg = e?.response?.data?.error || e.message;
      setError(msg);
      push(msg, { type: "error" });
    } finally {
      setLoading(false);
    }
  }, [
    form,
    primaryField,
    buildPayload,
    transformResult,
    endpoint,
    externalSubmit,
    onBeforeSubmit,
    push,
  ]);

  const onKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      submit();
    }
  };

  const clearAll = () => {
    setForm(Object.fromEntries(fields.map((f) => [f.name, ""])));
    setError(null);
    setResult(null);
  };

  return (
    <div
      className="space-y-6 max-w-5xl mx-auto"
      onKeyDown={onKeyDown}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-gray-600 mt-1 max-w-2xl">
              {description}
            </p>
          )}
        </div>

        <button
          onClick={() => navigate(-1)}
          className="text-xs px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
        >
          Back
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* LEFT: Input Section */}
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 space-y-4">
            {fields.map((f) => (
              <div key={f.name} className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  {f.label}
                </label>

                {f.type === "textarea" ? (
                  <textarea
                    name={f.name}
                    rows={f.rows || 4}
                    placeholder={f.placeholder}
                    value={form[f.name]}
                    onChange={updateField}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-black/10 focus:outline-none"
                  />
                ) : (
                  <input
                    name={f.name}
                    placeholder={f.placeholder}
                    value={form[f.name]}
                    onChange={updateField}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-black/10 focus:outline-none"
                  />
                )}
              </div>
            ))}

            {/* Buttons */}
            <div className="flex flex-wrap gap-2 pt-2 items-center">
              <button
                onClick={submit}
                disabled={loading}
                className="rounded-md bg-black text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
              >
                {loading ? "Working…" : "Run"}
              </button>

              <button
                onClick={clearAll}
                disabled={loading}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 disabled:opacity-50"
              >
                Clear
              </button>

              {extraActions && <div className="ml-2">{extraActions}</div>}
            </div>

            <p className="text-[11px] text-gray-500">
              Press Ctrl/Cmd + Enter to submit.
            </p>
          </div>
        </div>

        {/* RIGHT: Result Panel */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-700">
              {rightHeader}
            </div>

            {result && !loading && !error && (
              <button
                onClick={() => setResult(null)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Hide
              </button>
            )}
          </div>

          <div className="flex-1 text-sm">
            {/* Skeleton Loader */}
            {loading && (
              <div className="space-y-3 animate-pulse">
                <div className="h-3 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-full bg-gray-200 rounded" />
                <div className="h-3 w-4/5 bg-gray-200 rounded" />
                <div className="h-3 w-3/5 bg-gray-200 rounded" />
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="text-red-600 font-medium whitespace-pre-wrap">
                {error}
              </div>
            )}

            {/* Result */}
            {!loading && !error && result && (
              <div className="font-mono text-xs whitespace-pre-wrap leading-relaxed">
                {typeof result === "string"
                  ? result
                  : JSON.stringify(result, null, 2)}
              </div>
            )}

            {/* Empty */}
            {!loading && !error && !result && (
              <div className="text-gray-400">Output will appear here.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
