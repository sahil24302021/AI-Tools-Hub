import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, opts = {}) => {
    const id = Date.now() + Math.random();
    const t = { id, message, ...opts };
    setToasts(prev => [t, ...prev]);
    if (!opts.persistent) {
      setTimeout(() => {
        setToasts(prev => prev.filter(x => x.id !== id));
      }, opts.duration || 4000);
    }
    return id;
  }, []);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismiss }}>
      {children}
      <div className="fixed right-4 bottom-4 flex flex-col gap-2 z-50">
        {toasts.map(t => (
          <div key={t.id} className="bg-black text-white px-4 py-2 rounded shadow">
            <div className="flex items-start gap-3">
              <div className="text-sm">{t.message}</div>
              <button onClick={() => dismiss(t.id)} className="ml-4 text-xs opacity-80">Close</button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
