import React, { useState } from "react";

export default function ResumeBuilder() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState("");

  const download = () => {
    const content = `Name: ${name}\nTitle: ${title}\n\nSummary:\n${summary}\n\nSkills:\n${skills.split(',').map(s => '- ' + s.trim()).join('\n')}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name || 'resume'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-semibold">Resume Builder</h2>
      <p className="text-sm text-gray-600 mt-1">Fill details and download a basic resume (you can later convert to PDF or style it).</p>

      <div className="mt-6 grid gap-4">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Full name"
          className="border rounded p-2"
        />
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Professional title (e.g. Frontend Developer)"
          className="border rounded p-2"
        />
        <textarea
          value={summary}
          onChange={e => setSummary(e.target.value)}
          placeholder="Short professional summary"
          className="border rounded p-2 h-28 resize-none"
        />
        <input
          value={skills}
          onChange={e => setSkills(e.target.value)}
          placeholder="Skills (comma separated)"
          className="border rounded p-2"
        />

        <div className="flex gap-3">
          <button onClick={download} className="px-4 py-2 bg-black text-white rounded">Download Resume</button>
          <button onClick={() => { setName(''); setTitle(''); setSummary(''); setSkills(''); }} className="px-4 py-2 border rounded">Reset</button>
        </div>
      </div>
    </div>
  );
}
