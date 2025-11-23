// frontend/src/pages/UsageHistory.jsx
import React, { useEffect, useState, useMemo } from "react";
import api from "../lib/api";
import PageLayout from "../components/layout/PageLayout";

function formatDate(ts) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return String(ts);
  }
}

export default function UsageHistory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterTool, setFilterTool] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // --------- LOAD DATA ----------
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/usage/");
        const { ok, result, error } = res.data || {};
        if (!ok) {
          setError(error?.message || "Failed to load usage history");
          setItems([]);
        } else {
          const arr = Array.isArray(result?.usage) ? result.usage : [];
          setItems(arr);
        }
      } catch (err) {
        const msg = err?.response?.data?.error?.message || err.message || "Failed to load usage history";
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // --------- DERIVED STATS ----------
  const tools = useMemo(
    () => [...new Set(items.map((i) => i.tool || "Unknown"))],
    [items]
  );

  const stats = useMemo(() => {
    if (!items.length) {
      return {
        totalRuns: 0,
        uniqueTools: 0,
        todayRuns: 0,
        lastUsed: null,
        toolCounts: {},
      };
    }

    const toolCounts = {};
    let lastTs = null;
    let todayRuns = 0;

    const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    for (const i of items) {
      const tool = i.tool || "Unknown";
      toolCounts[tool] = (toolCounts[tool] || 0) + 1;

      if (i.timestamp) {
        const ts = new Date(i.timestamp);
        if (!Number.isNaN(ts.getTime())) {
          if (!lastTs || ts > lastTs) lastTs = ts;
          const iso = ts.toISOString().slice(0, 10);
          if (iso === todayStr) todayRuns += 1;
        }
      }
    }

    return {
      totalRuns: items.length,
      uniqueTools: Object.keys(toolCounts).length,
      todayRuns,
      lastUsed: lastTs,
      toolCounts,
    };
  }, [items]);

  // --------- FILTER + PAGINATE ----------
  const filtered = items.filter((i) => {
    if (filterTool && i.tool !== filterTool) return false;
    if (query) {
      const q = query.toLowerCase();
      const text = `${i.tool} ${i.input || ""} ${i.result || ""}`.toLowerCase();
      if (!text.includes(q)) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  // --------- CSV EXPORT ----------
  const exportCSV = () => {
    const rows = [
      ["timestamp", "tool", "input", "resultSnippet"],
      ...filtered.map((i) => [
        i.timestamp || "",
        i.tool || "",
        (i.input || "").replace(/\n/g, " ").slice(0, 400),
        String(i.result || "").replace(/\n/g, " ").slice(0, 400),
      ]),
    ];

    const csv = rows
      .map((r) =>
        r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `usage-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <PageLayout title="Usage History">
      {/* SUMMARY STATS */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
          <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
            <div className="text-xs font-medium text-gray-500 uppercase">
              Total Runs
            </div>
            <div className="mt-2 text-2xl font-semibold">
              {stats.totalRuns}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              All tools, all time
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
            <div className="text-xs font-medium text-gray-500 uppercase">
              Active Tools
            </div>
            <div className="mt-2 text-2xl font-semibold">
              {stats.uniqueTools}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Tools that have been used
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
            <div className="text-xs font-medium text-gray-500 uppercase">
              Today&apos;s Runs
            </div>
            <div className="mt-2 text-2xl font-semibold">
              {stats.todayRuns}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Last used:{" "}
              {stats.lastUsed
                ? stats.lastUsed.toLocaleString()
                : "No activity yet"}
            </div>
          </div>
        </div>

        {/* FILTERS + ACTIONS */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs font-medium text-gray-600">
              Filter by tool
            </label>
            <select
              value={filterTool}
              onChange={(e) => {
                setFilterTool(e.target.value);
                setPage(1);
              }}
              className="border rounded-md px-2 py-1 text-sm"
            >
              <option value="">All tools</option>
              {tools.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <input
              placeholder="Search input / result…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="border rounded-md px-2 py-1 text-sm w-full sm:w-64"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-600">
              Showing <b>{filtered.length}</b> events
            </div>
            <button
              onClick={exportCSV}
              className="rounded-md bg-black text-white px-3 py-1.5 text-xs font-medium hover:opacity-90"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* LIST */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-6 text-sm text-gray-500">
              Loading usage history…
            </div>
          ) : error ? (
            <div className="p-6 text-sm text-red-600">{error}</div>
          ) : pageItems.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">
              No usage recorded yet. Try running one of the tools first.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {pageItems.map((u, idx) => (
                <li
                  key={idx}
                  className="p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700">
                        {u.tool || "Unknown tool"}
                      </span>
                      <span>•</span>
                      <span>{formatDate(u.timestamp)}</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-900 whitespace-pre-wrap">
                      {u.input || "(no input recorded)"}
                    </div>
                  </div>

                  <div className="sm:w-80 text-sm text-gray-800">
                    <div className="text-xs font-semibold text-gray-500 mb-1">
                      Result
                    </div>
                    <div className="text-sm text-gray-800 whitespace-pre-wrap max-h-32 overflow-hidden">
                      {String(u.result || "")
                        .slice(0, 300)
                        .trim() || "(no result stored)"}
                    </div>
                    <div className="mt-2 text-[11px] text-gray-400">
                      Usage ID: {u.id || "—"}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* PAGINATION */}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded-md disabled:opacity-40"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded-md disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
