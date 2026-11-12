# AI-POWERED CRIMINAL NETWORK ANALYSIS SYSTEM
### Smart India Hackathon (SIH) 2026 &bull; Law Enforcement Intelligence Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.21-blue.svg)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E.svg)](https://supabase.com/)
[![Google Gemini API](https://img.shields.io/badge/AI-Google%20Gemini%201.5-8E75C4.svg)](https://aistudio.google.com/)
[![vis-network](https://img.shields.io/badge/Graph-vis--network.js-orange.svg)](https://visjs.org/)
[![Leaflet.js](https://img.shields.io/badge/Geospatial-Leaflet.js-brightgreen.svg)](https://leafletjs.com/)

---

## 📌 Executive Overview
Law enforcement agencies handle vast quantities of fragmented, unstructured criminal investigation documents&mdash;such as First Information Reports (FIRs), interrogation memos, call detail records (CDRs), financial transaction logs, and forensic exhibits. Manually correlating linkages across multi-state criminal syndicates is labor-intensive and prone to investigative blind spots.

The **AI-Powered Criminal Network Analysis System** is a full-stack intelligence platform engineered for **Smart India Hackathon (SIH) 2026**. It transforms unstructured investigation documents into structured, searchable, and visual intelligence using **Artificial Intelligence, Natural Language Processing (NLP), Named Entity Recognition (NER), and Graph Analytics**.

---

## 🚀 Key Architectural Capabilities

### 1. Document Extraction & OCR Pipeline
- Multi-format ingestion: **PDF**, **DOCX**, **TXT**, and **JPG/PNG** images.
- Optical Character Recognition (OCR) via **Tesseract.js** for document scans.
- Native text parsing via `pdf-parse` and `mammoth`.

### 2. Google Gemini AI Analysis & NLP
- Extracts structured intelligence via Google Gemini API:
  - **Case Summary**: Executive investigative briefing and observations.
  - **Entity Extraction**: Suspects, victims, phone numbers, locations, vehicles, corporate shell entities, and bank accounts.
  - **Relationship Extraction**: Evidence-backed relationship mapping with source text quotations and confidence metrics (0–100%).
  - **Investigation Priority Score**: Explainable index (0–100) with risk-factor weights and recommended investigative actions.
  - **AI Investigative Recommendations**: Proactive suggestions (e.g., Section 91 CrPC notices, Section 102 CrPC account freezing, CDR tower dumps).

### 3. Interactive Criminal Network Graph (`vis-network.js`)
- Graph topology with distinct color nodes:
  - 🔴 **Suspects** (Red)
  - 🟠 **Organizations & Shells** (Orange)
  - 🟣 **Phone Numbers & VoIP** (Purple)
  - 🟢 **Bank Accounts & Crypto** (Emerald Green)
  - 🔵 **Vehicles** (Teal)
  - 🔷 **Locations** (Royal Blue)
- Dynamic force-directed physics, zoom, pan, entity search, and type filtering.
- **Slide-in Entity Inspector** with 1-click **"Verify as Officer"** workflow to maintain human-in-the-loop accountability.

### 4. Cryptographic Evidence Vault
- Digital chain-of-custody tracking with automated **SHA-256 cryptographic hashing**.
- Secure storage with audit trail recording who uploaded, accessed, or downloaded each exhibit.

### 5. Geospatial Crime Heat Map (`Leaflet.js` & OpenStreetMap)
- Interactive map plotting incident locations and criminal syndicate clusters across India.
- Color-coded pins by crime category with 1-click camera pan.

### 6. Dual-Mode Resilient Data Engine
- **Live Supabase Mode**: Connects directly to Supabase PostgreSQL and Storage when credentials are provided in `.env`.
- **Zero-Friction SIH Demo Mode**: Automatically activates if API keys are not yet configured, allowing judges and evaluators to test all 10 modules immediately with pre-loaded realistic synthetic data and high-fidelity NLP extraction.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla ES6+), Chart.js, Leaflet.js, vis-network.js, Font Awesome 6 |
| **Backend** | Node.js, Express.js, RESTful APIs, Multer, JWT, Bcrypt |
| **Document Processing** | `pdf-parse`, `mammoth`, `tesseract.js` |
| **Artificial Intelligence** | Google Gemini API (`@google/generative-ai`), NLP, NER |
| **Database & Storage** | Supabase PostgreSQL, Row Level Security (RLS), Local fallback engine |

---

## 📂 Project Directory Structure

```text
MINIProject/
├── server.js                     # Express application entry point & API router
├── package.json                  # Dependencies & npm scripts
├── schema.sql                    # Supabase PostgreSQL DDL schema & RLS policies
├── .env.example                  # Environment configuration template
├── .env                          # Local environment variables
├── README.md                     # Comprehensive project documentation
├── src/
│   ├── config/
│   │   └── supabase.js           # Supabase client initialization
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & role authorization
│   │   └── upload.js             # Multer upload handler for PDF/DOCX/Images
│   ├── routes/
│   │   ├── auth.js               # Officer login & profile endpoints
│   │   ├── dashboard.js          # Dynamic KPIs, charts data & alerts
│   │   ├── firs.js               # FIR CRUD operations
│   │   ├── cases.js              # Case management endpoints
│   │   ├── analysis.js           # Document upload, Gemini NLP & sample tests
│   │   ├── network.js            # Vis-network graph nodes & edges payload
│   │   ├── evidence.js           # Evidence vault & SHA-256 integrity checks
│   │   ├── reports.js            # AI dossier generation
│   │   └── audit.js              # Immutable audit logging & system diagnostics
│   ├── services/
│   │   ├── db.js                 # Dual-mode data service (Supabase + Local store)
│   │   ├── gemini.js             # Google Gemini AI & Rule-based NLP fallback
│   │   ├── extractor.js          # Text extraction from PDF, Word, TXT & OCR
│   │   └── seedData.js           # Realistic synthetic SIH 2026 data
│   └── storage/
│       ├── uploads/              # Uploaded FIR & case documents
│       ├── evidence/             # Secure digital evidence files
│       └── samples/              # Ready-to-use sample test cases
└── public/
    ├── index.html                # Main Intelligence Command Center Portal
    ├── login.html                # Government Officer Authentication Portal
    ├── css/
    │   ├── style.css             # Main portal UI & glassmorphism theme
    │   ├── network.css           # Vis-network styling & Inspector side-panel
    │   └── login.css             # Login page security styling
    ├── js/
    │   ├── api.js                # Frontend API client
    │   ├── app.js                # SPA navigation, modals & toasts
    │   ├── dashboard.js          # Dashboard KPIs & Chart.js instances
    │   ├── analysis.js           # File upload & AI analysis viewer
    │   ├── network.js            # Vis-network.js graph controller
    │   ├── firs.js               # FIR management controller
    │   ├── cases.js              # Case management controller
    │   ├── evidence.js           # Evidence vault controller
    │   ├── heatmap.js            # Leaflet.js crime map controller
    │   ├── performance.js        # Officer workload charts
    │   ├── reports.js            # AI report generator controller
    │   └── settings.js           # Officer settings & audit log viewer
    └── assets/
        ├── emblem.svg            # State Emblem of India vector graphic
        └── logo.svg              # Criminal Network Analysis System emblem
```

---

## ⚡ Quick Start & Execution Guide

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) installed on your machine.
Verify in terminal:
```bash
node -v
npm -v
```

### 2. Installation
Open the project directory in VS Code or Terminal and run:
```bash
npm install
```

### 3. Configure Environment Variables
A `.env` file is already created. You can optionally configure your credentials:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=sih-2026-super-secure-national-intelligence-jwt-secret-key-99824

# Google Gemini API Key (Get free key from https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# Supabase Credentials (Optional - Get from Supabase Dashboard > Project Settings > API)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Runs with full functionality even without external keys
DEMO_MODE=auto
```

*(Note: If `GEMINI_API_KEY` or `SUPABASE_URL` are omitted, the application runs seamlessly in High-Fidelity SIH Demo Mode with realistic synthetic data and full local persistence!)*

### 4. Start the Application
```bash
npm start
```
The server will boot and display:
```text
========================================================================
  AI-POWERED CRIMINAL NETWORK ANALYSIS SYSTEM
  Smart India Hackathon (SIH) 2026 - Law Enforcement Intelligence Portal
========================================================================
  > Command Center Portal : http://localhost:5000
  > Officer Login Page    : http://localhost:5000/login.html
  > Storage Engine        : Local Resilient Engine (Demo Mode)
  > AI Engine             : Google Gemini 1.5 / Local NLP Engine
========================================================================
```

---

## 🎯 Testing & Demonstration Workflows for Evaluators

### 1. Officer Authentication (`/login.html`)
- Go to `http://localhost:5000/login.html`
- Use the **1-Click Quick-Access Profiles** at the bottom of the card:
  - **Inspector Rajesh Sharma** (`IND-POL-8842` / `Officer@2026`) &ndash; Special Crime Branch
  - **ACP Sunita Verma** (`IND-POL-5521` / `Officer@2026`) &ndash; Cyber Forensics Cell
  - **DSP Amit Deshmukh** (`IND-POL-9914` / `Officer@2026`) &ndash; Anti-Narcotics Task Force
- Click **"SECURE VERIFICATION & LOGIN"** to enter the Command Center.

### 2. Main Dashboard (`#dashboard`)
- View 6 dynamic KPI cards dynamically loaded from database records.
- Explore interactive Chart.js visualizations (Monthly Crime Trends, Category Distribution, Case Statuses).
- Inspect the embedded Mini Criminal Network graph and real-time AI Intelligence Alerts feed.

### 3. Upload & AI Analysis (`#analysis`) &mdash; Core Feature
- Test with **1 Click** using the top quick-loaders:
  - **Load Extortion FIR (Shadow-X Syndicate)**
  - **Load Hawala & Banking Mule Dossier**
  - **Load Darknet Narcotics Seizure Memo**
- OR drag & drop any PDF/DOCX/TXT file or image.
- Click **"Upload and Analyze with AI"**.
- View structured intelligence results:
  - **Section A**: Executive summary & key observations.
  - **Section B**: Entity extraction chips & table with confidence ratings.
  - **Section C**: Relationship mapping table with extracted source evidence quotes.
  - **Section D**: Investigation Priority Score gauge (0–100) with contributing risk weights.
  - **Section E**: AI investigative recommendations.
- Click **"View in Criminal Network"** to immediately map extracted entities into the live graph!

### 4. Criminal Network Graph (`#network`)
- Explore the interactive graph powered by `vis-network.js`.
- Filter nodes by entity type (Suspects, Phones, Bank Accounts, Vehicles, Locations, Organizations).
- Search suspect names or phone numbers with auto-focus.
- Click any node to open the **Entity Inspector Slide-in Panel**.
- Click **"Verify as Officer"** to transition an AI finding to confirmed officer intelligence.

### 5. FIR Management (`#firs`)
- Click **"+ Register New FIR"** to submit a new FIR record.
- Search records in real-time or filter by crime category.
- View details, edit investigation status, or delete with confirmation.

### 6. Evidence Vault (`#evidence`)
- Deposit evidence exhibits with automated **SHA-256 digital fingerprinting**.
- Inspect chain of custody hashes for forensic court admissibility.

### 7. Geospatial Crime Heat Map (`#heatmap`)
- View case coordinates mapped across India using `Leaflet.js` in dark tactical mode.
- Filter clusters by crime category and priority.
- Click any high-priority location in the side panel to smoothly pan the camera.

### 8. AI Reports & Audit Logs (`#reports` & `#settings`)
- Generate official dossiers and case summaries.
- Export/Print reports in PDF format.
- Inspect the immutable audit log table recording every action taken on the system.

---

## 🔒 Security & Data Integrity
- **Zero Plaintext Credentials**: Bcrypt password hashing and JWT officer sessions.
- **Backend Key Protection**: Gemini API keys and Supabase service keys remain strictly on the backend.
- **Human-in-the-Loop**: All AI-inferred entities are explicitly tagged as unverified until an authorized officer reviews and confirms them.
- **Chain of Custody**: Cryptographic SHA-256 verification prevents evidence tampering.

---

## 🏆 Smart India Hackathon (SIH) 2026
Built with precision for law enforcement agencies to accelerate investigative decisions, identify hidden syndicates, and bring criminals to justice through explainable artificial intelligence.
