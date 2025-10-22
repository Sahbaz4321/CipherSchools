
import React, { useState, useEffect } from "react";

export default function ProjectControls({
  project,
  onSaveToServer,
  autosave,
  setAutosave,
  status,
  onLoadProject,
  theme // receive theme from App
}) {
  const [savedProjects, setSavedProjects] = useState([]);

  // Load saved projects from localStorage
  useEffect(() => {
    const keys = Object.keys(localStorage).filter(k =>
      k.startsWith("cipherstudio:project:")
    );
    const projects = keys.map(k => JSON.parse(localStorage.getItem(k)));
    setSavedProjects(projects);
  }, [project]);

  return (
    <div
      className={`project-controls d-flex align-items-center justify-content-between p-2 rounded shadow-sm ${theme}`}
    >
      {/* Left: Project name + ID */}
      <div className="d-flex align-items-center gap-3 flex-nowrap">
        <span className="badge bg-secondary">{project?.name}</span>
        
        <small
  className="project-id-badge"
  style={{
    backgroundColor: theme === "light" ? "#f1f3f5" : "#212529",
    color: theme === "light" ? "#0d6efd" : "#0dcaf0", // Blue shade for highlight
    borderRadius: "6px",
    padding: "3px 8px",
    fontWeight: "bold",
    fontSize: "0.8rem",
    display: "inline-block",
  }}
>
  ID: {project?.projectId}
</small>

      </div>

      {/* Right: Controls */}
      <div className="d-flex align-items-center gap-3 ms-2 flex-nowrap">
        {/* Autosave toggle */}
        <div className="form-check form-switch m-0">
          <input
            className="form-check-input"
            type="checkbox"
            checked={autosave}
            onChange={(e) => setAutosave(e.target.checked)}
            id="autosaveSwitch"
          />
          <label className="form-check-label" htmlFor="autosaveSwitch">
            Autosave
          </label>
        </div>

        {/* Save button */}
        <button className="btn btn-sm btn-success" onClick={onSaveToServer}>
          Save (server)
        </button>

        {/* Load from localStorage */}
        <select
          className="form-select form-select-sm"
          onChange={(e) => {
            const selectedId = e.target.value;
            if (selectedId && onLoadProject) onLoadProject(selectedId);
          }}
          value=""
        >
          <option value="">Load Project...</option>
          {savedProjects.map((p) => (
            <option key={p.projectId} value={p.projectId}>
              {p.name} ({p.projectId})
            </option>
          ))}
        </select>

        <small className="ms-2">{status}</small>
      </div>
    </div>
  );
}
