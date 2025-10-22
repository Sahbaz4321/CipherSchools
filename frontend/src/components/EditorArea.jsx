
import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

export default function EditorArea({ path, content, onChange }) {
  const [val, setVal] = useState(content || "");

  // When file changes, update editor content
  useEffect(() => {
    setVal(content || "");
  }, [path, content]);

  const handleChange = (value) => {
    setVal(value);
    if (onChange) onChange(path, value); // send code up
  };

  return (
    <div className="p-2 editor-area" style={{ height: "100%" }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <strong>{path}</strong>
      </div>

      <div style={{ height: "calc(100% - 40px)" }}>
        <Editor
          height="100%"
          language={
            path.endsWith(".jsx")
              ? "javascript"
              : path.endsWith(".html")
              ? "html"
              : path.endsWith(".json")
              ? "json"
              : "plaintext"
          }
          theme="vs-light"
          value={val}
          onChange={handleChange}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  );
}
