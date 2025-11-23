import React, { useState } from "react";

export default function AIVision() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState("Upload an image to get started.");

  const onFile = (ev) => {
    const f = ev.target.files?.[0];
    if (!f) return;
    setFile(URL.createObjectURL(f));
    setAnalysis("Analyzing… (placeholder). This app doesn't call a vision API yet — implement backend or direct API call here.");
    // In real app: send file to vision API and setAnalysis(result)
    setTimeout(() => setAnalysis("Detected: sample objects (placeholder)."), 800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold">Vision Tool</h3>
        <p className="text-sm text-gray-600 mt-1">Upload an image and the model will describe or analyze it.</p>
        <input type="file" accept="image/*" onChange={onFile} className="mt-4" />
        {file && (
          <div className="mt-4">
            <img src={file} alt="preview" className="max-w-full rounded" />
          </div>
        )}
      </div>

      <div className="rounded-lg border border-gray-200 p-6">
        <h4 className="text-sm font-medium">Analysis</h4>
        <div className="mt-3 p-3 border rounded h-64 overflow-auto bg-gray-50">
          <pre className="whitespace-pre-wrap text-sm">{analysis}</pre>
        </div>
      </div>
    </div>
  );
}
