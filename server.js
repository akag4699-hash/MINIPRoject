// ==============================================================================
// AI-POWERED CRIMINAL NETWORK ANALYSIS SYSTEM
// Smart India Hackathon (SIH) 2026 - Main Server Entry Point
// ==============================================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./src/routes/auth');
const dashboardRoutes = require('./src/routes/dashboard');
const firsRoutes = require('./src/routes/firs');
const casesRoutes = require('./src/routes/cases');
const analysisRoutes = require('./src/routes/analysis');
const networkRoutes = require('./src/routes/network');
const evidenceRoutes = require('./src/routes/evidence');
const reportsRoutes = require('./src/routes/reports');
const auditRoutes = require('./src/routes/audit');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static file hosting for Frontend UI and uploaded storage
app.use(express.static(path.join(__dirname, 'public')));
app.use('/storage', express.static(path.join(__dirname, 'src', 'storage')));

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/firs', firsRoutes);
app.use('/api/cases', casesRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/network', networkRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api', auditRoutes);

// Ensure storage directories exist
const uploadsDir = path.join(__dirname, 'src', 'storage', 'uploads');
const evidenceDir = path.join(__dirname, 'src', 'storage', 'evidence');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(evidenceDir)) fs.mkdirSync(evidenceDir, { recursive: true });

// Route Fallback
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Catch-all SPA handler without fragile path-to-regexp wildcard syntax
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const startServer = (portToTry) => {
  const server = app.listen(portToTry, () => {
    console.log('========================================================================');
    console.log('  AI-POWERED CRIMINAL NETWORK ANALYSIS SYSTEM');
    console.log('  Smart India Hackathon (SIH) 2026 - Law Enforcement Intelligence Portal');
    console.log('========================================================================');
    console.log(`  > Command Center Portal : http://localhost:${portToTry}`);
    console.log(`  > Officer Login Page    : http://localhost:${portToTry}/login.html`);
    console.log(`  > Environment           : ${process.env.NODE_ENV || 'development'}`);
    console.log(`  > Storage Engine        : ${process.env.SUPABASE_URL ? 'Supabase PostgreSQL' : 'Local Resilient Engine (Demo Mode)'}`);
    console.log(`  > AI Engine             : ${process.env.GEMINI_API_KEY ? 'Google Gemini 1.5' : 'Local NLP & Extraction Engine'}`);
    console.log('========================================================================');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = Number(portToTry) + 1;
      console.warn(`[PORT CONFLICT] Port ${portToTry} is already in use by another instance.`);
      console.log(`[PORT FALLBACK] Automatically switching to next available port: ${nextPort}...`);
      startServer(nextPort);
    } else {
      console.error('[SERVER ERROR]', err);
    }
  });
};

startServer(PORT);
