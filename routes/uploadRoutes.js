import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import protect from '../middleware/authMiddleware.js';
import adminOnly from '../middleware/adminMiddleware.js';

const router = express.Router();
const uploadDir = path.resolve('uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const allowed = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif' };

router.post('/product-image', protect, adminOnly, async (req,res,next) => {
  try {
    const { data, mimeType } = req.body;
    if (!data || !allowed[mimeType]) return res.status(400).json({ message: 'Please select a JPG, PNG, WEBP or GIF image.' });
    const buffer = Buffer.from(data, 'base64');
    if (buffer.length > 5 * 1024 * 1024) return res.status(400).json({ message: 'Image must be 5 MB or smaller.' });
    const filename = `${Date.now()}-${crypto.randomUUID()}${allowed[mimeType]}`;
    fs.writeFileSync(path.join(uploadDir, filename), buffer);
    res.status(201).json({ url: `${req.protocol}://${req.get('host')}/uploads/${filename}` });
  } catch(e) { next(e); }
});

export default router;
