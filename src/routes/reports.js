// ==============================================================================
// AI Reports Generation Routes
// ==============================================================================

const express = require('express');
const router = express.Router();
const db = require('../services/db');
const { requireAuth } = require('../middleware/auth');

// GET /api/reports
router.get('/', requireAuth, async (req, res) => {
  try {
    const reports = await db.getReports();
    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    console.error('[REPORTS API] Error getting reports:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve reports' });
  }
});

// POST /api/reports/generate
router.post('/generate', requireAuth, async (req, res) => {
  try {
    const { report_title, report_type, case_id, additional_notes } = req.body;

    const caseObj = case_id ? await db.getCaseById(case_id) : null;
    const entities = await db.getEntities(case_id || null);
    const relationships = await db.getRelationships(case_id || null);

    const generatedTitle = report_title || `${report_type || 'Investigation Report'} - ${caseObj ? caseObj.case_title : 'Cross-Agency Briefing'}`;
    
    const summary = `OFFICIAL LAW ENFORCEMENT INTELLIGENCE REPORT
TITLE: ${generatedTitle}
CLASSIFICATION: CONFIDENTIAL / FOR OFFICIAL POLICE USE ONLY
DATE: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}
AUTHOR: ${req.user ? req.user.name : 'Inspector Rajesh Sharma'} (${req.user ? req.user.designation : 'Lead Investigator'})

1. EXECUTIVE SUMMARY:
This intelligence dossier consolidates multi-source natural language extraction, telecommunications call detail records, financial banking corridors, and graph relationship topologies. Investigation identifies active network involving ${entities.length} nodes and ${relationships.length} validated/inferred linkages.

2. CASE CONTEXT:
${caseObj ? `Target Case: ${caseObj.case_id} (${caseObj.case_title})\nCrime Classification: ${caseObj.crime_type}\nJurisdiction Area: ${caseObj.location}\nInvestigation Status: ${caseObj.status} (Progress: ${caseObj.investigation_progress}%)\nPriority Rating: ${caseObj.priority}` : 'Cross-jurisdictional intelligence summary across active command operations.'}

3. PRIMARY SUSPECT NODES & ENTITIES:
${entities.slice(0, 5).map(e => `• [${e.entity_type.toUpperCase()}] ${e.label} (Confidence: ${e.confidence}%, Risk: ${e.risk_level.toUpperCase()})`).join('\n')}

4. KEY EVIDENCE-BACKED RELATIONSHIPS:
${relationships.slice(0, 5).map(r => `• Link: ${r.relationship_type.replace(/_/g, ' ').toUpperCase()} (Confidence: ${r.confidence}%)\n  Evidence Quote: "${r.source_text || 'Documented in case diary'}"`).join('\n')}

5. ACTIONABLE RECOMMENDATIONS:
- Proceed with immediate freezing orders under Section 102 Cr.P.C. for flagged bank nodes.
- Request telecommunication providers for real-time CDR and tower dump coordinates.
- Coordinate with state Cyber Cell and INTERPOL NCB if cross-border remittances are indicated.
- Maintain chain of custody for all digital and physical exhibits.
${additional_notes ? `\nADDITIONAL OFFICER REMARKS:\n${additional_notes}` : ''}`;

    const created = await db.createReport({
      report_title: generatedTitle,
      report_type: report_type || 'Investigation Dossier',
      case_id: case_id || null,
      generated_by: req.user ? req.user.name : "Inspector Rajesh Sharma",
      summary_content: summary,
      details_json: {
        totalEntities: entities.length,
        totalRelationships: relationships.length,
        riskLevel: caseObj ? caseObj.priority : "HIGH",
        generatedDate: new Date().toISOString()
      }
    });

    await db.addAuditLog(
      req.user ? req.user.name : 'Investigating Officer',
      req.user ? req.user.officer_id : 'IND-POL-8842',
      'REPORT_GENERATED',
      `Generated intelligence report: ${created.report_number} (${created.report_title})`
    );

    res.status(201).json({
      success: true,
      message: 'Intelligence report generated successfully',
      data: created
    });

  } catch (error) {
    console.error('[REPORTS API] Generate error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate report' });
  }
});

module.exports = router;
