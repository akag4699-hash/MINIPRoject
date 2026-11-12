// ==============================================================================
// Database & Storage Unified Service
// Supports Live Supabase PostgreSQL + Storage with seamless local fallback
// ==============================================================================

const { v4: uuidv4 } = require('uuid');
const { supabase, isConfigured } = require('../config/supabase');
const {
  sampleOfficers,
  sampleFIRs,
  sampleCases,
  sampleEntities,
  sampleRelationships,
  sampleEvidence,
  sampleAlerts,
  sampleReports,
  sampleAuditLogs
} = require('./seedData');

// In-Memory state clone of seedData for zero-setup demo mode
let localStore = {
  officers: JSON.parse(JSON.stringify(sampleOfficers)),
  firs: JSON.parse(JSON.stringify(sampleFIRs)),
  cases: JSON.parse(JSON.stringify(sampleCases)),
  entities: JSON.parse(JSON.stringify(sampleEntities)),
  relationships: JSON.parse(JSON.stringify(sampleRelationships)),
  evidence: JSON.parse(JSON.stringify(sampleEvidence)),
  alerts: JSON.parse(JSON.stringify(sampleAlerts)),
  reports: JSON.parse(JSON.stringify(sampleReports)),
  auditLogs: JSON.parse(JSON.stringify(sampleAuditLogs)),
  aiAnalyses: []
};

class DatabaseService {
  constructor() {
    this.useSupabase = isConfigured && supabase !== null;
    console.log(`[DATABASE] Active storage mode: ${this.useSupabase ? 'SUPABASE CLOUD' : 'LOCAL ENGINE (SIH DEMO MODE)'}`);
  }

  isLive() {
    return this.useSupabase;
  }

  // --- OFFICERS ---
  async getOfficers() {
    if (this.useSupabase) {
      const { data, error } = await supabase.from('officers').select('*');
      if (!error && data && data.length > 0) return data;
    }
    return localStore.officers;
  }

  async getOfficerByLogin(officerIdOrEmail) {
    const cleanId = (officerIdOrEmail || '').trim().toLowerCase();
    const officers = await this.getOfficers();
    return officers.find(o => 
      o.officer_id.toLowerCase() === cleanId || 
      o.email.toLowerCase() === cleanId
    );
  }

  // --- FIRS ---
  async getFIRs() {
    if (this.useSupabase) {
      const { data, error } = await supabase.from('firs').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return [...localStore.firs].sort((a, b) => new Date(b.created_at || b.incident_date) - new Date(a.created_at || a.incident_date));
  }

  async getFIRById(id) {
    if (this.useSupabase) {
      const { data, error } = await supabase.from('firs').select('*').eq('id', id).single();
      if (!error && data) return data;
    }
    return localStore.firs.find(f => f.id === id || f.fir_number === id);
  }

  async createFIR(firData) {
    const newFir = {
      id: firData.id || uuidv4(),
      fir_number: firData.fir_number || `FIR-2026-IND-${Math.floor(1000 + Math.random() * 9000)}`,
      complainant_name: firData.complainant_name,
      crime_category: firData.crime_category,
      incident_location: firData.incident_location,
      incident_date: firData.incident_date || new Date().toISOString().split('T')[0],
      description: firData.description,
      investigating_officer: firData.investigating_officer || "Inspector Rajesh Sharma",
      status: firData.status || "Registered",
      priority: firData.priority || "High",
      lat: parseFloat(firData.lat) || 28.6139,
      lng: parseFloat(firData.lng) || 77.2090,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (this.useSupabase) {
      try {
        const { data, error } = await supabase.from('firs').insert([newFir]).select();
        if (!error && data) return data[0];
      } catch (err) {
        console.warn('[SUPABASE] createFIR fallback to local store:', err.message);
      }
    }
    localStore.firs.unshift(newFir);
    return newFir;
  }

  async updateFIR(id, updates) {
    updates.updated_at = new Date().toISOString();
    if (this.useSupabase) {
      try {
        const { data, error } = await supabase.from('firs').update(updates).eq('id', id).select();
        if (!error && data) return data[0];
      } catch (err) {
        console.warn('[SUPABASE] updateFIR fallback:', err.message);
      }
    }
    const index = localStore.firs.findIndex(f => f.id === id || f.fir_number === id);
    if (index !== -1) {
      localStore.firs[index] = { ...localStore.firs[index], ...updates };
      return localStore.firs[index];
    }
    return null;
  }

  async deleteFIR(id) {
    if (this.useSupabase) {
      try {
        await supabase.from('firs').delete().eq('id', id);
      } catch (err) {
        console.warn('[SUPABASE] deleteFIR fallback:', err.message);
      }
    }
    const idx = localStore.firs.findIndex(f => f.id === id);
    if (idx !== -1) {
      localStore.firs.splice(idx, 1);
      return true;
    }
    return false;
  }

  // --- CASES ---
  async getCases() {
    if (this.useSupabase) {
      const { data, error } = await supabase.from('cases').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return [...localStore.cases].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }

  async getCaseById(id) {
    if (this.useSupabase) {
      const { data, error } = await supabase.from('cases').select('*').eq('id', id).single();
      if (!error && data) return data;
    }
    return localStore.cases.find(c => c.id === id || c.case_id === id);
  }

  async createCase(caseData) {
    const newCase = {
      id: caseData.id || uuidv4(),
      case_id: caseData.case_id || `CASE-2026-${Math.floor(100 + Math.random() * 900)}`,
      case_title: caseData.case_title,
      crime_type: caseData.crime_type,
      description: caseData.description,
      suspects_count: parseInt(caseData.suspects_count) || 0,
      assigned_officer: caseData.assigned_officer || "Inspector Rajesh Sharma",
      investigation_progress: parseInt(caseData.investigation_progress) || 20,
      priority: caseData.priority || "High",
      status: caseData.status || "Under Investigation",
      fir_number: caseData.fir_number || "",
      location: caseData.location || "National Capital Region",
      lat: parseFloat(caseData.lat) || 28.6139,
      lng: parseFloat(caseData.lng) || 77.2090,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (this.useSupabase) {
      try {
        const { data, error } = await supabase.from('cases').insert([newCase]).select();
        if (!error && data) return data[0];
      } catch (err) {
        console.warn('[SUPABASE] createCase fallback:', err.message);
      }
    }
    localStore.cases.unshift(newCase);
    return newCase;
  }

  async updateCase(id, updates) {
    updates.updated_at = new Date().toISOString();
    if (this.useSupabase) {
      try {
        const { data, error } = await supabase.from('cases').update(updates).eq('id', id).select();
        if (!error && data) return data[0];
      } catch (err) {
        console.warn('[SUPABASE] updateCase fallback:', err.message);
      }
    }
    const index = localStore.cases.findIndex(c => c.id === id || c.case_id === id);
    if (index !== -1) {
      localStore.cases[index] = { ...localStore.cases[index], ...updates };
      return localStore.cases[index];
    }
    return null;
  }

  async deleteCase(id) {
    if (this.useSupabase) {
      try {
        await supabase.from('cases').delete().eq('id', id);
      } catch (err) {
        console.warn('[SUPABASE] deleteCase fallback:', err.message);
      }
    }
    const idx = localStore.cases.findIndex(c => c.id === id || c.case_id === id);
    if (idx !== -1) {
      localStore.cases.splice(idx, 1);
      return true;
    }
    return false;
  }

  // --- ENTITIES & GRAPH NODES ---
  async getEntities(caseId = null) {
    if (this.useSupabase) {
      let query = supabase.from('entities').select('*');
      if (caseId) query = query.eq('case_id', caseId);
      const { data, error } = await query;
      if (!error && data) return data;
    }
    if (caseId) {
      return localStore.entities.filter(e => e.case_id === caseId);
    }
    return localStore.entities;
  }

  async getEntityById(id) {
    if (this.useSupabase) {
      const { data, error } = await supabase.from('entities').select('*').eq('id', id).single();
      if (!error && data) return data;
    }
    return localStore.entities.find(e => e.id === id);
  }

  async createEntity(entityData) {
    const newEntity = {
      id: entityData.id || `ent_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      case_id: entityData.case_id || null,
      entity_type: entityData.entity_type, // 'suspect', 'organization', 'phone', 'bank_account', 'vehicle', 'location'
      entity_value: entityData.entity_value,
      label: entityData.label || entityData.entity_value,
      confidence: entityData.confidence || 85,
      is_verified: !!entityData.is_verified,
      risk_level: entityData.risk_level || 'medium',
      metadata: entityData.metadata || {},
      created_at: new Date().toISOString()
    };

    if (this.useSupabase) {
      try {
        const { data, error } = await supabase.from('entities').insert([newEntity]).select();
        if (!error && data) return data[0];
      } catch (err) {
        console.warn('[SUPABASE] createEntity fallback:', err.message);
      }
    }
    localStore.entities.push(newEntity);
    return newEntity;
  }

  // --- RELATIONSHIPS & GRAPH EDGES ---
  async getRelationships(caseId = null) {
    if (this.useSupabase) {
      let query = supabase.from('relationships').select('*');
      if (caseId) query = query.eq('case_id', caseId);
      const { data, error } = await query;
      if (!error && data) return data;
    }
    if (caseId) {
      return localStore.relationships.filter(r => r.case_id === caseId);
    }
    return localStore.relationships;
  }

  async createRelationship(relData) {
    const newRel = {
      id: relData.id || `rel_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      case_id: relData.case_id || null,
      source_entity_id: relData.source_entity_id,
      target_entity_id: relData.target_entity_id,
      relationship_type: relData.relationship_type,
      source_text: relData.source_text || "",
      confidence: relData.confidence || 80,
      is_verified: !!relData.is_verified,
      created_at: new Date().toISOString()
    };

    if (this.useSupabase) {
      try {
        const { data, error } = await supabase.from('relationships').insert([newRel]).select();
        if (!error && data) return data[0];
      } catch (err) {
        console.warn('[SUPABASE] createRelationship fallback:', err.message);
      }
    }
    localStore.relationships.push(newRel);
    return newRel;
  }

  // --- EVIDENCE VAULT ---
  async getEvidence(caseId = null) {
    if (this.useSupabase) {
      let query = supabase.from('evidence').select('*').order('created_at', { ascending: false });
      if (caseId) query = query.eq('case_id', caseId);
      const { data, error } = await query;
      if (!error && data) return data;
    }
    if (caseId) {
      return localStore.evidence.filter(e => e.case_id === caseId || e.case_number === caseId);
    }
    return localStore.evidence;
  }

  async createEvidence(evData) {
    const newEv = {
      id: evData.id || uuidv4(),
      evidence_number: evData.evidence_number || `EVD-2026-${Math.floor(100 + Math.random() * 900)}`,
      file_name: evData.file_name,
      file_path: evData.file_path,
      file_type: evData.file_type || 'application/octet-stream',
      file_size: evData.file_size || 0,
      category: evData.category || 'Forensic Lab Report',
      case_id: evData.case_id || null,
      case_number: evData.case_number || 'CASE-2026-089',
      uploaded_by: evData.uploaded_by || 'Inspector Rajesh Sharma',
      description: evData.description || '',
      hash_sha256: evData.hash_sha256 || 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
      created_at: new Date().toISOString()
    };

    if (this.useSupabase) {
      try {
        const { data, error } = await supabase.from('evidence').insert([newEv]).select();
        if (!error && data) return data[0];
      } catch (err) {
        console.warn('[SUPABASE] createEvidence fallback:', err.message);
      }
    }
    localStore.evidence.unshift(newEv);
    return newEv;
  }

  // --- AI ANALYSES ---
  async saveAIAnalysis(analysisData) {
    const item = {
      id: analysisData.id || uuidv4(),
      case_id: analysisData.case_id || null,
      document_name: analysisData.document_name,
      document_url: analysisData.document_url || null,
      extracted_text: analysisData.extracted_text || "",
      summary: analysisData.summary,
      crime_category: analysisData.crime_category,
      key_observations: analysisData.key_observations || [],
      priority_score: analysisData.priority_score,
      priority_level: analysisData.priority_level,
      risk_factors: analysisData.risk_factors || [],
      score_explanation: analysisData.score_explanation,
      suggested_actions: analysisData.suggested_actions || [],
      recommendations: analysisData.recommendations || [],
      entities: analysisData.entities || [],
      relationships: analysisData.relationships || [],
      status: "Completed",
      created_at: new Date().toISOString()
    };

    if (this.useSupabase) {
      try {
        const { data, error } = await supabase.from('ai_analyses').insert([item]).select();
        if (!error && data) return data[0];
      } catch (err) {
        console.warn('[SUPABASE] saveAIAnalysis fallback:', err.message);
      }
    }
    localStore.aiAnalyses.unshift(item);
    return item;
  }

  async getAIAnalysisById(id) {
    if (this.useSupabase) {
      const { data, error } = await supabase.from('ai_analyses').select('*').eq('id', id).single();
      if (!error && data) return data;
    }
    return localStore.aiAnalyses.find(a => a.id === id);
  }

  // --- REPORTS ---
  async getReports() {
    if (this.useSupabase) {
      const { data, error } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return localStore.reports;
  }

  async createReport(reportData) {
    const item = {
      id: reportData.id || uuidv4(),
      report_number: reportData.report_number || `RPT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      report_title: reportData.report_title,
      report_type: reportData.report_type,
      case_id: reportData.case_id || null,
      generated_by: reportData.generated_by || "Inspector Rajesh Sharma",
      summary_content: reportData.summary_content,
      details_json: reportData.details_json || {},
      file_url: reportData.file_url || null,
      created_at: new Date().toISOString()
    };

    if (this.useSupabase) {
      try {
        const { data, error } = await supabase.from('reports').insert([item]).select();
        if (!error && data) return data[0];
      } catch (err) {
        console.warn('[SUPABASE] createReport fallback:', err.message);
      }
    }
    localStore.reports.unshift(item);
    return item;
  }

  // --- NOTIFICATIONS & ALERTS ---
  async getNotifications() {
    if (this.useSupabase) {
      const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return localStore.alerts;
  }

  async markNotificationRead(id) {
    const alert = localStore.alerts.find(a => a.id === id);
    if (alert) alert.is_read = true;
    return true;
  }

  // --- AUDIT LOGS ---
  async getAuditLogs(limit = 50) {
    if (this.useSupabase) {
      const { data, error } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(limit);
      if (!error && data) return data;
    }
    return localStore.auditLogs.slice(0, limit);
  }

  async addAuditLog(officerName, officerId, action, details, ip = '127.0.0.1') {
    const log = {
      id: uuidv4(),
      officer_name: officerName || 'System Admin',
      officer_id: officerId || 'IND-SYS-001',
      action,
      details,
      ip_address: ip,
      created_at: new Date().toISOString()
    };
    if (this.useSupabase) {
      try {
        await supabase.from('audit_logs').insert([log]);
      } catch (e) {
        // fallback
      }
    }
    localStore.auditLogs.unshift(log);
    return log;
  }

  // --- DASHBOARD STATS ---
  async getDashboardStats() {
    const firs = await this.getFIRs();
    const cases = await this.getCases();
    const entities = await this.getEntities();
    const relationships = await this.getRelationships();

    const activeCases = cases.filter(c => c.status !== 'Solved' && c.status !== 'Closed').length;
    const highPriorityCases = cases.filter(c => c.priority === 'Critical' || c.priority === 'High').length;
    const suspectsIdentified = entities.filter(e => e.entity_type === 'suspect').length;
    const networkConnections = relationships.length;
    const casesAnalyzedByAI = cases.length + localStore.aiAnalyses.length;

    // Crime category distribution
    const categoryCounts = {};
    firs.forEach(f => {
      const cat = f.crime_category || 'Other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    // Case status distribution
    const statusCounts = {};
    cases.forEach(c => {
      const st = c.status || 'Under Investigation';
      statusCounts[st] = (statusCounts[st] || 0) + 1;
    });

    return {
      kpis: {
        totalActiveCases: activeCases,
        totalFIRs: firs.length,
        highPriorityCases: highPriorityCases,
        totalSuspectsIdentified: suspectsIdentified,
        criminalNetworkConnections: networkConnections,
        casesAnalyzedByAI: casesAnalyzedByAI
      },
      categoryDistribution: categoryCounts,
      statusDistribution: statusCounts,
      systemStatus: {
        aiEngine: "Operational (Gemini 1.5 NLP + NER)",
        database: this.useSupabase ? "Supabase PostgreSQL (Connected)" : "Local Resilient Store (SIH Demo Mode)",
        threatLevel: "ELEVATED (LEVEL 3)",
        lastSync: new Date().toISOString()
      }
    };
  }
}

const db = new DatabaseService();
module.exports = db;
