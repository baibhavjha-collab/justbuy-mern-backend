import express from 'express';
import protect from '../middleware/authMiddleware.js';import adminOnly from '../middleware/adminMiddleware.js';
import {getProducts,getProduct,createProduct,updateProduct,deleteProduct} from '../controllers/productController.js';
const router=express.Router();router.get('/',getProducts);router.get('/:id',getProduct);router.post('/',protect,adminOnly,createProduct);router.put('/:id',protect,adminOnly,updateProduct);router.delete('/:id',protect,adminOnly,deleteProduct);export default router;
