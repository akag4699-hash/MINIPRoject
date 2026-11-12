// ==============================================================================
// Audit Logs & System Status Routes
// ==============================================================================

const express = require('express');
const router = express.Router();
const db = require('../services/db');
const gemini = require('../services/gemini');
const { requireAuth } = require('../middleware/auth');

// GET /api/audit-logs
router.get('/audit-logs', requireAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const logs = await db.getAuditLogs(limit);
    res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    console.error('[AUDIT API] Error getting audit logs:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve audit trail' });
  }
});

// GET /api/system/status
router.get('/system/status', requireAuth, async (req, res) => {
  try {
    const stats = await db.getDashboardStats();
    res.json({
      success: true,
      data: {
        system: "AI-Powered Criminal Network Analysis System",
        edition: "Smart India Hackathon (SIH) 2026 Edition",
        status: "OPERATIONAL",
        databaseMode: db.isLive() ? "Supabase PostgreSQL (Live Connected)" : "Local Resilient Storage (SIH Demo Mode)",
        geminiConfigured: gemini.isConfigured(),
        geminiModel: process.env.GEMINI_MODEL || "gemini-1.5-flash",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        stats: stats.kpis
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get system status' });
  }
});

module.exports = router;
