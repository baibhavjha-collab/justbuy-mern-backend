import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const createOrder=async(req,res,next)=>{
  try{
    const cart=await Cart.findOne({user:req.user._id}).populate('items.product');
    if(!cart||!cart.items.length)return res.status(400).json({message:'Your cart is empty.'});
    const {shippingAddress,paymentMethod='COD'}=req.body;
    for(const item of cart.items) if(item.product.stock<item.quantity)return res.status(400).json({message:`Not enough stock for ${item.product.name}.`});
    const items=cart.items.map(i=>({product:i.product._id,name:i.product.name,image:i.product.image,price:i.product.price,quantity:i.quantity}));
    const itemsPrice=Number(items.reduce((sum,i)=>sum+i.price*i.quantity,0).toFixed(2));
    const shippingPrice=itemsPrice>=1000?0:79;
    const totalPrice=Number((itemsPrice+shippingPrice).toFixed(2));
    const order=await Order.create({user:req.user._id,items,shippingAddress,itemsPrice,shippingPrice,totalPrice,paymentMethod});
    await Promise.all(cart.items.map(i=>Product.findByIdAndUpdate(i.product._id,{$inc:{stock:-i.quantity}})));
    cart.items=[];await cart.save();
    res.status(201).json(await order.populate('user','name email'));
  }catch(e){next(e);}
};
export const myOrders=async(req,res,next)=>{try{res.json(await Order.find({user:req.user._id}).sort('-createdAt'));}catch(e){next(e);}};
export const getOrder=async(req,res,next)=>{try{const o=await Order.findById(req.params.id).populate('user','name email');if(!o)return res.status(404).json({message:'Order not found.'});if(o.user._id.toString()!==req.user._id.toString()&&req.user.role!=='admin')return res.status(403).json({message:'Access denied.'});res.json(o);}catch(e){next(e);}};
export const allOrders=async(req,res,next)=>{try{res.json(await Order.find().populate('user','name email').sort('-createdAt'));}catch(e){next(e);}};
export const updateOrderStatus=async(req,res,next)=>{try{const {orderStatus,paymentStatus}=req.body;const o=await Order.findByIdAndUpdate(req.params.id,{...(orderStatus&&{orderStatus}),...(paymentStatus&&{paymentStatus})},{new:true,runValidators:true}).populate('user','name email');if(!o)return res.status(404).json({message:'Order not found.'});res.json(o);}catch(e){next(e);}};
