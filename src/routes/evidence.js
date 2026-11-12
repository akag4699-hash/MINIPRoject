// ==============================================================================
// Evidence Vault Routes
// Supports Secure Evidence Upload, Digital Chain of Custody (SHA-256), and Audit Logs
// ==============================================================================

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const upload = require('../middleware/upload');
const db = require('../services/db');
const { requireAuth } = require('../middleware/auth');

// GET /api/evidence
router.get('/', requireAuth, async (req, res) => {
  try {
    const { case_id, category, search } = req.query;
    let items = await db.getEvidence(case_id || null);

    if (category && category !== 'All') {
      items = items.filter(i => i.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(i =>
        (i.evidence_number && i.evidence_number.toLowerCase().includes(q)) ||
        (i.file_name && i.file_name.toLowerCase().includes(q)) ||
        (i.description && i.description.toLowerCase().includes(q)) ||
        (i.case_number && i.case_number.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    console.error('[EVIDENCE API] Error getting evidence:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve evidence records' });
  }
});

// GET /api/evidence/:id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const items = await db.getEvidence();
    const item = items.find(i => i.id === req.params.id || i.evidence_number === req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Evidence file not found' });
    }

    // Log evidence access for chain of custody audit
    await db.addAuditLog(
      req.user ? req.user.name : 'Officer',
      req.user ? req.user.officer_id : 'IND-POL-8842',
      'EVIDENCE_ACCESSED',
      `Officer inspected evidence item ${item.evidence_number} (${item.file_name})`
    );

    res.json({ success: true, data: item });
  } catch (error) {
    console.error('[EVIDENCE API] Error getting evidence by ID:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve evidence' });
  }
});

// POST /api/evidence/upload
router.post('/upload', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Evidence file is required' });
    }

    const file = req.file;
    const { category, case_id, case_number, description } = req.body;

    // Compute cryptographic SHA-256 hash for forensic chain-of-custody verification
    const fileBuffer = fs.readFileSync(file.path);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    const sha256Hex = hashSum.digest('hex');

    const created = await db.createEvidence({
      file_name: file.originalname,
      file_path: `/storage/evidence/${path.basename(file.path)}`,
      file_type: file.mimetype,
      file_size: file.size,
      category: category || 'Forensic Lab Report',
      case_id: case_id || null,
      case_number: case_number || 'CASE-2026-089',
      uploaded_by: req.user ? req.user.name : 'Inspector Rajesh Sharma',
      description: description || 'Digital evidence item deposited into secure evidence vault.',
      hash_sha256: sha256Hex
    });

    await db.addAuditLog(
      req.user ? req.user.name : 'Investigating Officer',
      req.user ? req.user.officer_id : 'IND-POL-8842',
      'EVIDENCE_DEPOSITED',
      `Deposited evidence ${created.evidence_number} (${file.originalname}) with SHA-256 checksum ${sha256Hex.substring(0, 16)}...`
    );

    res.status(201).json({
      success: true,
      message: 'Evidence securely deposited into vault with verified cryptographic hash',
      data: created
    });

  } catch (error) {
    console.error('[EVIDENCE API] Upload error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload evidence' });
  }
});

module.exports = router;
