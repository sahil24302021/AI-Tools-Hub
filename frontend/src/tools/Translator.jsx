// src/tools/Translator.jsx
import React from "react";
import ToolSkeleton from "./ToolSkeleton";
import { Languages } from "lucide-react";

export default function Translator() {
  return (
    <ToolSkeleton
      icon={Languages}
      title="AI Translator"
      subtitle="Translate text into any language instantly."
      endpoint="/translator/"
      fields={[
        {
          name: "text",
          label: "Text to Translate",
          type: "textarea",
          placeholder: "Enter text to translate...",
        },
        {
          name: "target_lang",
          label: "Target Language",
          type: "text",
          placeholder: "e.g., Hindi, English, Spanish",
        },
      ]}
      transform={(result) => {
        const r = result?.translated_text;
        return typeof r === 'object' ? JSON.stringify(r, null, 2) : (r || 'No translation');
      }}
    />
  );
}
