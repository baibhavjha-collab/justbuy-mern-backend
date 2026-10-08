import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

export const getProductReviews = async (req,res,next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user','name').sort('-createdAt');
    res.json(reviews);
  } catch(e) { next(e); }
};

export const createReview = async (req,res,next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    const purchased = await Order.exists({
      user: req.user._id,
      orderStatus: 'delivered',
      'items.product': product._id
    });
    if (!purchased) return res.status(403).json({ message: 'You can review this product after a delivered purchase.' });
    if (await Review.findOne({ product: product._id, user: req.user._id })) return res.status(409).json({ message: 'You have already reviewed this product.' });
    const review = await Review.create({ product: product._id, user: req.user._id, rating, comment });
    const stats = await Review.aggregate([
      { $match: { product: product._id } },
      { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    await Product.findByIdAndUpdate(product._id, { rating: Number(stats[0].avg.toFixed(1)), numReviews: stats[0].count });
    res.status(201).json(await review.populate('user','name'));
  } catch(e) { next(e); }
};

export const deleteReview = async (req,res,next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found.' });
    const productId = review.product;
    await review.deleteOne();
    const stats = await Review.aggregate([
      { $match: { product: productId } },
      { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    await Product.findByIdAndUpdate(productId, { rating: stats[0] ? Number(stats[0].avg.toFixed(1)) : 0, numReviews: stats[0]?.count || 0 });
    res.json({ message: 'Review removed.' });
  } catch(e) { next(e); }
};
