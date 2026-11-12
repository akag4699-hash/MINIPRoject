// ==============================================================================
// Authentication Routes (Supabase Auth + Local Fallback)
// ==============================================================================

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../services/db');
const { JWT_SECRET } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { officerId, password } = req.body;

    if (!officerId) {
      return res.status(400).json({ success: false, message: 'Officer ID is required' });
    }

    // Lookup officer
    const officer = await db.getOfficerByLogin(officerId);

    if (!officer) {
      return res.status(401).json({ success: false, message: 'Invalid Officer Credentials or Officer ID not registered' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: officer.id,
        officer_id: officer.officer_id,
        name: officer.name,
        badge_number: officer.badge_number,
        designation: officer.designation,
        department: officer.department,
        email: officer.email,
        role: officer.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Audit log
    await db.addAuditLog(
      officer.name,
      officer.officer_id,
      'OFFICER_LOGIN',
      `Officer authenticated successfully into National Command Center.`
    );

    res.json({
      success: true,
      token,
      officer: {
        id: officer.id,
        officer_id: officer.officer_id,
        name: officer.name,
        badge_number: officer.badge_number,
        designation: officer.designation,
        department: officer.department,
        email: officer.email,
        role: officer.role,
        avatar_url: officer.avatar_url,
        phone: officer.phone
      }
    });

  } catch (error) {
    console.error('[AUTH API] Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server authentication error' });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  const officerName = req.body.officerName || 'Investigating Officer';
  const officerId = req.body.officerId || 'IND-POL-0000';
  await db.addAuditLog(officerName, officerId, 'OFFICER_LOGOUT', 'Officer logged out of session safely.');
  res.json({ success: true, message: 'Successfully logged out' });
});

// GET /api/auth/profile
router.get('/profile', async (req, res) => {
  const officerId = req.query.officerId || 'IND-POL-8842';
  const officer = await db.getOfficerByLogin(officerId);
  if (!officer) {
    return res.status(404).json({ success: false, message: 'Officer not found' });
  }
  res.json({ success: true, officer });
});

module.exports = router;
