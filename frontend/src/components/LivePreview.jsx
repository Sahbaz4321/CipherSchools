
import React from "react";
import '../css/LivePreview.css';
import { Sandpack } from "@codesandbox/sandpack-react";
import { githubLight, dracula } from "@codesandbox/sandpack-themes";

export default function LivePreview({ files, activeFile, onChange, theme }) {
  const sandpackTheme = theme === "light" ? githubLight : dracula;

  // Prepare Sandpack files
  const sandpackFiles = {};
  Object.entries(files).forEach(([path, content]) => {
    const properPath = path.startsWith("/") ? path : `/${path}`;
    sandpackFiles[properPath] = { code: content };
  });

  // ⚡ Always use App.js, ignore App.jsx completely
  if (!sandpackFiles["/src/App.js"]) {
    sandpackFiles["/src/App.js"] = {
      code: 'import React from "react";\nexport default function App() { return <div>Hello App.js</div>; }',
    };
  }

  // ⚡ Default entry file: index.js with dynamic import
  if (!sandpackFiles["/src/index.js"]) {
    sandpackFiles["/src/index.js"] = {
      code: `import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
const root = createRoot(document.getElementById("root"));
root.render(<App />);`,
    };
  }

  const fileToRun = activeFile.startsWith("/") ? activeFile : `/${activeFile}`;

  return (
    <div className={`live-preview h-100 d-flex flex-column ${theme}`}>
      <div className="card h-100 shadow-sm rounded">
        <div
          className="card-body p-2 flex-grow-1"
          style={{ maxHeight: "100%", overflow: "auto" }}
        >
          <Sandpack
            template="react"
            theme={sandpackTheme}
            files={sandpackFiles}
            options={{
              showTabs: true,
              showLineNumbers: true,
              showInlineErrors: true,
              autorun: true,
              recompileMode: "immediate",
              activeFile: fileToRun,
              editorHeight: 500,
              layout: "preview",
              onFileChange: (path, code) => {
                if (onChange) onChange(path.replace(/^\//, ""), code);
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

