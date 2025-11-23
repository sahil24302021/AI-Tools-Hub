import React from "react";

export default function PageSection({ title, children }) {
  return (
    <div className="mb-8">
      {title && <h2 className="text-xl font-semibold mb-3">{title}</h2>}
      <div>{children}</div>
    </div>
  );
}
