// ==============================================================================
// AI-POWERED CRIMINAL NETWORK ANALYSIS SYSTEM - SIH 2026
// Realistic Synthetic Demonstration Data for Indian Law Enforcement Context
// ==============================================================================

const sampleOfficers = [
  {
    id: "d83a1b02-1234-4b56-8a78-901234567801",
    officer_id: "IND-POL-8842",
    name: "Inspector Rajesh Sharma",
    badge_number: "DL-CB-4019",
    designation: "Lead Investigating Officer",
    department: "Special Crime Investigation Branch",
    email: "rajesh.sharma@police.gov.in",
    password_hash: "$2a$10$wO3iXjY5hF6KqY7u7m3w4OqvJ9N9U0V1Z1Y2X3W4V5U6T7S8R9Q0P", // Officer@2026
    role: "lead_investigator",
    status: "active",
    phone: "+91 98110 54321",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "d83a1b02-1234-4b56-8a78-901234567802",
    officer_id: "IND-POL-5521",
    name: "ACP Sunita Verma",
    badge_number: "MH-CID-1082",
    designation: "Assistant Commissioner of Police",
    department: "Cyber Forensics & Financial Intelligence",
    email: "sunita.verma@police.gov.in",
    password_hash: "$2a$10$wO3iXjY5hF6KqY7u7m3w4OqvJ9N9U0V1Z1Y2X3W4V5U6T7S8R9Q0P", // Officer@2026
    role: "acp_supervisor",
    status: "active",
    phone: "+91 98200 98765",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "d83a1b02-1234-4b56-8a78-901234567803",
    officer_id: "IND-POL-9914",
    name: "DSP Amit Deshmukh",
    badge_number: "KA-STF-3304",
    designation: "Deputy Superintendent of Police",
    department: "Anti-Narcotics & Organized Crime Task Force",
    email: "amit.deshmukh@police.gov.in",
    password_hash: "$2a$10$wO3iXjY5hF6KqY7u7m3w4OqvJ9N9U0V1Z1Y2X3W4V5U6T7S8R9Q0P", // Officer@2026
    role: "task_force_lead",
    status: "active",
    phone: "+91 98450 11223",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  }
];

const sampleFIRs = [
  {
    id: "f1a11111-1111-4111-a111-111111111101",
    fir_number: "FIR-2026-DEL-0412",
    complainant_name: "Dr. Vikram Sethi (Apex Medical Foundation)",
    crime_category: "Extortion & Threats",
    incident_location: "South Extension Part II, New Delhi",
    incident_date: "2026-02-18",
    description: "Complainant received encrypted VoIP extortion demands of INR 2.5 Crores signed by alias 'Shadow-X'. Demands routed through overseas virtual number +44-7700-900821 linking to Hawala account at Western Pearl Shell Entity.",
    investigating_officer: "Inspector Rajesh Sharma",
    status: "Under Investigation",
    priority: "Critical",
    lat: 28.5684,
    lng: 77.2215
  },
  {
    id: "f1a11111-1111-4111-a111-111111111102",
    fir_number: "FIR-2026-MUM-0189",
    complainant_name: "State Bank of India (Bandra Kurla Complex)",
    crime_category: "Cyber Financial Fraud",
    incident_location: "BKC Commercial Hub, Mumbai",
    incident_date: "2026-02-24",
    description: "Large unauthorized multi-node fund siphoning totaling INR 14.8 Crores across 36 dummy mule accounts in 4 hours. Automated botnet IP trace points to hosting server leased by 'Titan Logistics Pvt Ltd'.",
    investigating_officer: "ACP Sunita Verma",
    status: "Under Investigation",
    priority: "Critical",
    lat: 19.0657,
    lng: 72.8687
  },
  {
    id: "f1a11111-1111-4111-a111-111111111103",
    fir_number: "FIR-2026-BLR-0731",
    complainant_name: "Cyber Crime Cell Alert (Automated Monitoring)",
    crime_category: "Darknet Narcotics Distribution",
    incident_location: "Indiranagar 100ft Road, Bengaluru",
    incident_date: "2026-03-01",
    description: "Interception of synthetic drug consignments disguised as electronic micro-relays shipped from courier depot. Drop-box courier handled by individual using vehicle KA-03-MN-7712.",
    investigating_officer: "DSP Amit Deshmukh",
    status: "Under Investigation",
    priority: "High",
    lat: 12.9784,
    lng: 77.6408
  },
  {
    id: "f1a11111-1111-4111-a111-111111111104",
    fir_number: "FIR-2026-GGN-0205",
    complainant_name: "Anand Rathi & Associates",
    crime_category: "Corporate Espionage & Ransomware",
    incident_location: "Cyber City Phase 3, Gurugram",
    incident_date: "2026-03-04",
    description: "Ransomware deployment on proprietary accounting network demanding 45 BTC. Threat actor identified as 'BlackSpur Cell' with communication server linked to virtual number +91-98991-88421.",
    investigating_officer: "ACP Sunita Verma",
    status: "Under Investigation",
    priority: "High",
    lat: 28.4949,
    lng: 77.0895
  },
  {
    id: "f1a11111-1111-4111-a111-111111111105",
    fir_number: "FIR-2026-HYD-0552",
    complainant_name: "GMR Customs & Border Intelligence",
    crime_category: "Gold Smuggling & Hawala",
    incident_location: "Shamshabad Airport Zone, Hyderabad",
    incident_date: "2026-03-08",
    description: "Seizure of 4.2 kg gold paste in cargo transit. Interrogation revealed connection with Dubai-based jeweler operative 'Faheem Merchant' using shell export firm 'Global Horizon Exim'.",
    investigating_officer: "Inspector Rajesh Sharma",
    status: "Registered",
    priority: "High",
    lat: 17.2403,
    lng: 78.4294
  },
  {
    id: "f1a11111-1111-4111-a111-111111111106",
    fir_number: "FIR-2026-KOL-0314",
    complainant_name: "Kolkata Port Trust Security",
    crime_category: "Illegal Arms Trafficking",
    incident_location: "Kidderpore Docks, Kolkata",
    incident_date: "2026-03-11",
    description: "Unclaimed shipment container concealed 12 non-standard automatic handguns and tactical transceivers. Consignee listed as fake entity 'Bengal Marine Services' registered to proxy address in Howrah.",
    investigating_officer: "DSP Amit Deshmukh",
    status: "Under Investigation",
    priority: "Critical",
    lat: 22.5356,
    lng: 88.3228
  },
  {
    id: "f1a11111-1111-4111-a111-111111111107",
    fir_number: "FIR-2026-AMD-0094",
    complainant_name: "Navrangpura Commercial Traders Association",
    crime_category: "Fake Currency & Cheating",
    incident_location: "Ashram Road, Ahmedabad",
    incident_date: "2026-03-14",
    description: "Circulation of high-grade counterfeit INR 500 currency notes across 14 wholesale textile markets. Money trail traced to courier drop operated by suspect 'Tahir Qureshi'.",
    investigating_officer: "Inspector Rajesh Sharma",
    status: "Chargesheet Filed",
    priority: "Medium",
    lat: 23.0338,
    lng: 72.5850
  },
  {
    id: "f1a11111-1111-4111-a111-111111111108",
    fir_number: "FIR-2026-CHD-0441",
    complainant_name: "Gurpreet Singh (Sarabha Nagar)",
    crime_category: "Armed Robbery & Gang Activity",
    incident_location: "Sector 17 Plaza, Chandigarh",
    incident_date: "2026-03-19",
    description: "Armed raid on jewelry vault using modified getaway SUV vehicle PB-65-AK-9090. Ballistics confirm involvement of interstate 'Malwa Striker gang'.",
    investigating_officer: "DSP Amit Deshmukh",
    status: "Under Investigation",
    priority: "High",
    lat: 30.7398,
    lng: 76.7827
  },
  {
    id: "f1a11111-1111-4111-a111-111111111109",
    fir_number: "FIR-2026-PUN-0162",
    complainant_name: "Tech Mahindra IT Park Security",
    crime_category: "Cyber Financial Fraud",
    incident_location: "Hinjawadi Phase 2, Pune",
    incident_date: "2026-03-22",
    description: "Sim-swap fraud syndicate extracting OTPs for HNI bank transfers totaling INR 3.2 Crores. Telecommunications tower logs link to repeater station near Wakad bypass.",
    investigating_officer: "ACP Sunita Verma",
    status: "Registered",
    priority: "Medium",
    lat: 18.5913,
    lng: 73.7389
  },
  {
    id: "f1a11111-1111-4111-a111-111111111110",
    fir_number: "FIR-2026-JPR-0083",
    complainant_name: "Heritage Hotels Federation",
    crime_category: "Extortion & Threats",
    incident_location: "MI Road, Jaipur",
    incident_date: "2026-03-26",
    description: "Threatening audio messages sent via encrypted Telegram channel requesting protection tax from five heritage hotel chains. Suspect voice match identified as 'Vikramaditya Rathore alias Vicky'.",
    investigating_officer: "Inspector Rajesh Sharma",
    status: "Under Investigation",
    priority: "High",
    lat: 26.9124,
    lng: 75.7873
  }
];

const sampleCases = [
  {
    id: "c1a22222-2222-4222-b222-222222222201",
    case_id: "CASE-2026-089",
    case_title: "Operation Shadow Web: Multi-State Cyber Extortion Syndicate",
    crime_type: "Extortion & Cyber Syndicate",
    description: "Inter-state coordinated syndicate operating virtual PBX servers, darknet cryptocurrency laundering, and targeted extortion of medical and financial executives across Delhi-NCR and Mumbai.",
    suspects_count: 5,
    assigned_officer: "Inspector Rajesh Sharma",
    investigation_progress: 78,
    priority: "Critical",
    status: "Under Investigation",
    fir_number: "FIR-2026-DEL-0412",
    location: "New Delhi & Gurugram NCR",
    lat: 28.5684,
    lng: 77.2215
  },
  {
    id: "c1a22222-2222-4222-b222-222222222202",
    case_id: "CASE-2026-094",
    case_title: "Operation Titan Mule: High-Frequency Banking Fraud",
    crime_type: "Cyber Financial Fraud",
    description: "Organized financial racket using API session hijacking and 36 coordinated bank mule accounts to funnel illicit funds into offshore shell entities.",
    suspects_count: 6,
    assigned_officer: "ACP Sunita Verma",
    investigation_progress: 85,
    priority: "Critical",
    status: "Active",
    fir_number: "FIR-2026-MUM-0189",
    location: "Bandra Kurla Complex, Mumbai",
    lat: 19.0657,
    lng: 72.8687
  },
  {
    id: "c1a22222-2222-4222-b222-222222222203",
    case_id: "CASE-2026-102",
    case_title: "Operation Dark Route: Synthetic Narcotics Corridor",
    crime_type: "Narcotics Trafficking",
    description: "Trafficking of synthetic stimulants and ketamine derivatives dispatched through stealth electronic packages and distributed via dead-drop geo-coordinates in Bengaluru.",
    suspects_count: 4,
    assigned_officer: "DSP Amit Deshmukh",
    investigation_progress: 62,
    priority: "High",
    status: "Under Investigation",
    fir_number: "FIR-2026-BLR-0731",
    location: "Indiranagar & Electronic City, Bengaluru",
    lat: 12.9784,
    lng: 77.6408
  },
  {
    id: "c1a22222-2222-4222-b222-222222222204",
    case_id: "CASE-2026-115",
    case_title: "Operation Golden Gate: Transnational Hawala Network",
    crime_type: "Gold Smuggling & Hawala",
    description: "Unraveling a complex multi-city currency exchange pipeline converting undeclared bullion profits into non-fungible real estate assets in Hyderabad and Dubai.",
    suspects_count: 7,
    assigned_officer: "Inspector Rajesh Sharma",
    investigation_progress: 45,
    priority: "High",
    status: "Under Investigation",
    fir_number: "FIR-2026-HYD-0552",
    location: "Shamshabad & Banjara Hills, Hyderabad",
    lat: 17.2403,
    lng: 78.4294
  },
  {
    id: "c1a22222-2222-4222-b222-222222222205",
    case_id: "CASE-2026-121",
    case_title: "Operation Iron Clad: Port Maritime Arms Interception",
    crime_type: "Illegal Arms Trafficking",
    description: "Interdiction of containerized tactical firearm shipments routed through coastal smuggling networks into eastern industrial corridors.",
    suspects_count: 3,
    assigned_officer: "DSP Amit Deshmukh",
    investigation_progress: 90,
    priority: "Critical",
    status: "Court Hearing",
    fir_number: "FIR-2026-KOL-0314",
    location: "Kidderpore Docks, Kolkata",
    lat: 22.5356,
    lng: 88.3228
  },
  {
    id: "c1a22222-2222-4222-b222-222222222206",
    case_id: "CASE-2026-133",
    case_title: "Operation Silver Note: FICN Printing & Distribution Ring",
    crime_type: "Fake Currency & Counterfeit",
    description: "Printing and distribution nexus counterfeiting security threads and magnetic ink notes across western state supply lines.",
    suspects_count: 5,
    assigned_officer: "Inspector Rajesh Sharma",
    investigation_progress: 100,
    priority: "Medium",
    status: "Solved",
    fir_number: "FIR-2026-AMD-0094",
    location: "Ashram Road, Ahmedabad",
    lat: 23.0338,
    lng: 72.5850
  },
  {
    id: "c1a22222-2222-4222-b222-222222222207",
    case_id: "CASE-2026-147",
    case_title: "Operation Highway Eagle: Interstate Robbery Gang",
    crime_type: "Armed Robbery & Gang Activity",
    description: "Heavily armed syndicate staging high-speed highway vault robberies using cloned law enforcement license plates.",
    suspects_count: 4,
    assigned_officer: "DSP Amit Deshmukh",
    investigation_progress: 55,
    priority: "High",
    status: "Under Investigation",
    fir_number: "FIR-2026-CHD-0441",
    location: "Sector 17, Chandigarh",
    lat: 30.7398,
    lng: 76.7827
  },
  {
    id: "c1a22222-2222-4222-b222-222222222208",
    case_id: "CASE-2026-159",
    case_title: "Operation Fortress: Ransomware Intrusions on Critical Systems",
    crime_type: "Corporate Espionage & Ransomware",
    description: "Exploiting zero-day remote desktop gateway vulnerabilities to lock down critical IT infrastructure of private infrastructure vendors.",
    suspects_count: 3,
    assigned_officer: "ACP Sunita Verma",
    investigation_progress: 40,
    priority: "High",
    status: "Under Investigation",
    fir_number: "FIR-2026-GGN-0205",
    location: "Cyber City, Gurugram",
    lat: 28.4949,
    lng: 77.0895
  }
];

// Entities for Criminal Network Graph (Nodes)
const sampleEntities = [
  // Suspects
  {
    id: "e101",
    case_id: "c1a22222-2222-4222-b222-222222222201",
    entity_type: "suspect",
    entity_value: "Sameer Sheikh",
    label: "Sameer Sheikh alias 'Shadow-X'",
    confidence: 96,
    is_verified: true,
    risk_level: "critical",
    metadata: { alias: "Shadow-X", role: "Syndicate Kingpin", status: "Wanted / Red Notice Pending" }
  },
  {
    id: "e102",
    case_id: "c1a22222-2222-4222-b222-222222222201",
    entity_type: "suspect",
    entity_value: "Rohan Batra",
    label: "Rohan Batra (Telecom/SIM Specialist)",
    confidence: 91,
    is_verified: true,
    risk_level: "high",
    metadata: { alias: "Tech-Batra", role: "VoIP Gateway Operator", status: "Detained" }
  },
  {
    id: "e103",
    case_id: "c1a22222-2222-4222-b222-222222222201",
    entity_type: "suspect",
    entity_value: "Farooq 'Hawala' Choksi",
    label: "Farooq Choksi (Hawala Operator)",
    confidence: 89,
    is_verified: true,
    risk_level: "critical",
    metadata: { alias: "Bhai-jaan", role: "Financial Laundering Conduit", status: "Under Surveillance" }
  },
  {
    id: "e104",
    case_id: "c1a22222-2222-4222-b222-222222222202",
    entity_type: "suspect",
    entity_value: "Nikhil Joshi",
    label: "Nikhil Joshi (Mule Coordinator)",
    confidence: 87,
    is_verified: true,
    risk_level: "high",
    metadata: { alias: "Nick", role: "Bank Account Recruiter", status: "Arrested" }
  },
  {
    id: "e105",
    case_id: "c1a22222-2222-4222-b222-222222222203",
    entity_type: "suspect",
    entity_value: "Vikramaditya Rathore",
    label: "Vikramaditya Rathore alias 'Vicky'",
    confidence: 93,
    is_verified: true,
    risk_level: "critical",
    metadata: { alias: "Vicky Malwa", role: "Armed Logistics & Enforcer", status: "Wanted" }
  },
  {
    id: "e106",
    case_id: "c1a22222-2222-4222-b222-222222222202",
    entity_type: "suspect",
    entity_value: "Pooja Hegde alias Maya",
    label: "Maya (Crypto Mixer Specialist)",
    confidence: 84,
    is_verified: false,
    risk_level: "high",
    metadata: { alias: "Maya-Crypt", role: "Decentralized Mixer Handler", status: "Absconding" }
  },
  // Organizations
  {
    id: "e201",
    case_id: "c1a22222-2222-4222-b222-222222222201",
    entity_type: "organization",
    entity_value: "Western Pearl Shell Holding Ltd",
    label: "Western Pearl Shell Holding (Dubai/CY)",
    confidence: 95,
    is_verified: true,
    risk_level: "critical",
    metadata: { registration: "AE-DXB-99410", nature: "Offshore Shell Conduit" }
  },
  {
    id: "e202",
    case_id: "c1a22222-2222-4222-b222-222222222202",
    entity_type: "organization",
    entity_value: "Titan Logistics Pvt Ltd",
    label: "Titan Logistics Pvt Ltd (Gurugram)",
    confidence: 92,
    is_verified: true,
    risk_level: "high",
    metadata: { cin: "U63090HR2023PTC099124", nature: "Front Transportation & IT Proxy" }
  },
  {
    id: "e203",
    case_id: "c1a22222-2222-4222-b222-222222222203",
    entity_type: "organization",
    entity_value: "AeroExpress Cargo Dispatchers",
    label: "AeroExpress Cargo Dispatchers",
    confidence: 86,
    is_verified: false,
    risk_level: "medium",
    metadata: { hub: "Kempegowda Int'l Freight Hub", nature: "Courier Drop Conduit" }
  },
  // Phone numbers
  {
    id: "e301",
    case_id: "c1a22222-2222-4222-b222-222222222201",
    entity_type: "phone",
    entity_value: "+44-7700-900821",
    label: "+44 7700 900821 (VoIP Extortion Trunk)",
    confidence: 98,
    is_verified: true,
    risk_level: "critical",
    metadata: { provider: "SkyLine VoIP UK", callsLogged: 48, linkedCases: 2 }
  },
  {
    id: "e302",
    case_id: "c1a22222-2222-4222-b222-222222222201",
    entity_type: "phone",
    entity_value: "+91-98991-88421",
    label: "+91 98991 88421 (Delhi SIM Cloned)",
    confidence: 94,
    is_verified: true,
    risk_level: "high",
    metadata: { tower: "Nehru Place Hub Delhi", imei: "867340049921004" }
  },
  {
    id: "e303",
    case_id: "c1a22222-2222-4222-b222-222222222202",
    entity_type: "phone",
    entity_value: "+91-98201-44789",
    label: "+91 98201 44789 (Mule Coordination)",
    confidence: 90,
    is_verified: true,
    risk_level: "high",
    metadata: { tower: "Kurla West Mumbai", imei: "359128082991044" }
  },
  // Bank accounts
  {
    id: "e401",
    case_id: "c1a22222-2222-4222-b222-222222222202",
    entity_type: "bank_account",
    entity_value: "HDFC-009182390112",
    label: "HDFC A/C: 009182390112 (Primary Inflow)",
    confidence: 99,
    is_verified: true,
    risk_level: "critical",
    metadata: { branch: "BKC Mumbai", credits: "INR 14.8 Crores", accountStatus: "Frozen" }
  },
  {
    id: "e402",
    case_id: "c1a22222-2222-4222-b222-222222222201",
    entity_type: "bank_account",
    entity_value: "HSBC-CY-4882019920",
    label: "HSBC Offshore A/C: 4882019920",
    confidence: 92,
    is_verified: true,
    risk_level: "critical",
    metadata: { jurisdiction: "Nicosia Cyprus", benficiary: "Western Pearl Shell" }
  },
  {
    id: "e403",
    case_id: "c1a22222-2222-4222-b222-222222222202",
    entity_type: "bank_account",
    entity_value: "SBI-33049182001",
    label: "SBI Dummy Mule A/C: 33049182001",
    confidence: 88,
    is_verified: true,
    risk_level: "high",
    metadata: { holder: "Manoj Kumar (Proxy)", credits: "INR 45 Lakhs" }
  },
  // Vehicles
  {
    id: "e501",
    case_id: "c1a22222-2222-4222-b222-222222222203",
    entity_type: "vehicle",
    entity_value: "KA-03-MN-7712",
    label: "White Toyota Fortuner (KA-03-MN-7712)",
    confidence: 95,
    is_verified: true,
    risk_level: "high",
    metadata: { fastagScans: 14, owner: "Fake Identity - Ramu S." }
  },
  {
    id: "e502",
    case_id: "c1a22222-2222-4222-b222-222222222201",
    entity_type: "vehicle",
    entity_value: "DL-01-CZ-9901",
    label: "Black Scorpio N (DL-01-CZ-9901)",
    confidence: 88,
    is_verified: true,
    risk_level: "high",
    metadata: { tintStatus: "Illegal 100% Dark Tint", cctvMatches: 8 }
  },
  {
    id: "e503",
    case_id: "c1a22222-2222-4222-b222-222222222201",
    entity_type: "vehicle",
    entity_value: "PB-65-AK-9090",
    label: "Modified Getaway SUV (PB-65-AK-9090)",
    confidence: 93,
    is_verified: true,
    risk_level: "critical",
    metadata: { engineChassis: "Altered Chassis Serial", sightings: 4 }
  },
  // Locations
  {
    id: "e601",
    case_id: "c1a22222-2222-4222-b222-222222222201",
    entity_type: "location",
    entity_value: "Sector 18 Cyber Hub Safehouse",
    label: "Safehouse: Sector 18, Gurugram NCR",
    confidence: 94,
    is_verified: true,
    risk_level: "critical",
    metadata: { type: "Command Center / VoIP Node", raided: true }
  },
  {
    id: "e602",
    case_id: "c1a22222-2222-4222-b222-222222222202",
    entity_type: "location",
    entity_value: "BKC Financial Enclave",
    label: "Target Area: BKC Financial Enclave, Mumbai",
    confidence: 97,
    is_verified: true,
    risk_level: "high",
    metadata: { type: "Bank Branch Extraction Corridor" }
  },
  {
    id: "e603",
    case_id: "c1a22222-2222-4222-b222-222222222203",
    entity_type: "location",
    entity_value: "Indiranagar Freight Depot",
    label: "Dead-Drop Depot: Indiranagar Bengaluru",
    confidence: 89,
    is_verified: true,
    risk_level: "medium",
    metadata: { type: "Narcotics Parcel Transit Hub" }
  }
];

// Relationships connecting the entities (Edges)
const sampleRelationships = [
  {
    id: "r01",
    case_id: "c1a22222-2222-4222-b222-222222222201",
    source_entity_id: "e101", // Sameer Sheikh
    target_entity_id: "e102", // Rohan Batra
    relationship_type: "controls_operations_of",
    source_text: "Encrypted WhatsApp chats retrieved from Rohan Batra confirmed weekly operational instructions directly issued by 'Shadow-X' (Sameer Sheikh).",
    confidence: 96,
    is_verified: true
  },
  {
    id: "r02",
    case_id: "c1a22222-2222-4222-b222-222222222201",
    source_entity_id: "e101", // Sameer Sheikh
    target_entity_id: "e201", // Western Pearl Shell
    relationship_type: "beneficial_owner_of",
    source_text: "Corporate registry filing documents recovered during raid identify Sheikh as sole ultimate economic beneficiary of Western Pearl Shell Holding Ltd.",
    confidence: 98,
    is_verified: true
  },
  {
    id: "r03",
    case_id: "c1a22222-2222-4222-b222-222222222201",
    source_entity_id: "e101", // Sameer Sheikh
    target_entity_id: "e103", // Farooq Choksi
    relationship_type: "financial_hawala_partner",
    source_text: "Ledger notebook seized in South Extension listed code word 'Falcon-77' designating Farooq Choksi as cash hawala counter-party.",
    confidence: 94,
    is_verified: true
  },
  {
    id: "r04",
    case_id: "c1a22222-2222-4222-b222-222222222201",
    source_entity_id: "e102", // Rohan Batra
    target_entity_id: "e301", // +44-7700-900821
    relationship_type: "registered_and_operates",
    source_text: "VoIP gateway MAC address configuration in Batra's seized laptop showed static session routing to virtual number +44-7700-900821.",
    confidence: 99,
    is_verified: true
  },
  {
    id: "r05",
    case_id: "c1a22222-2222-4222-b222-222222222201",
    source_entity_id: "e102", // Rohan Batra
    target_entity_id: "e302", // +91-98991-88421
    relationship_type: "communicated_with",
    source_text: "Call Detail Records (CDR) demonstrate 114 bidirectional calls between Batra and SIM +91-98991-88421 preceding extortion demands.",
    confidence: 95,
    is_verified: true
  },
  {
    id: "r06",
    case_id: "c1a22222-2222-4222-b222-222222222201",
    source_entity_id: "e102", // Rohan Batra
    target_entity_id: "e601", // Gurugram Safehouse
    relationship_type: "stationed_at",
    source_text: "GPS tower triangulation placed Rohan Batra's device at Sector 18 Gurugram location continuously for 18 days.",
    confidence: 93,
    is_verified: true
  },
  {
    id: "r07",
    case_id: "c1a22222-2222-4222-b222-222222222201",
    source_entity_id: "e101", // Sameer Sheikh
    target_entity_id: "e502", // Black Scorpio N
    relationship_type: "frequent_passenger_in",
    source_text: "ANPR camera logs on NH-48 capture DL-01-CZ-9901 multiple times with facial match score 88% corresponding to Sheikh.",
    confidence: 88,
    is_verified: true
  },
  {
    id: "r08",
    case_id: "c1a22222-2222-4222-b222-222222222201",
    source_entity_id: "e201", // Western Pearl Shell
    target_entity_id: "e402", // HSBC Cyprus A/C
    relationship_type: "holds_bank_account",
    source_text: "Banking SWIFT wire receipts confirm HSBC-CY-4882019920 is registered under corporate name Western Pearl Shell Holding Ltd.",
    confidence: 99,
    is_verified: true
  },
  {
    id: "r09",
    case_id: "c1a22222-2222-4222-b222-222222222202",
    source_entity_id: "e103", // Farooq Choksi
    target_entity_id: "e104", // Nikhil Joshi
    relationship_type: "funds_transfer_link",
    source_text: "Hawala cash book entries indicate token numbers matched deposits into mule accounts organized by Nikhil Joshi.",
    confidence: 91,
    is_verified: true
  },
  {
    id: "r10",
    case_id: "c1a22222-2222-4222-b222-222222222202",
    source_entity_id: "e104", // Nikhil Joshi
    target_entity_id: "e401", // HDFC Bank Account
    relationship_type: "controls_mule_account",
    source_text: "ATM surveillance video at Bandra West shows Nikhil Joshi withdrawing cash using debit card linked to HDFC A/C 009182390112.",
    confidence: 97,
    is_verified: true
  },
  {
    id: "r11",
    case_id: "c1a22222-2222-4222-b222-222222222202",
    source_entity_id: "e104", // Nikhil Joshi
    target_entity_id: "e403", // SBI Dummy Account
    relationship_type: "transferred_funds_to",
    source_text: "Immediate Payment Service (IMPS) logs confirm INR 45 Lakhs transferred from HDFC account into SBI mule account within 12 minutes.",
    confidence: 98,
    is_verified: true
  },
  {
    id: "r12",
    case_id: "c1a22222-2222-4222-b222-222222222202",
    source_entity_id: "e104", // Nikhil Joshi
    target_entity_id: "e303", // +91-98201-44789
    relationship_type: "uses_phone_number",
    source_text: "Device seized during raid at Dadar railway station was active with subscriber number +91-98201-44789.",
    confidence: 99,
    is_verified: true
  },
  {
    id: "r13",
    case_id: "c1a22222-2222-4222-b222-222222222202",
    source_entity_id: "e104", // Nikhil Joshi
    target_entity_id: "e202", // Titan Logistics
    relationship_type: "payroll_front_employee",
    source_text: "Nikhil Joshi was officially designated as 'Logistics Fleet Dispatcher' on Titan Logistics payroll to justify illicit banking movements.",
    confidence: 90,
    is_verified: true
  },
  {
    id: "r14",
    case_id: "c1a22222-2222-4222-b222-222222222202",
    source_entity_id: "e202", // Titan Logistics
    target_entity_id: "e602", // BKC Financial Enclave
    relationship_type: "physical_branch_office",
    source_text: "Commercial lease agreement lists Titan Logistics operational regional office adjacent to BKC Financial Enclave.",
    confidence: 94,
    is_verified: true
  },
  {
    id: "r15",
    case_id: "c1a22222-2222-4222-b222-222222222202",
    source_entity_id: "e106", // Pooja Hegde / Maya
    target_entity_id: "e401", // HDFC Account
    relationship_type: "offramps_crypto_into",
    source_text: "Blockchain analytics tracing coin-join clusters reveals 18 transactions converted from USDT into INR via HDFC account.",
    confidence: 87,
    is_verified: false
  },
  {
    id: "r16",
    case_id: "c1a22222-2222-4222-b222-222222222202",
    source_entity_id: "e106", // Pooja Hegde / Maya
    target_entity_id: "e201", // Western Pearl Shell
    relationship_type: "crypto_consultant_for",
    source_text: "Invoices for 'Blockchain Technical Advisory' totaling 120,000 USD paid by Western Pearl to Maya's crypto wallet.",
    confidence: 86,
    is_verified: false
  },
  {
    id: "r17",
    case_id: "c1a22222-2222-4222-b222-222222222203",
    source_entity_id: "e105", // Vikramaditya Rathore
    target_entity_id: "e501", // KA-03-MN-7712 Fortuner
    relationship_type: "regularly_drives",
    source_text: "Toll plaza surveillance footage at Electronic City identifies Rathore at the steering wheel of KA-03-MN-7712.",
    confidence: 96,
    is_verified: true
  },
  {
    id: "r18",
    case_id: "c1a22222-2222-4222-b222-222222222203",
    source_entity_id: "e105", // Vikramaditya Rathore
    target_entity_id: "e503", // PB-65-AK-9090
    relationship_type: "supplied_vehicle_to_gang",
    source_text: "Witness deposition links Rathore to supplying altered chassis SUV PB-65-AK-9090 for Chandigarh heist.",
    confidence: 91,
    is_verified: true
  },
  {
    id: "r19",
    case_id: "c1a22222-2222-4222-b222-222222222203",
    source_entity_id: "e105", // Vikramaditya Rathore
    target_entity_id: "e203", // AeroExpress
    relationship_type: "infiltrated_courier_depot",
    source_text: "Night shift supervisor statement states Rathore gained unauthorized access to dispatch bays using fake security badges.",
    confidence: 88,
    is_verified: true
  },
  {
    id: "r20",
    case_id: "c1a22222-2222-4222-b222-222222222203",
    source_entity_id: "e203", // AeroExpress
    target_entity_id: "e603", // Indiranagar Freight Depot
    relationship_type: "operates_transit_point_at",
    source_text: "Consignment manifests mark Indiranagar Freight Depot as primary regional sorting facility for intercepted packages.",
    confidence: 98,
    is_verified: true
  },
  {
    id: "r21",
    case_id: "c1a22222-2222-4222-b222-222222222201",
    source_entity_id: "e105", // Vikramaditya Rathore
    target_entity_id: "e101", // Sameer Sheikh
    relationship_type: "armed_protection_contract",
    source_text: "Intercepted audio recording references 'Vicky will handle physical safety of NCR asset transit for Sameer Bhai'.",
    confidence: 85,
    is_verified: false
  },
  {
    id: "r22",
    case_id: "c1a22222-2222-4222-b222-222222222201",
    source_entity_id: "e402", // HSBC Cyprus
    target_entity_id: "e401", // HDFC Bank Account
    relationship_type: "wire_transfer_clearing",
    source_text: "SWIFT MT103 confirmation message links Cyprus wire clearing to HDFC correspondent account.",
    confidence: 95,
    is_verified: true
  }
];

// Evidence files in vault
const sampleEvidence = [
  {
    id: "ev1",
    evidence_number: "EVD-2026-031",
    file_name: "CCTV_SouthExt_ATM_EscapeRoute_Cam4.mp4",
    file_path: "/storage/evidence/cctv_sample.mp4",
    file_type: "video/mp4",
    file_size: 24500120,
    category: "CCTV Footage",
    case_id: "c1a22222-2222-4222-b222-222222222201",
    case_number: "CASE-2026-089",
    uploaded_by: "Inspector Rajesh Sharma",
    description: "High-definition 1080p surveillance recording capturing suspect vehicle DL-01-CZ-9901 fleeing South Extension intersection at 02:44 AM.",
    hash_sha256: "9f83c1264b1979929815049a1d354b281fcd9550e6f9822a9f4c3912a78189c4",
    created_at: "2026-02-19T06:30:00Z"
  },
  {
    id: "ev2",
    evidence_number: "EVD-2026-044",
    file_name: "CDR_Analysis_VoIP_Trunk_900821.pdf",
    file_path: "/storage/evidence/cdr_analysis.pdf",
    file_type: "application/pdf",
    file_size: 4520110,
    category: "Call Detail Records (CDR)",
    case_id: "c1a22222-2222-4222-b222-222222222201",
    case_number: "CASE-2026-089",
    uploaded_by: "ACP Sunita Verma",
    description: "Detailed cellular tower & VoIP session connection records demonstrating 48 outbound extortion demands between Delhi and UK relay numbers.",
    hash_sha256: "3b29c546e10981d77a88001bc93902381e4b984361596b653428987113cd1089",
    created_at: "2026-02-21T11:15:00Z"
  },
  {
    id: "ev3",
    evidence_number: "EVD-2026-059",
    file_name: "Forensic_Audit_HDFC_Mule_Accounts.xlsx",
    file_path: "/storage/evidence/financial_audit.xlsx",
    file_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    file_size: 1890340,
    category: "Bank Financial Audit",
    case_id: "c1a22222-2222-4222-b222-222222222202",
    case_number: "CASE-2026-094",
    uploaded_by: "ACP Sunita Verma",
    description: "Consolidated bank transaction forensic ledger revealing 36 dummy mule accounts and rapid layering transfers totaling INR 14.8 Crores.",
    hash_sha256: "72a44bb0532289410cb234919502931124efacbd894125719918231aa4921b33",
    created_at: "2026-02-26T14:40:00Z"
  },
  {
    id: "ev4",
    evidence_number: "EVD-2026-072",
    file_name: "Ballistics_Forensic_Lab_Report_049.pdf",
    file_path: "/storage/evidence/ballistics_report.pdf",
    file_type: "application/pdf",
    file_size: 3200190,
    category: "Forensic Lab Report",
    case_id: "c1a22222-2222-4222-b222-222222222205",
    case_number: "CASE-2026-121",
    uploaded_by: "DSP Amit Deshmukh",
    description: "Central Forensic Science Laboratory (CFSL) ballistics comparison matching breech face striations of seized 9mm firearms to Kidderpore dock consignment.",
    hash_sha256: "c1389271649172348a8029193189283726194729104928173928172938192847",
    created_at: "2026-03-12T09:00:00Z"
  },
  {
    id: "ev5",
    evidence_number: "EVD-2026-088",
    file_name: "WhatsApp_Chat_Extraction_Batra_Device.txt",
    file_path: "/storage/evidence/whatsapp_chat_batra.txt",
    file_type: "text/plain",
    file_size: 840230,
    category: "WhatsApp Chat Export",
    case_id: "c1a22222-2222-4222-b222-222222222201",
    case_number: "CASE-2026-089",
    uploaded_by: "Inspector Rajesh Sharma",
    description: "Cellebrite physical UFED extraction of end-to-end encrypted chats recovering extortion scripts, burner SIM serials, and drop coordinates.",
    hash_sha256: "8e91028374928172635418294029183746281920394857261524384950392817",
    created_at: "2026-03-02T16:20:00Z"
  }
];

// AI Intelligence Alerts for the Command Center
const sampleAlerts = [
  {
    id: "alt-1",
    title: "Critical Cross-Case Suspect Entity Overlap Detected",
    message: "AI Network Engine detected suspect Vikramaditya Rathore ('Vicky') linked across CASE-2026-089 (Extortion) and CASE-2026-147 (Highway Robbery). High flight risk.",
    priority: "Critical",
    case_id: "c1a22222-2222-4222-b222-222222222201",
    case_number: "CASE-2026-089",
    is_read: false,
    created_at: "2026-03-27T10:14:00Z"
  },
  {
    id: "alt-2",
    title: "Layered Offshore Fund Transfer Anomaly Alert",
    message: "Automated banking cross-match identified INR 4.2 Crores routed from HDFC mule accounts into Nicosia HSBC offshore entity registered to Western Pearl Shell.",
    priority: "Critical",
    case_id: "c1a22222-2222-4222-b222-222222222202",
    case_number: "CASE-2026-094",
    is_read: false,
    created_at: "2026-03-26T18:45:00Z"
  },
  {
    id: "alt-3",
    title: "VoIP Gateway Active Burst in Sector 18 Gurugram",
    message: "Repeated ping sequences registered on virtual trunk +44 7700 900821 matching extortion threat intervals. Immediate geo-fence perimeter recommended.",
    priority: "High",
    case_id: "c1a22222-2222-4222-b222-222222222201",
    case_number: "CASE-2026-089",
    is_read: false,
    created_at: "2026-03-25T14:20:00Z"
  },
  {
    id: "alt-4",
    title: "New Synthetic Consignment Intercepted at Kempegowda Hub",
    message: "Package dispatched using fake company seal matching AeroExpress seized by Anti-Narcotics unit. QR code metadata linked to ongoing Case 102.",
    priority: "High",
    case_id: "c1a22222-2222-4222-b222-222222222203",
    case_number: "CASE-2026-102",
    is_read: true,
    created_at: "2026-03-24T09:30:00Z"
  }
];

// Sample AI Reports
const sampleReports = [
  {
    id: "rpt-1",
    report_number: "RPT-2026-0105",
    report_title: "Syndicate Comprehensive Intelligence Dossier - Operation Shadow Web",
    report_type: "Criminal Syndicate Network Brief",
    case_id: "c1a22222-2222-4222-b222-222222222201",
    generated_by: "Inspector Rajesh Sharma",
    summary_content: "Comprehensive multi-layered intelligence assessment combining NLP extraction from 14 FIRs, 48 CDR transcripts, and SWIFT wire traces. Confirms organized hierarchical structure led by Sameer Sheikh ('Shadow-X') utilizing Cypriot shell holding entities and local telecom mule rings for systematic extortion.",
    details_json: {
      totalEntities: 8,
      totalRelationships: 11,
      riskLevel: "CRITICAL",
      confidenceScore: "94.2%",
      keyRecommendation: "Coordinate with Interpol National Central Bureau (NCB New Delhi) for Red Notice issuance against primary shell directors."
    },
    created_at: "2026-03-20T11:00:00Z"
  },
  {
    id: "rpt-2",
    report_number: "RPT-2026-0106",
    report_title: "Financial Forensic Flow Audit - Operation Titan Mule",
    report_type: "Investigation Dossier",
    case_id: "c1a22222-2222-4222-b222-222222222202",
    generated_by: "ACP Sunita Verma",
    summary_content: "Granular audit of 36 dummy bank accounts documenting rapid automated splitting of INR 14.8 Crores across multiple banking nodes within 240 minutes. Identifies Titan Logistics Pvt Ltd as principal corporate laundering front.",
    details_json: {
      totalEntities: 7,
      totalRelationships: 8,
      riskLevel: "HIGH",
      confidenceScore: "96.5%",
      keyRecommendation: "Issue Section 102 CrPC freezing orders on identified accounts and summon Titan Logistics statutory auditors."
    },
    created_at: "2026-03-22T15:30:00Z"
  }
];

// Sample Audit Logs
const sampleAuditLogs = [
  {
    id: "aud-1",
    officer_name: "Inspector Rajesh Sharma",
    officer_id: "IND-POL-8842",
    action: "OFFICER_LOGIN",
    details: "Authenticated successfully from Command Terminal Terminal-NCR-04 via Biometric/Key token.",
    ip_address: "10.14.88.21",
    created_at: "2026-03-27T09:00:15Z"
  },
  {
    id: "aud-2",
    officer_name: "Inspector Rajesh Sharma",
    officer_id: "IND-POL-8842",
    action: "AI_ANALYSIS_EXECUTED",
    details: "Executed Gemini 1.5 NLP extraction on 'FIR-2026-DEL-0412.pdf'. 8 entities, 11 relationships mapped with 94% confidence.",
    ip_address: "10.14.88.21",
    created_at: "2026-03-27T09:15:30Z"
  },
  {
    id: "aud-3",
    officer_name: "ACP Sunita Verma",
    officer_id: "IND-POL-5521",
    action: "EVIDENCE_ACCESSED",
    details: "Downloaded encrypted forensic audit ledger 'Forensic_Audit_HDFC_Mule_Accounts.xlsx' for court affidavit submission.",
    ip_address: "10.14.92.10",
    created_at: "2026-03-26T14:10:00Z"
  },
  {
    id: "aud-4",
    officer_name: "DSP Amit Deshmukh",
    officer_id: "IND-POL-9914",
    action: "NETWORK_GRAPH_EXPORT",
    details: "Exported high-resolution criminal syndicate topology graph for Inter-Agency Task Force briefing.",
    ip_address: "10.14.77.44",
    created_at: "2026-03-25T11:45:00Z"
  }
];

module.exports = {
  sampleOfficers,
  sampleFIRs,
  sampleCases,
  sampleEntities,
  sampleRelationships,
  sampleEvidence,
  sampleAlerts,
  sampleReports,
  sampleAuditLogs
};
