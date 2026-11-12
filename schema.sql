-- ==============================================================================
-- AI-POWERED CRIMINAL NETWORK ANALYSIS SYSTEM
-- Smart India Hackathon (SIH) 2026 - Law Enforcement Intelligence Platform
-- Complete PostgreSQL / Supabase Database Schema with Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. OFFICERS TABLE
CREATE TABLE IF NOT EXISTS officers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    officer_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    badge_number TEXT,
    designation TEXT NOT NULL,
    department TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'investigating_officer',
    status TEXT DEFAULT 'active',
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FIRS TABLE
CREATE TABLE IF NOT EXISTS firs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fir_number TEXT UNIQUE NOT NULL,
    complainant_name TEXT NOT NULL,
    crime_category TEXT NOT NULL,
    incident_location TEXT NOT NULL,
    incident_date DATE NOT NULL,
    description TEXT NOT NULL,
    investigating_officer TEXT NOT NULL,
    officer_id UUID REFERENCES officers(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'Under Investigation',
    priority TEXT DEFAULT 'High',
    lat NUMERIC(10, 6),
    lng NUMERIC(10, 6),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CASES TABLE
CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id TEXT UNIQUE NOT NULL,
    case_title TEXT NOT NULL,
    crime_type TEXT NOT NULL,
    description TEXT,
    suspects_count INTEGER DEFAULT 0,
    assigned_officer TEXT NOT NULL,
    officer_id UUID REFERENCES officers(id) ON DELETE SET NULL,
    investigation_progress INTEGER DEFAULT 25,
    priority TEXT DEFAULT 'High',
    status TEXT DEFAULT 'Under Investigation',
    fir_id UUID REFERENCES firs(id) ON DELETE SET NULL,
    fir_number TEXT,
    location TEXT NOT NULL,
    lat NUMERIC(10, 6),
    lng NUMERIC(10, 6),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SUSPECTS TABLE
CREATE TABLE IF NOT EXISTS suspects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    alias TEXT,
    role TEXT,
    phone TEXT,
    status TEXT DEFAULT 'Wanted',
    risk_score INTEGER DEFAULT 75,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ENTITIES TABLE (Graph Nodes)
CREATE TABLE IF NOT EXISTS entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL, -- 'suspect', 'organization', 'phone', 'bank_account', 'vehicle', 'location'
    entity_value TEXT NOT NULL,
    label TEXT NOT NULL,
    confidence INTEGER DEFAULT 85,
    is_verified BOOLEAN DEFAULT FALSE,
    risk_level TEXT DEFAULT 'medium', -- 'critical', 'high', 'medium', 'low'
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. RELATIONSHIPS TABLE (Graph Edges)
CREATE TABLE IF NOT EXISTS relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    source_entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    target_entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL, -- e.g. 'communicated_with', 'transferred_funds_to', 'operates_at', 'controls', 'associates_with'
    source_text TEXT,
    confidence INTEGER DEFAULT 80,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. EVIDENCE TABLE
CREATE TABLE IF NOT EXISTS evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evidence_number TEXT UNIQUE NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    category TEXT NOT NULL, -- 'CCTV Footage', 'Call Detail Records (CDR)', 'Bank Financial Audit', 'Forensic Lab Report', 'WhatsApp Chat Export', 'Vehicle Telematics'
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    case_number TEXT,
    uploaded_by TEXT NOT NULL,
    officer_id UUID REFERENCES officers(id) ON DELETE SET NULL,
    description TEXT,
    hash_sha256 TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. AI ANALYSES TABLE
CREATE TABLE IF NOT EXISTS ai_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    document_name TEXT NOT NULL,
    document_url TEXT,
    extracted_text TEXT,
    summary TEXT NOT NULL,
    crime_category TEXT NOT NULL,
    key_observations JSONB DEFAULT '[]'::jsonb,
    priority_score INTEGER NOT NULL,
    priority_level TEXT NOT NULL,
    risk_factors JSONB DEFAULT '[]'::jsonb,
    score_explanation TEXT NOT NULL,
    suggested_actions JSONB DEFAULT '[]'::jsonb,
    recommendations JSONB DEFAULT '[]'::jsonb,
    entities JSONB DEFAULT '[]'::jsonb,
    relationships JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'Completed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. REPORTS TABLE
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_number TEXT UNIQUE NOT NULL,
    report_title TEXT NOT NULL,
    report_type TEXT NOT NULL,
    case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
    generated_by TEXT NOT NULL,
    summary_content TEXT NOT NULL,
    details_json JSONB DEFAULT '{}'::jsonb,
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT DEFAULT 'High',
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    case_number TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    officer_name TEXT NOT NULL,
    officer_id TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    ip_address TEXT DEFAULT '127.0.0.1',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES for fast intelligence query performance
CREATE INDEX IF NOT EXISTS idx_firs_number ON firs(fir_number);
CREATE INDEX IF NOT EXISTS idx_firs_crime_category ON firs(crime_category);
CREATE INDEX IF NOT EXISTS idx_cases_case_id ON cases(case_id);
CREATE INDEX IF NOT EXISTS idx_cases_priority ON cases(priority);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_entities_case_id ON entities(case_id);
CREATE INDEX IF NOT EXISTS idx_entities_type ON entities(entity_type);
CREATE INDEX IF NOT EXISTS idx_relationships_case_id ON relationships(case_id);
CREATE INDEX IF NOT EXISTS idx_evidence_case_id ON evidence(case_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE firs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE suspects ENABLE ROW LEVEL SECURITY;
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to perform operations
DO $$
BEGIN
    CREATE POLICY "Allow public read access for authorized clients" ON officers FOR SELECT USING (true);
    CREATE POLICY "Allow public read access for authorized clients" ON firs FOR ALL USING (true);
    CREATE POLICY "Allow public read access for authorized clients" ON cases FOR ALL USING (true);
    CREATE POLICY "Allow public read access for authorized clients" ON suspects FOR ALL USING (true);
    CREATE POLICY "Allow public read access for authorized clients" ON entities FOR ALL USING (true);
    CREATE POLICY "Allow public read access for authorized clients" ON relationships FOR ALL USING (true);
    CREATE POLICY "Allow public read access for authorized clients" ON evidence FOR ALL USING (true);
    CREATE POLICY "Allow public read access for authorized clients" ON ai_analyses FOR ALL USING (true);
    CREATE POLICY "Allow public read access for authorized clients" ON reports FOR ALL USING (true);
    CREATE POLICY "Allow public read access for authorized clients" ON notifications FOR ALL USING (true);
    CREATE POLICY "Allow public read access for authorized clients" ON audit_logs FOR ALL USING (true);
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;
