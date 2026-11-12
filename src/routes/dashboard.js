// ==============================================================================
// Dashboard API Routes
// ==============================================================================

const express = require('express');
const router = express.Router();
const db = require('../services/db');
const { requireAuth } = require('../middleware/auth');

// GET /api/dashboard/stats
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const stats = await db.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('[DASHBOARD API] Error getting stats:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve dashboard statistics' });
  }
});

// GET /api/dashboard/recent-cases
router.get('/recent-cases', requireAuth, async (req, res) => {
  try {
    const cases = await db.getCases();
    const recent = cases.slice(0, 6);
    res.json({ success: true, data: recent });
  } catch (error) {
    console.error('[DASHBOARD API] Error getting recent cases:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve recent cases' });
  }
});

// GET /api/dashboard/alerts
router.get('/alerts', requireAuth, async (req, res) => {
  try {
    const alerts = await db.getNotifications();
    res.json({ success: true, data: alerts });
  } catch (error) {
    console.error('[DASHBOARD API] Error getting alerts:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve intelligence alerts' });
  }
});

module.exports = router;
