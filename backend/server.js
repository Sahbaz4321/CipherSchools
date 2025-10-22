
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
  origin: ["https://frontend-b2zozzxlt-sahbaz4321s-projects.vercel.app"]
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected")

)
.catch(err => console.error("MongoDB connection error:", err));

// File schema
const fileSchema = new mongoose.Schema({
  projectId: String,
  parentId: { type: mongoose.Schema.Types.ObjectId, default: null },
  name: String,
  type: { type: String, enum: ["folder", "file"], required: true },
  s3Key: String,
  language: String,
  sizeInBytes: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const File = mongoose.model("File", fileSchema);

// Project schema
const projectSchema = new mongoose.Schema({
  projectId: String,
  name: String,
  files: Object,
  lastUpdated: Date
});

const Project = mongoose.model("Project", projectSchema);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Create file/folder
app.post("/api/files", async (req, res) => {
  try {
    const file = new File(req.body);
    await file.save();
    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rename file/folder
app.put("/api/files/rename", async (req, res) => {
  const { oldPath, newPath } = req.body;
  try {
    const file = await File.findOne({ s3Key: oldPath });
    if (!file) return res.status(404).json({ error: "File not found" });
    file.s3Key = newPath;
    file.name = newPath.split("/").pop();
    await file.save();
    res.json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete file/folder
app.delete("/api/files", async (req, res) => {
  const { path } = req.query;
  try {
    const result = await File.deleteOne({ s3Key: path });
    if (result.deletedCount === 0) return res.status(404).json({ error: "File not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Save project
app.post("/api/projects", async (req, res) => {
  try {
    let project = await Project.findOne({ projectId: req.body.projectId });
    if (project) {
      project.files = req.body.files;
      project.lastUpdated = new Date();
    } else {
      project = new Project(req.body);
    }
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
