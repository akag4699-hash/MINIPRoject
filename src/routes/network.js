// ==============================================================================
// Criminal Network Graph Routes (vis-network.js formatted payload)
// ==============================================================================

const express = require('express');
const router = express.Router();
const db = require('../services/db');
const { requireAuth } = require('../middleware/auth');

// Color mapping for Vis-Network intelligence nodes
const ENTITY_COLOR_MAP = {
  suspect: {
    background: '#dc2626', // Red
    border: '#991b1b',
    highlight: { background: '#ef4444', border: '#b91c1c' }
  },
  organization: {
    background: '#ea580c', // Orange
    border: '#c2410c',
    highlight: { background: '#f97316', border: '#9a3412' }
  },
  phone: {
    background: '#7c3aed', // Purple
    border: '#6d28d9',
    highlight: { background: '#8b5cf6', border: '#5b21b6' }
  },
  bank_account: {
    background: '#059669', // Emerald Green
    border: '#047857',
    highlight: { background: '#10b981', border: '#065f46' }
  },
  vehicle: {
    background: '#0891b2', // Cyan / Teal
    border: '#0e7490',
    highlight: { background: '#06b6d4', border: '#155e75' }
  },
  location: {
    background: '#2563eb', // Royal Blue
    border: '#1d4ed8',
    highlight: { background: '#3b82f6', border: '#1e40af' }
  }
};

const ENTITY_ICONS = {
  suspect: 'fa-user-secret',
  organization: 'fa-building',
  phone: 'fa-phone-volume',
  bank_account: 'fa-credit-card',
  vehicle: 'fa-car-side',
  location: 'fa-location-dot'
};

// GET /api/network
router.get('/', requireAuth, async (req, res) => {
  try {
    const { case_id, entity_type, search } = req.query;

    let entities = await db.getEntities(case_id || null);
    let relationships = await db.getRelationships(case_id || null);

    // Filter by entity_type
    if (entity_type && entity_type !== 'all') {
      entities = entities.filter(e => e.entity_type === entity_type);
      const entityIds = new Set(entities.map(e => e.id));
      relationships = relationships.filter(r => entityIds.has(r.source_entity_id) && entityIds.has(r.target_entity_id));
    }

    // Filter by search query
    if (search) {
      const q = search.toLowerCase();
      const matchedEntityIds = new Set();
      entities.forEach(e => {
        if ((e.label && e.label.toLowerCase().includes(q)) || (e.entity_value && e.entity_value.toLowerCase().includes(q))) {
          matchedEntityIds.add(e.id);
        }
      });
      // Include also directly connected entities
      relationships.forEach(r => {
        if (matchedEntityIds.has(r.source_entity_id)) matchedEntityIds.add(r.target_entity_id);
        if (matchedEntityIds.has(r.target_entity_id)) matchedEntityIds.add(r.source_entity_id);
      });
      entities = entities.filter(e => matchedEntityIds.has(e.id));
      relationships = relationships.filter(r => matchedEntityIds.has(r.source_entity_id) && matchedEntityIds.has(r.target_entity_id));
    }

    // Format nodes for vis-network
    const nodes = entities.map(e => {
      const colors = ENTITY_COLOR_MAP[e.entity_type] || { background: '#475569', border: '#334155' };
      const iconClass = ENTITY_ICONS[e.entity_type] || 'fa-circle';
      return {
        id: e.id,
        label: e.label || e.entity_value,
        title: `${e.entity_type.toUpperCase()}: ${e.entity_value} (Confidence: ${e.confidence}% | ${e.is_verified ? 'VERIFIED' : 'UNVERIFIED'})`,
        color: colors,
        shape: e.entity_type === 'suspect' ? 'box' : 'dot',
        size: e.entity_type === 'suspect' ? 30 : 20,
        font: { color: '#ffffff', size: 12, face: 'Inter, sans-serif' },
        borderWidth: e.is_verified ? 3 : 1,
        borderWidthSelected: 4,
        data: e
      };
    });

    // Format edges for vis-network
    const edges = relationships.map(r => {
      const isUnverified = !r.is_verified;
      return {
        id: r.id,
        from: r.source_entity_id,
        to: r.target_entity_id,
        label: r.relationship_type.replace(/_/g, ' '),
        title: `Relationship: ${r.relationship_type}\nConfidence: ${r.confidence}%\nEvidence: ${r.source_text || 'No text provided'}\nStatus: ${r.is_verified ? 'Verified by Officer' : 'AI-Inferred (Unverified)'}`,
        arrows: 'to',
        color: {
          color: isUnverified ? '#94a3b8' : '#38bdf8',
          highlight: '#38bdf8'
        },
        dashes: isUnverified, // dashed lines for unverified AI relationships
        font: { color: '#94a3b8', size: 10, align: 'middle', background: '#0a1128' },
        width: Math.max(1, Math.round((r.confidence || 70) / 30)),
        data: r
      };
    });

    res.json({
      success: true,
      data: {
        nodes,
        edges,
        totalNodes: nodes.length,
        totalEdges: edges.length
      }
    });

  } catch (error) {
    console.error('[NETWORK API] Error getting network graph:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve criminal network graph' });
  }
});

// GET /api/network/:entityId - Granular entity neighborhood and evidence
router.get('/:entityId', requireAuth, async (req, res) => {
  try {
    const entity = await db.getEntityById(req.params.entityId);
    if (!entity) {
      return res.status(404).json({ success: false, message: 'Entity not found' });
    }

    const allRelationships = await db.getRelationships();
    const connectedRels = allRelationships.filter(
      r => r.source_entity_id === entity.id || r.target_entity_id === entity.id
    );

    const neighborIds = new Set();
    connectedRels.forEach(r => {
      if (r.source_entity_id !== entity.id) neighborIds.add(r.source_entity_id);
      if (r.target_entity_id !== entity.id) neighborIds.add(r.target_entity_id);
    });

    const neighbors = [];
    for (const nId of neighborIds) {
      const n = await db.getEntityById(nId);
      if (n) neighbors.push(n);
    }

    res.json({
      success: true,
      data: {
        entity,
        connections: connectedRels,
        neighbors
      }
    });

  } catch (error) {
    console.error('[NETWORK API] Error getting entity details:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve entity network details' });
  }
});

// POST /api/network/verify/:type/:id - Officer marks entity or relationship as verified
router.post('/verify/:type/:id', requireAuth, async (req, res) => {
  try {
    const { type, id } = req.params;
    if (type === 'entity') {
      const entity = await db.getEntityById(id);
      if (entity) {
        entity.is_verified = true;
        await db.addAuditLog(
          req.user ? req.user.name : 'Officer',
          req.user ? req.user.officer_id : 'IND-POL-8842',
          'ENTITY_VERIFIED',
          `Verified AI-extracted entity: ${entity.label}`
        );
        return res.json({ success: true, message: 'Entity verified by officer', data: entity });
      }
    } else if (type === 'relationship') {
      const rels = await db.getRelationships();
      const rel = rels.find(r => r.id === id);
      if (rel) {
        rel.is_verified = true;
        await db.addAuditLog(
          req.user ? req.user.name : 'Officer',
          req.user ? req.user.officer_id : 'IND-POL-8842',
          'RELATIONSHIP_VERIFIED',
          `Verified AI-extracted relationship ID: ${id}`
        );
        return res.json({ success: true, message: 'Relationship verified by officer', data: rel });
      }
    }
    res.status(404).json({ success: false, message: 'Target not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
