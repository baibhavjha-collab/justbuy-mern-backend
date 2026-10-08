import Category from '../models/Category.js';
export const getCategories=async(req,res,next)=>{try{res.json(await Category.find().sort('name'));}catch(e){next(e);}};
export const createCategory=async(req,res,next)=>{try{res.status(201).json(await Category.create(req.body));}catch(e){next(e);}};
export const updateCategory=async(req,res,next)=>{try{const c=await Category.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!c)return res.status(404).json({message:'Category not found.'});res.json(c);}catch(e){next(e);}};
export const deleteCategory=async(req,res,next)=>{try{const c=await Category.findByIdAndDelete(req.params.id);if(!c)return res.status(404).json({message:'Category not found.'});res.json({message:'Category deleted.'});}catch(e){next(e);}};
