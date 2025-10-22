// import React, { useState, useEffect, useCallback } from "react";
// import FileExplorer from "./components/FileExplorer";
// import { Sun, Moon } from "lucide-react";
// import LivePreview from "./components/LivePreview";
// import ProjectControls from "./components/ProjectControls";
// import { defaultProject, saveToLocal, loadFromLocal } from "./utils/projectUtils";
// import "./App.css";

// export default function App() {
//   const [project, setProject] = useState(() => loadFromLocal() || defaultProject());
//   const [activePath, setActivePath] = useState(() => project.lastActive || "src/App.js");
//   const [autosave, setAutosave] = useState(true);
//   const [status, setStatus] = useState("Idle");
//   const [theme, setTheme] = useState("light");

//   // Ensure App.js exists
//   useEffect(() => {
//     setProject((p) => {
//       const files = { ...p.files };
//       if (!files["src/App.js"] && !files["src/App.jsx"]) {
//         files["src/App.js"] =
//           'import React from "react";\nexport default function App() { return <div>Hello p.js</div>; }';
//       }
//       return { ...p, files };
//     });
//   }, []);

//   // Autosave
//   useEffect(() => {
//     if (!autosave) return;
//     const timeout = setTimeout(() => {
//       saveToLocal(project, activePath);
//       setStatus("Saved (local)");
//     }, 700);
//     return () => clearTimeout(timeout);
//   }, [project, autosave, activePath]);

//   // Update file content
//   const updateFile = useCallback((path, content) => {
//     setProject((prev) => ({
//       ...prev,
//       files: { ...prev.files, [path]: content },
//       lastUpdated: new Date().toISOString(),
//     }));
//     setActivePath(path);
//     setStatus("Editing");
//   }, []);

//   // Convert project.files object to tree structure for FileExplorer
//   const filesToStructure = useCallback((filesObj) => {
//     const root = [];
//     const folders = { "": root };

//     Object.keys(filesObj).forEach((path) => {
//       const parts = path.split("/");
//       let parent = "";
//       parts.forEach((part, idx) => {
//         const currPath = parts.slice(0, idx + 1).join("/");
//         if (!folders[currPath]) {
//           const isFile = idx === parts.length - 1;
//           const newNode = { name: part, type: isFile ? "file" : "folder" };
//           if (!isFile) newNode.children = [];
//           folders[parent].push(newNode);
//           if (!isFile) folders[currPath] = newNode.children;
//         }
//         parent = currPath;
//       });
//     });

//     return root;
//   }, []);

//   // Create file
//   const createFile = useCallback(
//     async (path, content = "// new file") => {
//       const finalPath = path.startsWith("src/") ? path : `src/${path}`;
//       setProject((prev) => ({
//         ...prev,
//         files: { ...prev.files, [finalPath]: content },
//         lastUpdated: new Date().toISOString(),
//       }));
//       setActivePath(finalPath);

//       try {
//         const res = await fetch("http://localhost:4000/api/files", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             projectId: project.projectId || "default-project",
//             parentId: null,
//             name: finalPath.split("/").pop(),
//             type: finalPath.endsWith("/") ? "folder" : "file",
//             language: finalPath.endsWith(".js") || finalPath.endsWith(".jsx") ? "javascript" : "text",
//             sizeInBytes: new Blob([content]).size,
//             s3Key: `projects/${project.projectId || "default-project"}/${finalPath}`,
//           }),
//         });
//         if (!res.ok) throw new Error("Server error");
//         setStatus("File saved to MongoDB");
//       } catch (err) {
//         console.error("Failed to save file:", err);
//         setStatus("Mongo save failed");
//       }
//     },
//     [project.projectId]
//   );

//   // Rename file
//   const handleRename = async (oldPath, newPath) => {
//     setProject((prev) => {
//       const newFiles = { ...prev.files };
//       if (newFiles[oldPath]) {
//         newFiles[newPath] = newFiles[oldPath];
//         delete newFiles[oldPath];
//       }
//       return { ...prev, files: newFiles };
//     });

//     try {
//       await fetch("http://localhost:4000/api/files/rename", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ oldPath, newPath }),
//       });
//       setStatus("Renamed in MongoDB");
//     } catch (err) {
//       console.error("Rename failed:", err);
//       setStatus("Rename failed");
//     }
//   };

//   // Delete file
//   const deleteFile = useCallback(
//     async (path) => {
//       setProject((prev) => {
//         const newFiles = { ...prev.files };
//         delete newFiles[path];
//         if (!newFiles["src/App.js"] && !newFiles["src/App.jsx"]) {
//           newFiles["src/App.js"] =
//             'import React from "react";\nexport default function App() { return <div>Hello p.js</div>; }';
//         }
//         return { ...prev, files: newFiles };
//       });

//       setActivePath((prev) => {
//         if (prev === path) {
//           const remaining = Object.keys(project.files).filter((f) => f !== path);
//           return remaining[0] || "src/App.js";
//         }
//         return prev;
//       });

//       try {
//         await fetch(`http://localhost:4000/api/files?path=${encodeURIComponent(path)}`, {
//           method: "DELETE",
//         });
//         setStatus("Deleted from MongoDB");
//       } catch (err) {
//         console.error("Delete failed:", err);
//         setStatus("Delete failed");
//       }
//     },
//     [project.files]
//   );

//   // Save project to server
//   const saveToServer = async () => {
//     try {
//       const res = await fetch("http://localhost:4000/api/projects", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(project),
//       });
//       const data = await res.json();
//       setStatus("Saved (server) " + (data.projectId || ""));
//       saveToLocal(project, activePath);
//     } catch (err) {
//       console.error(err);
//       setStatus("Save failed");
//     }
//   };

//   // Load project
//   const loadProject = useCallback((projectId) => {
//     const loaded = loadFromLocal(projectId);
//     if (loaded) {
//       setProject(loaded);
//       const lastFile =
//         loaded.lastActive && loaded.files[loaded.lastActive]
//           ? loaded.lastActive
//           : Object.keys(loaded.files).find((f) => f.startsWith("src/")) || "src/App.js";
//       setActivePath(lastFile);
//       setStatus("Project loaded");
//     } else {
//       setStatus("Failed to load project");
//     }
//   }, []);

//   const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

//   return (
//     <div className={`container-fluid vh-100 p-2 d-flex flex-column ${theme}`}>
//       {/* Header */}
//       <div className="d-flex flex-column flex-md-row align-items-md-center mb-3 justify-content-between">
//         <h4 className="me-3 mb-2 mb-md-0">CipherStudio</h4>
//         <div className="d-flex align-items-center gap-2 flex-wrap">
//           <ProjectControls
//             project={project}
//             onSaveToServer={saveToServer}
//             autosave={autosave}
//             setAutosave={setAutosave}
//             status={status}
//             onLoadProject={loadProject}
//             theme={theme}
//           />
//           <button className="btn btn-sm btn-primary" onClick={toggleTheme} title="Toggle theme">
//             {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
//           </button>
//         </div>
//       </div>

//       {/* Main Layout */}
//       <div className="row flex-grow-1 g-2">
//         <div className="col-12 col-md-3">
//           <div className="card h-100 shadow-sm rounded">
//             <div className="card-body p-2 overflow-auto" style={{ maxHeight: "100%" }}>
//               <FileExplorer
//                 structure={filesToStructure(project.files)}
//                 onCreate={createFile}
//                 onDelete={deleteFile}
//                 onRename={handleRename}
//                 activePath={activePath}
//                 setActivePath={setActivePath}
//                 theme={theme}
//               />
//             </div>
//           </div>
//         </div>
//         <div className="col-12 col-md-9">
//           <div className="card h-100 shadow-sm rounded">
//             <div className="card-body p-2 overflow-auto" style={{ maxHeight: "100%" }}>
//               <LivePreview files={project.files} activeFile={activePath} onChange={updateFile} theme={theme} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }  




import React, { useState, useEffect, useCallback } from "react";
import FileExplorer from "./components/FileExplorer";
import { Sun, Moon } from "lucide-react";
import LivePreview from "./components/LivePreview";
import ProjectControls from "./components/ProjectControls";
import { defaultProject, saveToLocal, loadFromLocal } from "./utils/projectUtils";
import "./App.css";

export default function App() {
  const [project, setProject] = useState(() => loadFromLocal() || defaultProject());
  const [activePath, setActivePath] = useState(() => project.lastActive || "src/App.js");
  const [autosave, setAutosave] = useState(true);
  const [status, setStatus] = useState("Idle");
  const [theme, setTheme] = useState("light");

  // Backend URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;


  // Ensure App.js exists
  useEffect(() => {
    setProject((p) => {
      const files = { ...p.files };
      if (!files["src/App.js"] && !files["src/App.jsx"]) {
        files["src/App.js"] =
          'import React from "react";\nexport default function App() { return <div>Hello p.js</div>; }';
      }
      return { ...p, files };
    });
  }, []);

  // Autosave
  useEffect(() => {
    if (!autosave) return;
    const timeout = setTimeout(() => {
      saveToLocal(project, activePath);
      setStatus("Saved (local)");
    }, 700);
    return () => clearTimeout(timeout);
  }, [project, autosave, activePath]);

  // Update file content
  const updateFile = useCallback((path, content) => {
    setProject((prev) => ({
      ...prev,
      files: { ...prev.files, [path]: content },
      lastUpdated: new Date().toISOString(),
    }));
    setActivePath(path);
    setStatus("Editing");
  }, []);

  // Convert project.files object to tree structure for FileExplorer
  const filesToStructure = useCallback((filesObj) => {
    const root = [];
    const folders = { "": root };

    Object.keys(filesObj).forEach((path) => {
      const parts = path.split("/");
      let parent = "";
      parts.forEach((part, idx) => {
        const currPath = parts.slice(0, idx + 1).join("/");
        if (!folders[currPath]) {
          const isFile = idx === parts.length - 1;
          const newNode = { name: part, type: isFile ? "file" : "folder" };
          if (!isFile) newNode.children = [];
          folders[parent].push(newNode);
          if (!isFile) folders[currPath] = newNode.children;
        }
        parent = currPath;
      });
    });

    return root;
  }, []);

  // Create file
  const createFile = useCallback(
    async (path, content = "// new file") => {
      const finalPath = path.startsWith("src/") ? path : `src/${path}`;
      setProject((prev) => ({
        ...prev,
        files: { ...prev.files, [finalPath]: content },
        lastUpdated: new Date().toISOString(),
      }));
      setActivePath(finalPath);

      try {
        const res = await fetch(`${API_URL}/api/files`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: project.projectId || "default-project",
            parentId: null,
            name: finalPath.split("/").pop(),
            type: finalPath.endsWith("/") ? "folder" : "file",
            language: finalPath.endsWith(".js") || finalPath.endsWith(".jsx") ? "javascript" : "text",
            sizeInBytes: new Blob([content]).size,
            s3Key: `projects/${project.projectId || "default-project"}/${finalPath}`,
          }),
        });
        if (!res.ok) throw new Error("Server error");
        setStatus("File saved to MongoDB");
      } catch (err) {
        console.error("Failed to save file:", err);
        setStatus("Mongo save failed");
      }
    },
    [project.projectId, API_URL]
  );

  // Rename file
  const handleRename = async (oldPath, newPath) => {
    setProject((prev) => {
      const newFiles = { ...prev.files };
      if (newFiles[oldPath]) {
        newFiles[newPath] = newFiles[oldPath];
        delete newFiles[oldPath];
      }
      return { ...prev, files: newFiles };
    });

    try {
      await fetch(`${API_URL}/api/files/rename`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPath, newPath }),
      });
      setStatus("Renamed in MongoDB");
    } catch (err) {
      console.error("Rename failed:", err);
      setStatus("Rename failed");
    }
  };

  // Delete file
  const deleteFile = useCallback(
    async (path) => {
      setProject((prev) => {
        const newFiles = { ...prev.files };
        delete newFiles[path];
        if (!newFiles["src/App.js"] && !newFiles["src/App.jsx"]) {
          newFiles["src/App.js"] =
            'import React from "react";\nexport default function App() { return <div>Hello p.js</div>; }';
        }
        return { ...prev, files: newFiles };
      });

      setActivePath((prev) => {
        if (prev === path) {
          const remaining = Object.keys(project.files).filter((f) => f !== path);
          return remaining[0] || "src/App.js";
        }
        return prev;
      });

      try {
        await fetch(`${API_URL}/api/files?path=${encodeURIComponent(path)}`, {
          method: "DELETE",
        });
        setStatus("Deleted from MongoDB");
      } catch (err) {
        console.error("Delete failed:", err);
        setStatus("Delete failed");
      }
    },
    [project.files, API_URL]
  );

  // Save project to server
  const saveToServer = async () => {
    try {
      const res = await fetch(`${API_URL}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      const data = await res.json();
      setStatus("Saved (server) " + (data.projectId || ""));
      saveToLocal(project, activePath);
    } catch (err) {
      console.error(err);
      setStatus("Save failed");
    }
  };

  // Load project
  const loadProject = useCallback((projectId) => {
    const loaded = loadFromLocal(projectId);
    if (loaded) {
      setProject(loaded);
      const lastFile =
        loaded.lastActive && loaded.files[loaded.lastActive]
          ? loaded.lastActive
          : Object.keys(loaded.files).find((f) => f.startsWith("src/")) || "src/App.js";
      setActivePath(lastFile);
      setStatus("Project loaded");
    } else {
      setStatus("Failed to load project");
    }
  }, []);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <div className={`container-fluid vh-100 p-2 d-flex flex-column ${theme}`}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center mb-3 justify-content-between">
        <h4 className="me-3 mb-2 mb-md-0">CipherStudio</h4>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <ProjectControls
            project={project}
            onSaveToServer={saveToServer}
            autosave={autosave}
            setAutosave={setAutosave}
            status={status}
            onLoadProject={loadProject}
            theme={theme}
          />
          <button className="btn btn-sm btn-primary" onClick={toggleTheme} title="Toggle theme">
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="row flex-grow-1 g-2">
        <div className="col-12 col-md-3">
          <div className="card h-100 shadow-sm rounded">
            <div className="card-body p-2 overflow-auto" style={{ maxHeight: "100%" }}>
              <FileExplorer
                structure={filesToStructure(project.files)}
                onCreate={createFile}
                onDelete={deleteFile}
                onRename={handleRename}
                activePath={activePath}
                setActivePath={setActivePath}
                theme={theme}
              />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-9">
          <div className="card h-100 shadow-sm rounded">
            <div className="card-body p-2 overflow-auto" style={{ maxHeight: "100%" }}>
              <LivePreview files={project.files} activeFile={activePath} onChange={updateFile} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
