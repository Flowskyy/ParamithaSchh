import fs from 'node:fs';
import path from 'node:path';
import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function sanitizeFilename(name) {
  const base = String(name || 'file')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .slice(0, 120);
  return base || 'file';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    ensureDirSync(uploadDir);

    const form = new IncomingForm({
      multiples: false,
      keepExtensions: true,
      uploadDir,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      filename: (_name, ext, part) => {
        const original = part?.originalFilename || part?.mimetype?.split('/')[1] || _name || 'file';
        const sanitized = sanitizeFilename(original);
        const extClean = ext ? String(ext).replace('.', '') : path.extname(sanitized).replace('.', '');
        const ts = Date.now();
        const origBase = sanitized.includes('.') ? sanitized.slice(0, sanitized.lastIndexOf('.')) : sanitized;
        const finalExt = extClean ? `.${extClean}` : '';
        return `${ts}-${origBase}${finalExt}`;
      },
    });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, flds, fls) => {
        if (err) {
          console.error('Formidable parse error:', err);
          return reject(err);
        }
        console.log('Parsed files:', JSON.stringify(fls, null, 2));
        resolve({ fields: flds, files: fls });
      });
    });

    // Expect input name: `file`
    // Handle both single file and array structures from formidable v3
    let file = files?.file || files?.image || Object.values(files || {})[0];
    
    // If file is an array, take the first element
    if (Array.isArray(file)) {
      file = file[0];
    }
    
    if (!file) {
      res.status(400).json({ success: false, error: 'File is required' });
      return;
    }

    // Handle both formidable v2 and v3 file object structures
    const filePath = file.filepath || file.path;
    if (!filePath) {
      console.error('File object structure:', JSON.stringify(file, null, 2));
      res.status(500).json({ success: false, error: 'Upload failed (file path not found)' });
      return;
    }

    const finalName = file.newFilename || file.originalFilename || path.basename(filePath);
    if (!finalName) {
      res.status(500).json({ success: false, error: 'Upload failed (filename not found)' });
      return;
    }

    // In this setup formidable already stored it in uploadDir with our filename()
    // But ensure final file exists.
    if (!fs.existsSync(filePath)) {
      res.status(500).json({ success: false, error: 'Upload failed (file not found after upload)' });
      return;
    }

    const url = `/uploads/${finalName}`;
    res.status(200).json({ success: true, url });
  } catch (err) {
    res.status(500).json({ success: false, error: err?.message || 'Upload failed' });
  }
}

