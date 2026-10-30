# 🎃 HallowCraft

> An interactive 2D & 3D Halloween pumpkin crafting experience. Sculpt Jack-o'-Lanterns in a full 3D viewport, design custom stickers in a 2D canvas studio, illuminate your crafting with flickering candlelight, and share your creations with the community!

<!--
## 🌐 Live Demo & Preview
Live Demo: [https://hallowcraft.example.com](https://hallowcraft.example.com)

[![HallowCraft Banner](./docs/images/hallowcraft-banner.png)](https://hallowcraft.example.com)
-->

---

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.186-black?logo=three.js&logoColor=white)](https://threejs.org/)
[![Appwrite](https://img.shields.io/badge/Appwrite-Cloud-FD366E?logo=appwrite&logoColor=white)](https://appwrite.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [3D crafting Studio](#-3d-crafting-studio)
  - [2D Canvas Studio](#-2d-canvas-studio)
  - [Community Showcase & Social](#-community-showcase--social)
  - [User Dashboard](#-user-dashboard)
  - [Backend & Cloud Persistence](#-backend--cloud-persistence)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Appwrite Setup Guide](#-appwrite-setup-guide)
  - [1. Authentication](#1-authentication)
  - [2. Database & Table Schema](#2-database--table-schema)
  - [3. Storage Bucket Configuration](#3-storage-bucket-configuration)
- [Available Scripts](#-available-scripts)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**HallowCraft 3D** brings the classic tradition of Jack-o'-Lantern crafting to the web. Whether you want to craft freehand in a dynamic 3D space with real-time lighting or stamp out stylized Halloween stickers in an easy-to-use 2D studio, HallowCraft has everything you need.

Once your masterpiece is ready, blow out the candle, turn on night mode, take a snapshot, or publish it directly to the community showcase where fellow crafters can view and heart your work.

---

## ✨ Key Features

### 🎃 3D crafting Studio

- **Real-Time 3D Sculpting**: Rotate the pumpkin 360° and cut incisions directly onto the 3D surface using Three.js and React Three Fiber.
- **Dynamic Lighting & Night Mode**: Switch between daylight and dark night modes with realistic candle flame illumination and bloom glow shaders.
- **Customizable Tools**: Adjust knife brush size, toggle crafting/rotation modes, and adjust glow intensity.
- **Undo History & Snapshots**: Step backwards through mistakes or capture high-resolution snapshot exports.

### 🎨 2D Canvas Studio

- **Konva-Powered Canvas**: Smooth drawing experience with brush sizing, custom color palettes, and eraser tools.
- **Flood Fill Paint Bucket**: Fill sections with vibrant Halloween hues.
- **Stamps & Facial Features**: Place geometric stamps (circles, ovals, triangles) and pre-crafted mouth expressions (classic toothy grin, surprised, sleepy).
- **Navigation Controls**: Zoom, pan, and center canvas with smooth multi-layer rendering.
- **Die-Cut Export**: Download clean PNG stickers with transparent backgrounds.

### 🕯️ Community Showcase & Social

- **Public Showcase Gallery**: Browse community-crafted pumpkins and stickers with paginated infinite-style views.
- **Like & Heart Counter**: Show love for standout pumpkins and track popularity in real time.
- **Detailed Inspection Modal**: View full-size high-res renders, author details, creation dates, and download stickers.

### 📁 User Dashboard

- **Personal Collection**: Manage all your published Jack-o'-Lanterns and stickers from a unified dashboard.
- **Sticker Management**: View community metrics (likes) and delete or re-download your previous creations.

### ⚡ Backend & Cloud Persistence

- **Appwrite Authentication**: Email and password user signup/login, persistent user sessions, and profile tracking.
- **Appwrite Cloud Database**: Scalable document storage for sticker metadata, author information, and engagement counters.
- **Appwrite Storage Bucket**: Secure, CDN-backed image asset hosting with instant previews.

---

## 🛠️ Tech Stack

| Category               | Technology                                                                                                       | Description                                            |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)                                   | Modern component architecture and type safety          |
| **Build Tool**         | [Vite 8](https://vitejs.dev/)                                                                                    | Ultra-fast HMR and bundle compilation                  |
| **3D Rendering**       | [Three.js](https://threejs.org/) + [React Three Fiber](https://r3f.docs.pmnd.rs/)                                | 3D scene graph, camera physics, and mesh interactions  |
| **3D Helpers & FX**    | [@react-three/drei](https://github.com/pmndrs/drei) + [Postprocessing](https://github.com/pmndrs/postprocessing) | Camera controls, lighting bloom, and visual effects    |
| **2D Canvas**          | [Konva](https://konvajs.org/) + [React Konva](https://github.com/konvajs/react-konva)                            | High-performance 2D drawing, layers, and transforms    |
| **State Management**   | [Zustand](https://github.com/pmndrs/zustand)                                                                     | Lightweight, predictable client and UI state           |
| **Styling**            | [Tailwind CSS v4](https://tailwindcss.com/)                                                                      | Modern utility-first styling with dark theme aesthetic |
| **Icons**              | [Lucide React](https://lucide.dev/)                                                                              | Consistent iconography across tools and navigation     |
| **Routing**            | [React Router DOM v7](https://reactrouter.com/)                                                                  | Client-side routing and protected view transitions     |
| **Backend / BaaS**     | [Appwrite Cloud](https://appwrite.io/)                                                                           | Serverless Auth, Database tables, and Cloud Storage    |

---

## 📂 Project Structure

```text
halloween-quest/
├── public/                     # Static assets & icons
├── src/
│   ├── appwrite/               # Appwrite BaaS client and service APIs
│   │   ├── auth.ts             # Authentication handlers (signup, login, getUser)
│   │   ├── config.ts           # Appwrite environment configuration
│   │   ├── db.ts               # Database CRUD operations for stickers & likes
│   │   ├── index.ts            # Appwrite Client, Account, TablesDB instances
│   │   └── storage.ts          # Storage bucket upload, delete & preview helpers
│   ├── assets/                 # App assets (textures, SVG templates)
│   ├── components/             # Reusable UI & 3D canvas components
│   │   ├── canvas/             # Three.js 3D scene & pumpkin meshes
│   │   └── ui/                 # Navbars, modal dialogs, toolbars & buttons
│   ├── pages/                  # Page routes
│   │   ├── Auth.tsx            # Login and sign-up views
│   │   ├── Craft.tsx           # Dimension selection studio portal
│   │   ├── Craft2D.tsx         # 2D Konva pumpkin sticker studio
│   │   ├── Craft3D.tsx         # 3D R3F pumpkin crafting studio
│   │   ├── Dashboard.tsx       # User's personal creations dashboard
│   │   ├── Landing.tsx         # Interactive landing page with blowout candle
│   │   ├── Layout.tsx          # Shared layout and global navigation
│   │   └── Showcase.tsx        # Community sticker showcase and feed
│   ├── types/                  # TypeScript interface declarations
│   ├── utils/                  # Canvas crafting logic, UI helpers & formatters
│   ├── zustand/                # Zustand global stores (app state, navbar state)
│   ├── App.tsx                 # Route configuration and core providers
│   └── main.tsx                # Application bootstrap entry point
├── .env.example                # Example environment variables template
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript compiler configuration
└── vite.config.ts              # Vite configuration with Tailwind CSS plugin
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed on your local machine:

- **Node.js** (v18.0.0 or higher recommended)
- **npm**, **pnpm**, or **yarn**
- An active [Appwrite Cloud](https://cloud.appwrite.io/) account (or self-hosted Appwrite instance)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/hallowcraft-3d.git
   cd hallowcraft-3d
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory by copying the example template:

```bash
cp .env.example .env
```

Open `.env` and fill in your Appwrite project credentials:

```env
VITE_APPWRITE_ENDPOINT="https://fra.cloud.appwrite.io/v1"
VITE_APPWRITE_PROJECT_ID="your_appwrite_project_id"
VITE_APPWRITE_DATABASE_ID="your_database_id"
VITE_APPWRITE_STICKERS_TABLE_ID="your_stickers_table_or_collection_id"
VITE_APPWRITE_STORAGE_BUCKET_ID="your_storage_bucket_id"
```

### Running Locally

Start the Vite development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` (or the host port indicated in your terminal).

---

## ☁️ Appwrite Setup Guide

To enable saving stickers, publishing to the showcase, and user accounts, configure your Appwrite console as follows:

### 1. Authentication

- In your Appwrite project dashboard, go to **Auth** > **Settings**.
- Enable **Email / Password** authentication.

### 2. Database & Table Schema

- Navigate to **Databases** and create a Database (e.g., `hallowcraft-db`).
- Inside your database, create a Collection/Table for **Stickers** (e.g., `stickers`) with the following attributes:

| Attribute Key | Type     | Size / Format | Required | Description                                  |
| ------------- | -------- | ------------- | :------: | -------------------------------------------- |
| `userId`      | String   | 255           |   Yes    | Appwrite User ID of the creator              |
| `title`       | String   | 255           |   Yes    | Name given to the pumpkin/sticker            |
| `authorName`  | String   | 255           |   Yes    | Display name of the creator                  |
| `fileId`      | String   | 255           |   Yes    | Storage bucket file ID for the sticker image |
| `description` | String   | 1000          |    No    | Optional description or story                |
| `likesCount`  | Integer  | -             |    No    | Default `0`, tracks total hearts received    |
| `tags`        | String[] | Array         |    No    | Tags associated with the creation            |
| `settings`    | String   | 5000          |    No    | Serialized crafting or dimensional settings  |

> **Permissions**: Grant `read("any")` for public showcase visibility, and `create("users")`, `update("users")`, `delete("users")` (or document-level permissions).

### 3. Storage Bucket Configuration

- Go to **Storage** and create a Bucket (e.g., `stickers-bucket`).
- Set allowed file extensions to images (`jpg`, `jpeg`, `png`, `webp`).
- **File Security & Permissions**:
  - Add `read("any")` so users can view images in the showcase.
  - Add `create("users")` so logged-in users can upload exported PNGs.

---

## 📜 Available Scripts

In the project directory, you can run:

| Command                | Action                                                                  |
| ---------------------- | ----------------------------------------------------------------------- |
| `npm run dev`          | Starts the local development server with HMR                            |
| `npm run build`        | Compiles TypeScript and creates an optimized production build in `dist` |
| `npm run preview`      | Locally preview the production build output                             |
| `npm run lint`         | Runs ESLint across the codebase                                         |
| `npm run format`       | Formats all files with Prettier                                         |
| `npm run format:check` | Verifies code formatting conformance without modifying files            |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project.
2. Create your Feature Branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your Changes:
   ```bash
   git commit -m "Add some AmazingFeature"
   ```
4. Push to the Branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request.

---

## 📄 License

This project is open-source and distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.

---

<div align="center">
  <sub>Built with 🎃 by the HallowCraft team. Happy crafting!</sub>
</div>
