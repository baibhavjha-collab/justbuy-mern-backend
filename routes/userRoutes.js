import express from 'express';
import protect from '../middleware/authMiddleware.js';
import adminOnly from '../middleware/adminMiddleware.js';
import {getProfile,updateProfile,listUsers} from '../controllers/userController.js';
const router=express.Router();router.get('/profile',protect,getProfile);router.put('/profile',protect,updateProfile);router.get('/',protect,adminOnly,listUsers);export default router;
