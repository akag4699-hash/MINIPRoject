// ==============================================================================
// Multer Upload Configuration Middleware
// Supports PDF, DOCX, TXT, JPG, PNG with strict validation
// ==============================================================================

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// const uploadsDir = path.join(__dirname, '..', 'storage', 'uploads');
// const evidenceDir = path.join(__dirname, '..', 'storage', 'evidence');
const uploadsDir = '/tmp/miniproject-storage/uploads';
const evidenceDir = '/tmp/miniproject-storage/evidence';

// Ensure storage directories exist
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(evidenceDir)) fs.mkdirSync(evidenceDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // If route is /api/evidence, save to evidence folder, otherwise uploads
    if (req.baseUrl.includes('evidence')) {
      cb(null, evidenceDir);
    } else {
      cb(null, uploadsDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const cleanOriginalName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${uniqueSuffix}-${cleanOriginalName}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.docx', '.txt', '.jpg', '.jpeg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${ext}. Allowed formats: PDF, DOCX, TXT, JPG, PNG.`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 30 * 1024 * 1024 // 30 MB max file size
  }
});

module.exports = upload;
