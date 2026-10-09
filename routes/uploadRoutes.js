import express from 'express';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';
import protect from '../middleware/authMiddleware.js';
import adminOnly from '../middleware/adminMiddleware.js';

const router = express.Router();

const allowed = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

router.post('/product-image', protect, adminOnly, async (req, res, next) => {
  try {
    const { data, mimeType } = req.body;

    if (!data || !allowed.includes(mimeType)) {
      return res.status(400).json({
        message: 'Please select a JPG, PNG, WEBP or GIF image.',
      });
    }

    const buffer = Buffer.from(data, 'base64');

    if (buffer.length === 0) {
      return res.status(400).json({
        message: 'The uploaded image is empty.',
      });
    }

    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({
        message: 'Image must be 5 MB or smaller.',
      });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'justbuy/products',
          public_id: crypto.randomUUID(),
          resource_type: 'image',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    return res.status(201).json({
      url: uploadResult.secure_url,
    });
  } catch (error) {
    next(error);
  }
});

export default router;