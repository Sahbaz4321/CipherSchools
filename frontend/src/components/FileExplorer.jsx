
import React, { useState } from "react";
import { FaFolder, FaFile, FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import "../css/FileExplorer.css";

export default function FileExplorer({
  structure,
  onCreate,
  onDelete,
  onRename,
  activePath,
  setActivePath,
  theme,
}) {
  const [newItem, setNewItem] = useState({ name: "", type: "file" });

  const handleCreate = () => {
    if (!newItem.name) return;
    const path = newItem.type === "folder" ? `${newItem.name}/` : newItem.name;
    onCreate(path);
    setNewItem({ name: "", type: "file" });
  };

  const renderTree = (nodes, parentPath = "") => {
    return nodes.map((node) => {
      const path = parentPath + node.name + (node.type === "folder" ? "/" : "");
      return (
        <div key={path} className={`tree-node ${activePath === path ? "active" : ""}`}>
          <div
            className="d-flex align-items-center justify-content-between py-1 px-2 node-label"
            style={{ cursor: "pointer" }}
            onClick={() => node.type === "file" && setActivePath(path)}
          >
            <div className="d-flex align-items-center gap-1">
              {node.type === "folder" ? <FaFolder /> : <FaFile />}
              <span>{node.name}</span>
            </div>
            <div className="node-actions">
              <FaEdit
                className="action-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  const newName = prompt("Enter new name", node.name);
                  if (newName) onRename(path, parentPath + newName + (node.type === "folder" ? "/" : ""));
                }}
              />
              <FaTrash
                className="action-icon text-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("Delete this item?")) onDelete(path);
                }}
              />
            </div>
          </div>
          {node.type === "folder" && node.children && (
            <div className="ms-3">{renderTree(node.children, path)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className={`file-explorer h-100 d-flex flex-column ${theme}`}>
      {/* Create new file/folder */}
      <div className="d-flex gap-1 mb-2">
        <input
          className="form-control form-control-sm"
          placeholder="Enter name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <select
          className="form-select form-select-sm"
          value={newItem.type}
          onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
        >
          <option value="file">File</option>
          <option value="folder">Folder</option>
        </select>
        <button className="btn btn-sm btn-primary" onClick={handleCreate}>
          <FaPlus />
        </button>
      </div>

      {/* File tree */}
      <div className="file-tree flex-grow-1 overflow-auto">{renderTree(structure)}</div>
    </div>
  );
}



