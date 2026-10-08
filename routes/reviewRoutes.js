import express from 'express';
import protect from '../middleware/authMiddleware.js';
import adminOnly from '../middleware/adminMiddleware.js';
import { getProductReviews, createReview, deleteReview } from '../controllers/reviewController.js';

const router = express.Router();
router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', protect, createReview);
router.delete('/:id', protect, adminOnly, deleteReview);
export default router;
