import 'dotenv/config';

import connectDB from './config/db.js';

import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Review from './models/Review.js';
import Cart from './models/Cart.js';

const seed = async () => {
  try {
    // =========================
    // CONNECT TO DATABASE
    // =========================

    await connectDB();

    // =========================
    // CLEAR EXISTING DATA
    // =========================

    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await Cart.deleteMany();

    console.log('Existing data cleared.');

    // =========================
    // USERS
    // =========================

    await User.create({
      name: 'JustBuy Admin',
      email: 'admin@justbuy.com',
      password: 'admin123',
      role: 'admin',
    });

    await User.create({
      name: 'Demo Customer',
      email: 'customer@justbuy.com',
      password: 'customer123',
      role: 'customer',
    });

    // =========================
    // CATEGORIES
    // =========================

    const names = [
      'Electronics',
      'Fashion',
      'Home',
      'Accessories',
    ];

    const cats = await Category.insertMany(
      names.map((name) => ({
        name,
        description: `${name} products`,
      }))
    );

    const cat = Object.fromEntries(
      cats.map((c) => [c.name, c._id])
    );

    // =========================
    // PRODUCTS
    // =========================

    const products = [
      {
        name: 'Wireless Headphones',
        description:
          'Comfortable over-ear headphones with clear sound and long battery life.',
        price: 2499,
        image:
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
        brand: 'AudioPro',
        category: cat.Electronics,
        stock: 25,
        rating: 0,
        numReviews: 0,
        featured: true,
      },

      {
        name: 'Smart Watch',
        description:
          'Fitness tracking, notifications and everyday smart features.',
        price: 3999,
        image:
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
        brand: 'TimeX',
        category: cat.Electronics,
        stock: 18,
        rating: 0,
        numReviews: 0,
        featured: true,
      },

      {
        name: 'Classic Sneakers',
        description:
          'Everyday sneakers designed for comfort and casual style.',
        price: 1899,
        image:
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
        brand: 'UrbanStep',
        category: cat.Fashion,
        stock: 40,
        rating: 0,
        numReviews: 0,
        featured: true,
      },

      {
        name: 'Minimal Backpack',
        description:
          'Durable daily backpack with laptop compartment.',
        price: 1299,
        image:
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
        brand: 'CarryCo',
        category: cat.Accessories,
        stock: 30,
        rating: 0,
        numReviews: 0,
        featured: false,
      },

      {
        name: 'Desk Lamp',
        description:
          'Modern adjustable LED lamp for work and study.',
        price: 999,
        image:
          'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
        brand: 'GlowHome',
        category: cat.Home,
        stock: 20,
        rating: 0,
        numReviews: 0,
        featured: true,
      },

      {
        name: 'Cotton Hoodie',
        description:
          'Soft everyday hoodie with a relaxed fit.',
        price: 1599,
        image:
          'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80',
        brand: 'Northline',
        category: cat.Fashion,
        stock: 35,
        rating: 0,
        numReviews: 0,
        featured: false,
      },
    ];

    // =========================
    // INSERT PRODUCTS
    // =========================

    await Product.insertMany(products);

    // =========================
    // COMPLETE
    // =========================

    console.log('Seed complete.');
    console.log('');
    console.log('Admin:');
    console.log('Email: admin@justbuy.com');
    console.log('Password: admin123');
    console.log('');
    console.log('Customer:');
    console.log('Email: customer@justbuy.com');
    console.log('Password: customer123');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();