# CipherSchools - Online React IDE

CipherSchools is a full-stack online code editor built with **React** for frontend and **Node.js/Express** for backend. It allows users to create, edit, rename, and delete JavaScript/React files. All project and file data is saved in **MongoDB Atlas**.

---

## Features

- Full React code editor with live preview using Sandpack
- File management: create, rename, delete files 
- Autosave functionality to local storage and backend
- Save and load projects
- Light and Dark theme toggle
- Backend API using Node.js/Express with MongoDB Atlas
- Deployable on **Vercel**

---

## Tech Stack

- **Frontend:** React, Sandpack, Bootstrap, Lucide Icons  
- **Backend:** Node.js, Express, Mongoose, MongoDB Atlas  
- **Deployment:** Vercel

---
cipher/
├─ backend/ # Node.js backend
│ ├─ server.js
│ ├─ package.json
│ └─ .env
├─ frontend/ # React frontend
│ ├─ src/
│ ├─ public/
│ ├─ package.json
│ └─ vite.config.js
├─ .gitignore
└─ README.md
---

## Setup

### Backend

1. Navigate to backend folder:
```bash
cd backend
npm install
MONGO_URI=your_mongodb_connection_string
PORT=4000
API_URL=http://localhost:4000
npm run dev
cd frontend
npm install
VITE_API_URL=http://localhost:4000
npm run dev
Deployment

Deploy backend to Vercel or any Node.js hosting platform

Deploy frontend to Vercel

Update VITE_API_URL in frontend .env to point to your deployed backend URL

Usage

Open the frontend URL in your browser

Create a project or open an existing one

Add, edit, rename, or delete files

Save project locally or on the server

Switch between Light and Dark themes

Contributing

Contributions are welcome! Please follow these steps:

Fork the repository

Create a new branch: git checkout -b feature/your-feature

Commit your changes: git commit -m "Add new feature"

Push to your branch: git push origin feature/your-feature

Open a Pull Request

License

This project is licensed under the MIT License.

Live Demo

Frontend: https://cipherreactide.vercel.app





