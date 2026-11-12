// ==============================================================================
// AI Upload & Analysis Routes (Google Gemini + Text Extraction + NER)
// ==============================================================================

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const upload = require('../middleware/upload');
const extractor = require('../services/extractor');
const gemini = require('../services/gemini');
const db = require('../services/db');
const { requireAuth } = require('../middleware/auth');

// POST /api/analysis/upload
router.post('/upload', requireAuth, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a valid investigation document to upload' });
    }

    const file = req.file;
    const originalName = file.originalname;
    const filePath = file.path;
    const caseId = req.body.case_id || null;

    console.log(`[ANALYSIS] Received upload: ${originalName} (${(file.size / 1024).toFixed(1)} KB)`);

    // 1. Extract text from document (PDF / DOCX / TXT / OCR Image)
    const extractionResult = await extractor.extractText(filePath, file.mimetype, originalName);
    
    if (!extractionResult.text || extractionResult.text.trim().length === 0) {
      return res.status(422).json({
        success: false,
        message: 'Unable to extract legible text from document. Please ensure document is not password-protected or blank.'
      });
    }

    // 2. Perform AI NLP Analysis (Gemini API or High-Fidelity Local Engine)
    const aiResult = await gemini.analyzeDocument(extractionResult.text, originalName);

    // 3. Persist Extracted Entities into Database & Criminal Network Graph
    const createdEntities = [];
    const entityMap = new Map(); // entity_value -> entity_id

    if (aiResult.entities && Array.isArray(aiResult.entities)) {
      for (const ent of aiResult.entities) {
        const savedEntity = await db.createEntity({
          case_id: caseId || "c1a22222-2222-4222-b222-222222222201",
          entity_type: ent.entity_type,
          entity_value: ent.entity_value,
          label: ent.label || ent.entity_value,
          confidence: ent.confidence || 85,
          is_verified: false, // Marked as unverified until human review
          risk_level: ent.risk_level || 'medium',
          metadata: ent.metadata || {}
        });
        createdEntities.push(savedEntity);
        entityMap.set(ent.entity_value.toLowerCase(), savedEntity.id);
      }
    }

    // 4. Persist Extracted Relationships into Database & Criminal Network Graph
    const createdRelationships = [];
    if (aiResult.relationships && Array.isArray(aiResult.relationships)) {
      for (const rel of aiResult.relationships) {
        let srcId = entityMap.get((rel.source_name || '').toLowerCase());
        let tgtId = entityMap.get((rel.target_name || '').toLowerCase());

        // If not directly found by name, pick from created or existing entities
        if (!srcId && createdEntities.length > 0) srcId = createdEntities[0].id;
        if (!tgtId && createdEntities.length > 1) tgtId = createdEntities[1].id;

        if (srcId && tgtId && srcId !== tgtId) {
          const savedRel = await db.createRelationship({
            case_id: caseId || "c1a22222-2222-4222-b222-222222222201",
            source_entity_id: srcId,
            target_entity_id: tgtId,
            relationship_type: rel.relationship_type || 'associates_with',
            source_text: rel.source_text || '',
            confidence: rel.confidence || 80,
            is_verified: false
          });
          createdRelationships.push(savedRel);
        }
      }
    }

    // 5. Save the Full AI Analysis Record
    const savedAnalysis = await db.saveAIAnalysis({
      case_id: caseId,
      document_name: originalName,
      document_url: `/storage/uploads/${path.basename(filePath)}`,
      extracted_text: extractionResult.text.substring(0, 10000), // First 10k chars
      summary: aiResult.summary,
      crime_category: aiResult.crime_category,
      key_observations: aiResult.key_observations,
      priority_score: aiResult.priority_score,
      priority_level: aiResult.priority_level,
      risk_factors: aiResult.risk_factors,
      score_explanation: aiResult.score_explanation,
      suggested_actions: aiResult.suggested_actions,
      recommendations: aiResult.recommendations,
      entities: aiResult.entities,
      relationships: aiResult.relationships
    });

    // 6. Record Audit Log
    await db.addAuditLog(
      req.user ? req.user.name : 'Investigating Officer',
      req.user ? req.user.officer_id : 'IND-POL-8842',
      'AI_ANALYSIS_EXECUTED',
      `Executed AI document extraction on '${originalName}'. Result: ${aiResult.priority_level} Priority (${aiResult.priority_score}/100), ${createdEntities.length} entities mapped.`
    );

    res.json({
      success: true,
      message: 'Document analyzed and criminal intelligence extracted successfully',
      data: {
        analysis_id: savedAnalysis.id,
        document_name: originalName,
        extraction_method: extractionResult.method,
        characters_extracted: extractionResult.characters,
        ai_engine: aiResult.engine_used,
        is_simulation: aiResult.is_simulation,
        summary: aiResult.summary,
        crime_category: aiResult.crime_category,
        key_observations: aiResult.key_observations,
        priority_score: aiResult.priority_score,
        priority_level: aiResult.priority_level,
        risk_factors: aiResult.risk_factors,
        score_explanation: aiResult.score_explanation,
        suggested_actions: aiResult.suggested_actions,
        recommendations: aiResult.recommendations,
        entities: aiResult.entities,
        relationships: aiResult.relationships,
        entities_created: createdEntities.length,
        relationships_created: createdRelationships.length
      }
    });

  } catch (error) {
    console.error('[ANALYSIS API] Analysis execution error:', error);
    res.status(500).json({
      success: false,
      message: `AI Analysis failed: ${error.message}`
    });
  }
});

// GET /api/analysis/:id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const analysis = await db.getAIAnalysisById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis record not found' });
    }
    res.json({ success: true, data: analysis });
  } catch (error) {
    console.error('[ANALYSIS API] Error getting analysis:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve analysis' });
  }
});

// POST /api/analysis/sample - Loads a pre-curated test document for 1-click SIH judge evaluation
router.post('/sample', requireAuth, async (req, res) => {
  try {
    const sampleType = req.body.sampleType || 'extortion';
    let sampleTitle = "FIR_2026_Extortion_Syndicate_NCR.txt";
    let sampleContent = "";

    if (sampleType === 'extortion') {
      sampleTitle = "FIR_2026_DEL_0412_ShadowX_Extortion.txt";
      sampleContent = `FIRST INFORMATION REPORT (Under Section 154 Cr.P.C.)
POLICE STATION: Special Cell, Lodhi Colony, New Delhi
FIR NUMBER: FIR-2026-DEL-0412 | DATE: 18-02-2026
COMPLAINANT: Dr. Vikram Sethi, Chairman, Apex Medical Foundation, South Extension Part II, New Delhi.
INVESTIGATING OFFICER: Inspector Rajesh Sharma (DL-CB-4019)

ACCUSED / SUSPECT DETAILS:
1. Sameer Sheikh alias 'Shadow-X', resident of overseas transit hub, primary syndicate controller.
2. Rohan Batra alias 'Tech-Batra', telecom operator, handling VoIP PBX equipment in Sector 18 Gurugram.
3. Farooq Choksi alias 'Bhai-jaan', managing hawala liquidity between Delhi and Dubai.

INCIDENT NARRATIVE:
On 16-02-2026, complainant received repeated encrypted VoIP threat calls demanding INR 2.5 Crores in cash and USDT. Call logs identify transmission originating from virtual UK relay trunk +44-7700-900821 configured by suspect Rohan Batra. Complainant was instructed to deliver initial tranche of INR 50 Lakhs to courier vehicle Black Scorpio N bearing registration DL-01-CZ-9901 spotted frequently idling near South Extension.

Technical surveillance placed suspect Rohan Batra at safehouse apartment located at Sector 18 Cyber Hub, Gurugram. Financial intelligence reports further establish that proceeds are laundered through offshore entity Western Pearl Shell Holding Ltd holding account HSBC-CY-4882019920. Physical surveillance photographed co-conspirator Vikramaditya Rathore alias Vicky providing armed escort in SUV PB-65-AK-9090.`;
    } else if (sampleType === 'hawala') {
      sampleTitle = "ED_Forensic_Interception_Hawala_TitanLogistics.txt";
      sampleContent = `FINANCIAL CRIMES ENFORCEMENT DOSSIER
CASE REFERENCE: ML-2026-BKC-094
SUBJECT ENTITY: Titan Logistics Pvt Ltd (CIN: U63090HR2023PTC099124)
TARGET SUSPECT: Nikhil Joshi (Mule Coordinator), Farooq Choksi (Hawala Conduit)

FINANCIAL INTELLIGENCE SUMMARY:
Between 20-02-2026 and 24-02-2026, automated monitoring detected 36 high-velocity fund transfers through HDFC Bank Account 009182390112 totaling INR 14.8 Crores. Accounts were opened using forged KYC credentials by operative Nikhil Joshi using mobile number +91-98201-44789.
CCTV footage from BKC Financial Enclave ATM captures suspect Nikhil Joshi withdrawing bulk tranches. Funds were layered into dummy account SBI-33049182001 and converted into USDT by crypto mixer operator Pooja Hegde alias Maya. Corporate entity Titan Logistics serves as commercial transport facade for cash distribution.`;
    } else {
      sampleTitle = "Narcotics_Seizure_Memo_Bengaluru_Indiranagar.txt";
      sampleContent = `SEIZURE AND ARREST MEMO - ANTI-NARCOTICS TASK FORCE
LOCATION: AeroExpress Cargo Dispatchers, Indiranagar Freight Depot, Bengaluru
OFFICER IN CHARGE: DSP Amit Deshmukh (KA-STF-3304)

RECOVERY PARTICULARS:
Intercepted 4.5 Kilograms of synthetic methamphetamine packaged inside high-voltage electrical relays. Consignments were dispatched using stolen transport vehicle KA-03-MN-7712 regularly driven by suspect Vikramaditya Rathore ('Vicky').
Suspect was observed coordinating with dead-drop couriers via encrypted Telegram handle. Cross-referencing vehicle registration and toll camera logs indicates movement between Indiranagar and Electronic City industrial perimeter.`;
    }

    const aiResult = await gemini.analyzeDocument(sampleContent, sampleTitle);

    // Persist entities
    const createdEntities = [];
    const entityMap = new Map();
    if (aiResult.entities && Array.isArray(aiResult.entities)) {
      for (const ent of aiResult.entities) {
        const savedEntity = await db.createEntity({
          case_id: "c1a22222-2222-4222-b222-222222222201",
          entity_type: ent.entity_type,
          entity_value: ent.entity_value,
          label: ent.label || ent.entity_value,
          confidence: ent.confidence || 90,
          is_verified: false,
          risk_level: ent.risk_level || 'medium',
          metadata: ent.metadata || {}
        });
        createdEntities.push(savedEntity);
        entityMap.set(ent.entity_value.toLowerCase(), savedEntity.id);
      }
    }

    // Persist relationships
    const createdRelationships = [];
    if (aiResult.relationships && Array.isArray(aiResult.relationships)) {
      for (const rel of aiResult.relationships) {
        let srcId = entityMap.get((rel.source_name || '').toLowerCase());
        let tgtId = entityMap.get((rel.target_name || '').toLowerCase());
        if (!srcId && createdEntities.length > 0) srcId = createdEntities[0].id;
        if (!tgtId && createdEntities.length > 1) tgtId = createdEntities[1].id;

        if (srcId && tgtId && srcId !== tgtId) {
          const savedRel = await db.createRelationship({
            case_id: "c1a22222-2222-4222-b222-222222222201",
            source_entity_id: srcId,
            target_entity_id: tgtId,
            relationship_type: rel.relationship_type,
            source_text: rel.source_text || '',
            confidence: rel.confidence || 85,
            is_verified: false
          });
          createdRelationships.push(savedRel);
        }
      }
    }

    // Save Analysis
    const savedAnalysis = await db.saveAIAnalysis({
      case_id: "c1a22222-2222-4222-b222-222222222201",
      document_name: sampleTitle,
      extracted_text: sampleContent,
      summary: aiResult.summary,
      crime_category: aiResult.crime_category,
      key_observations: aiResult.key_observations,
      priority_score: aiResult.priority_score,
      priority_level: aiResult.priority_level,
      risk_factors: aiResult.risk_factors,
      score_explanation: aiResult.score_explanation,
      suggested_actions: aiResult.suggested_actions,
      recommendations: aiResult.recommendations,
      entities: aiResult.entities,
      relationships: aiResult.relationships
    });

    res.json({
      success: true,
      message: 'Sample test document loaded and analyzed successfully',
      data: {
        analysis_id: savedAnalysis.id,
        document_name: sampleTitle,
        document_text: sampleContent,
        ai_engine: aiResult.engine_used,
        is_simulation: aiResult.is_simulation,
        summary: aiResult.summary,
        crime_category: aiResult.crime_category,
        key_observations: aiResult.key_observations,
        priority_score: aiResult.priority_score,
        priority_level: aiResult.priority_level,
        risk_factors: aiResult.risk_factors,
        score_explanation: aiResult.score_explanation,
        suggested_actions: aiResult.suggested_actions,
        recommendations: aiResult.recommendations,
        entities: aiResult.entities,
        relationships: aiResult.relationships,
        entities_created: createdEntities.length,
        relationships_created: createdRelationships.length
      }
    });

  } catch (error) {
    console.error('[ANALYSIS API] Sample analysis error:', error);
    res.status(500).json({ success: false, message: 'Failed to process sample document' });
  }
});

module.exports = router;
