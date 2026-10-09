import express from 'express';
import crypto from 'crypto';
import cloudinary from '../config/cloudinary.js';
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

    // Validate image data and file type
    if (!data || !allowed.includes(mimeType)) {
      return res.status(400).json({
        message: 'Please select a JPG, PNG, WEBP or GIF image.',
      });
    }

    // Decode the Base64 image
    const buffer = Buffer.from(data, 'base64');

    if (buffer.length === 0) {
      return res.status(400).json({
        message: 'The uploaded image is empty.',
      });
    }

    // Limit image size to 5 MB
    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({
        message: 'Image must be 5 MB or smaller.',
      });
    }

    // Upload image to Cloudinary
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

    // Return the secure Cloudinary image URL
    return res.status(201).json({
      url: uploadResult.secure_url,
    });

  } catch (error) {
    console.error('Cloudinary upload failed:', error.message);
    next(error);
  }
});

export default router;