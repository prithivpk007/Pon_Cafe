# PON CAFE / Rukmani Bakery - Web Application

A full-stack bakery website and online ordering system for **PON CAFE (Rukmani Bakery)**, Chennimalai, Erode.

---

## 📁 Project Architecture & Folder Separation

The project is strictly separated into standalone **`frontend`** and **`backend`** folders:

```text
PON_CAFE/
├── backend/                       # Node.js + Express + TypeScript API Server
│   ├── data/                      # Local JSON store (db.json)
│   ├── src/                       # Backend source code
│   │   ├── config/                # Database and application configuration
│   │   ├── middleware/            # Auth & validation middleware
│   │   ├── routes/                # Express API route handlers
│   │   ├── seeds/                 # Seed database data
│   │   ├── server.ts              # Server bootstrap entry point
│   │   ├── test-suite.ts          # API tests
│   │   └── types.ts               # Shared TypeScript schemas/types
│   ├── uploads/                   # Runtime image uploads directory
│   ├── .env.example               # Backend environment template
│   ├── .gitignore                 # Backend-specific ignore rules
│   ├── package.json               # Backend dependencies and scripts
│   └── tsconfig.json              # Backend TypeScript config
│
├── frontend/                      # React 19 + TypeScript + Vite + TailwindCSS
│   ├── public/                    # Static public assets
│   ├── src/                       # Frontend source code
│   │   ├── assets/                # Images and media assets
│   │   ├── components/            # Reusable UI components
│   │   ├── context/               # React Context providers (Auth, Cart)
│   │   ├── pages/                 # Application views & pages
│   │   ├── services/              # API client service layer
│   │   ├── types/                 # Frontend TypeScript definitions
│   │   ├── App.tsx                # Main App component & router
│   │   └── main.tsx               # Client entry point
│   ├── .env.example               # Frontend environment template
│   ├── .gitignore                 # Frontend-specific ignore rules
│   ├── index.html                 # Single-page HTML entry point
│   ├── package.json               # Frontend dependencies and scripts
│   ├── tailwind.config.js         # Tailwind configuration
│   └── vite.config.ts             # Vite bundler & API proxy configuration
│
├── .gitignore                     # Root-level output & secret file exclusions
├── package.json                   # Root workspace scripts (run both or individually)
└── README.md                      # Project documentation
```

---

## 🛡️ Output & Temporary Files Management

All transient, generated, and sensitive files are strictly excluded from source control across all folders:
- **Build / Output Files**: `dist/`, `build/`, `out/`, `dist-ssr/`, `.vite/`, `*.tsbuildinfo`
- **Dependencies**: `node_modules/` in root, backend, and frontend
- **Environment & Secrets**: `.env`, `.env.local`, `.env.*.local`
- **Dynamic Uploads**: `backend/uploads/*` (preserving `.gitkeep`)
- **Runtime Temporary Data**: `backend/data/*.tmp`, `backend/data/db.json.tmp`
- **Log Files**: `logs/`, `*.log`, `npm-debug.log*`

---

## 🚀 Quick Start & Development

### 1. Install Dependencies
From the project root:
```bash
npm run install:all
```
*(or run `npm install` inside root, `frontend`, and `backend` separately)*

### 2. Run Both Frontend and Backend Concurrently
```bash
npm run dev
```
- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Health**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🛠️ Individual Commands & Scripts

### Run Independently
| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts **both** Backend and Frontend concurrently |
| `npm run dev:frontend` | Starts **only** the Frontend Vite dev server |
| `npm run dev:backend` | Starts **only** the Backend Express dev server |
| `npm run seed` | Re-seeds initial products, cakes, offers, and admin account |

### Build for Production
| Command | Description |
| :--- | :--- |
| `npm run build` | Builds both Backend (TypeScript) and Frontend (Vite) |
| `npm run build:frontend` | Builds frontend production bundle to `frontend/dist` |
| `npm run build:backend` | Compiles backend TypeScript to `backend/dist` |
| `npm run start:backend` | Starts compiled backend server (`backend/dist/server.js`) |
| `npm run preview:frontend`| Previews the frontend production build locally |
| `npm run lint` | Runs frontend code linter (Oxlint) |

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:5173

# Optional: MongoDB URI (defaults to embedded JSON store if omitted)
# MONGODB_URI=mongodb://localhost:27017/pon_cafe
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=/api
VITE_APP_TITLE=PON CAFE - Rukmani Bakery
```

---

## 🧁 Store Details
- **Shop**: PON CAFE / Rukmani Bakery
- **Address**: Kangeayam Road, Chennimalai, Erode – 638051
- **Admin**: Rukmani
- **Contact**: 6374123265
