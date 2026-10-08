import Product from '../models/Product.js';

export const getProducts = async (req,res,next) => {
  try {
    const { search='', category='', minPrice='', maxPrice='', page='1', limit='12', featured='' } = req.query;
    const filter={};
    if(search) filter.$or=[{name:{$regex:search,$options:'i'}},{brand:{$regex:search,$options:'i'}},{description:{$regex:search,$options:'i'}}];
    if(category) filter.category=category;
    if(minPrice!=='' || maxPrice!==''){ filter.price={}; if(minPrice!=='') filter.price.$gte=Number(minPrice); if(maxPrice!=='') filter.price.$lte=Number(maxPrice); }
    if(featured==='true') filter.featured=true;
    const pageNum=Math.max(1,Number(page)||1), limitNum=Math.min(50,Math.max(1,Number(limit)||12));
    const total=await Product.countDocuments(filter);
    const products=await Product.find(filter).populate('category','name').sort('-createdAt').skip((pageNum-1)*limitNum).limit(limitNum);
    res.json({products,page:pageNum,pages:Math.ceil(total/limitNum),total});
  } catch(e){next(e);}
};
export const getProduct = async (req,res,next) => { try { const p=await Product.findById(req.params.id).populate('category','name'); if(!p)return res.status(404).json({message:'Product not found.'}); res.json(p); }catch(e){next(e);} };
export const createProduct = async (req,res,next) => { try { const p=await Product.create(req.body); res.status(201).json(p); }catch(e){next(e);} };
export const updateProduct = async (req,res,next) => { try { const p=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}).populate('category','name'); if(!p)return res.status(404).json({message:'Product not found.'}); res.json(p); }catch(e){next(e);} };
export const deleteProduct = async (req,res,next) => { try { const p=await Product.findByIdAndDelete(req.params.id); if(!p)return res.status(404).json({message:'Product not found.'}); res.json({message:'Product deleted.'}); }catch(e){next(e);} };
