// ==============================================================================
// FIR Management Routes
// ==============================================================================

const express = require('express');
const router = express.Router();
const db = require('../services/db');
const { requireAuth } = require('../middleware/auth');

// GET /api/firs
router.get('/', requireAuth, async (req, res) => {
  try {
    let firs = await db.getFIRs();
    const { search, category, status } = req.query;

    if (search) {
      const q = search.toLowerCase();
      firs = firs.filter(f => 
        (f.fir_number && f.fir_number.toLowerCase().includes(q)) ||
        (f.complainant_name && f.complainant_name.toLowerCase().includes(q)) ||
        (f.description && f.description.toLowerCase().includes(q)) ||
        (f.incident_location && f.incident_location.toLowerCase().includes(q))
      );
    }

    if (category && category !== 'All') {
      firs = firs.filter(f => f.crime_category === category);
    }

    if (status && status !== 'All') {
      firs = firs.filter(f => f.status === status);
    }

    res.json({ success: true, count: firs.length, data: firs });
  } catch (error) {
    console.error('[FIR API] Error getting FIRs:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve FIR records' });
  }
});

// GET /api/firs/:id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const fir = await db.getFIRById(req.params.id);
    if (!fir) {
      return res.status(404).json({ success: false, message: 'FIR record not found' });
    }
    res.json({ success: true, data: fir });
  } catch (error) {
    console.error('[FIR API] Error getting FIR by ID:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve FIR' });
  }
});

// POST /api/firs
router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      fir_number,
      complainant_name,
      crime_category,
      incident_location,
      incident_date,
      description,
      investigating_officer,
      status,
      priority,
      lat,
      lng
    } = req.body;

    if (!complainant_name || !crime_category || !incident_location || !description) {
      return res.status(400).json({
        success: false,
        message: 'Complainant Name, Crime Category, Location, and Description are required'
      });
    }

    const created = await db.createFIR({
      fir_number,
      complainant_name,
      crime_category,
      incident_location,
      incident_date,
      description,
      investigating_officer: investigating_officer || (req.user ? req.user.name : "Inspector Rajesh Sharma"),
      status: status || "Registered",
      priority: priority || "High",
      lat,
      lng
    });

    await db.addAuditLog(
      req.user ? req.user.name : 'Investigating Officer',
      req.user ? req.user.officer_id : 'IND-POL-8842',
      'FIR_CREATED',
      `Registered new FIR record: ${created.fir_number} (${crime_category})`
    );

    res.status(201).json({ success: true, message: 'FIR registered successfully', data: created });
  } catch (error) {
    console.error('[FIR API] Error creating FIR:', error);
    res.status(500).json({ success: false, message: 'Failed to register FIR' });
  }
});

// PUT /api/firs/:id
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const updated = await db.updateFIR(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'FIR record not found' });
    }

    await db.addAuditLog(
      req.user ? req.user.name : 'Investigating Officer',
      req.user ? req.user.officer_id : 'IND-POL-8842',
      'FIR_MODIFIED',
      `Updated FIR status/details for: ${updated.fir_number}`
    );

    res.json({ success: true, message: 'FIR updated successfully', data: updated });
  } catch (error) {
    console.error('[FIR API] Error updating FIR:', error);
    res.status(500).json({ success: false, message: 'Failed to update FIR' });
  }
});

// DELETE /api/firs/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await db.deleteFIR(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'FIR record not found' });
    }

    await db.addAuditLog(
      req.user ? req.user.name : 'Investigating Officer',
      req.user ? req.user.officer_id : 'IND-POL-8842',
      'FIR_DELETED',
      `Deleted FIR record ID: ${req.params.id}`
    );

    res.json({ success: true, message: 'FIR deleted successfully' });
  } catch (error) {
    console.error('[FIR API] Error deleting FIR:', error);
    res.status(500).json({ success: false, message: 'Failed to delete FIR' });
  }
});

module.exports = router;
