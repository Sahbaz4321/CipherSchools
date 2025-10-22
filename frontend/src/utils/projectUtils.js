export function defaultProject() {
  return {
    projectId: "local_" + Date.now(),
    name: "MyCipherProject",
    files: {
      "src/App.jsx": `import React from "react";
export default function App(){ return (<div style={{padding:20}}> <h3>Hello from CipherStudio</h3> <p>Edit src/App.jsx</p> </div>) }`,
      "src/index.jsx": `import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
createRoot(document.getElementById("root")).render(<App />);`,
      "public/index.html": `<!doctype html><html><body><div id="root"></div></body></html>`,
      "package.json": `{
  "name": "cipher-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "18.2.0",
    "react-dom": "18.2.0"
  }
}`
    },
    settings: { template: "react", autosave: true },
    lastUpdated: new Date().toISOString()
  };
}

export function saveToLocal(project) {
  const key = `cipherstudio:project:${project.projectId}`;
  localStorage.setItem(key, JSON.stringify(project));
}

export function loadFromLocal(projectId) {
  if (!projectId) {
    // load most recent if no id
    const keys = Object.keys(localStorage).filter(k => k.startsWith("cipherstudio:project:"));
    if (keys.length === 0) return null;
    const latest = keys.sort().pop();
    return JSON.parse(localStorage.getItem(latest));
  }
  const key = `cipherstudio:project:${projectId}`;
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}



// utils/projectUtils.js

// export function defaultProject() {
//   return {
//     projectId: "local_" + Date.now(),
//     name: "MyCipherProject",
//     files: {
//       "src/App.jsx": `import React from "react";
// export default function App() {
//   return (
//     <div style={{padding:20}}>
//       <h3>Hello from CipherStudio</h3>
//       <p>Edit src/App.jsx</p>
//     </div>
//   );
// }`,
//       "src/index.jsx": `import React from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App";
// createRoot(document.getElementById("root")).render(<App />);`,
//       "public/index.html": `<!doctype html><html><body><div id="root"></div></body></html>`,
//       "package.json": `{
//   "name": "cipher-app",
//   "version": "1.0.0",
//   "dependencies": {
//     "react": "18.2.0",
//     "react-dom": "18.2.0"
//   }
// }`
//     },
//     settings: { template: "react", autosave: true },
//     lastUpdated: new Date().toISOString(),
//     lastActive: "src/App.jsx" // <-- new: track last active editor file
//   };
// }

// // Save project to localStorage including last active file
// export function saveToLocal(project, activePath) {
//   const key = `cipherstudio:project:${project.projectId}`;
//   const toSave = { ...project, lastActive: activePath || project.lastActive || "src/App.jsx" };
//   localStorage.setItem(key, JSON.stringify(toSave));
// }

// // Load project from localStorage, returns lastActive with project
// export function loadFromLocal(projectId) {
//   if (!projectId) {
//     // Load most recent if no id
//     const keys = Object.keys(localStorage).filter(k => k.startsWith("cipherstudio:project:"));
//     if (keys.length === 0) return null;
//     const latestKey = keys.sort().pop();
//     const latestProject = JSON.parse(localStorage.getItem(latestKey));
//     return latestProject;
//   }

//   const key = `cipherstudio:project:${projectId}`;
//   const raw = localStorage.getItem(key);
//   return raw ? JSON.parse(raw) : null;
// }
