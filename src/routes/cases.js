// ==============================================================================
// Case Management Routes
// ==============================================================================

const express = require('express');
const router = express.Router();
const db = require('../services/db');
const { requireAuth } = require('../middleware/auth');

// GET /api/cases
router.get('/', requireAuth, async (req, res) => {
  try {
    let cases = await db.getCases();
    const { search, priority, status } = req.query;

    if (search) {
      const q = search.toLowerCase();
      cases = cases.filter(c =>
        (c.case_id && c.case_id.toLowerCase().includes(q)) ||
        (c.case_title && c.case_title.toLowerCase().includes(q)) ||
        (c.crime_type && c.crime_type.toLowerCase().includes(q)) ||
        (c.location && c.location.toLowerCase().includes(q)) ||
        (c.assigned_officer && c.assigned_officer.toLowerCase().includes(q))
      );
    }

    if (priority && priority !== 'All') {
      cases = cases.filter(c => c.priority === priority);
    }

    if (status && status !== 'All') {
      cases = cases.filter(c => c.status === status);
    }

    res.json({ success: true, count: cases.length, data: cases });
  } catch (error) {
    console.error('[CASES API] Error getting cases:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve cases' });
  }
});

// GET /api/cases/:id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const c = await db.getCaseById(req.params.id);
    if (!c) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    // Also fetch associated entities, relationships, evidence
    const entities = await db.getEntities(c.id);
    const relationships = await db.getRelationships(c.id);
    const evidence = await db.getEvidence(c.id);

    res.json({
      success: true,
      data: {
        ...c,
        entities,
        relationships,
        evidence
      }
    });
  } catch (error) {
    console.error('[CASES API] Error getting case by ID:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve case details' });
  }
});

// POST /api/cases
router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      case_id,
      case_title,
      crime_type,
      description,
      suspects_count,
      assigned_officer,
      investigation_progress,
      priority,
      status,
      fir_number,
      location,
      lat,
      lng
    } = req.body;

    if (!case_title || !crime_type || !location) {
      return res.status(400).json({
        success: false,
        message: 'Case Title, Crime Type, and Location are required'
      });
    }

    const created = await db.createCase({
      case_id,
      case_title,
      crime_type,
      description,
      suspects_count,
      assigned_officer: assigned_officer || (req.user ? req.user.name : "Inspector Rajesh Sharma"),
      investigation_progress,
      priority: priority || "High",
      status: status || "Under Investigation",
      fir_number,
      location,
      lat,
      lng
    });

    await db.addAuditLog(
      req.user ? req.user.name : 'Investigating Officer',
      req.user ? req.user.officer_id : 'IND-POL-8842',
      'CASE_CREATED',
      `Registered new Investigation Case: ${created.case_id} - ${created.case_title}`
    );

    res.status(201).json({ success: true, message: 'Case created successfully', data: created });
  } catch (error) {
    console.error('[CASES API] Error creating case:', error);
    res.status(500).json({ success: false, message: 'Failed to create case' });
  }
});

// PUT /api/cases/:id
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const updated = await db.updateCase(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    await db.addAuditLog(
      req.user ? req.user.name : 'Investigating Officer',
      req.user ? req.user.officer_id : 'IND-POL-8842',
      'CASE_MODIFIED',
      `Updated case details/progress for: ${updated.case_id}`
    );

    res.json({ success: true, message: 'Case updated successfully', data: updated });
  } catch (error) {
    console.error('[CASES API] Error updating case:', error);
    res.status(500).json({ success: false, message: 'Failed to update case' });
  }
});

// DELETE /api/cases/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await db.deleteCase(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    await db.addAuditLog(
      req.user ? req.user.name : 'Investigating Officer',
      req.user ? req.user.officer_id : 'IND-POL-8842',
      'CASE_DELETED',
      `Deleted investigation case ID: ${req.params.id}`
    );

    res.json({ success: true, message: 'Case deleted successfully' });
  } catch (error) {
    console.error('[CASES API] Error deleting case:', error);
    res.status(500).json({ success: false, message: 'Failed to delete case' });
  }
});

module.exports = router;
