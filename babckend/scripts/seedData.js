import bcrypt from 'bcryptjs';
import { getDB, connectMySQL, connectMongoDB } from '../config/database.js';
import Review from '../models/Review.js';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectMySQL();
    await connectMongoDB();
    
    const db = getDB();

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.execute('SET FOREIGN_KEY_CHECKS = 0');
    await db.execute('DELETE FROM notifications');
    await db.execute('DELETE FROM bids');
    await db.execute('DELETE FROM requirements');
    await db.execute('DELETE FROM shops');
    await db.execute('DELETE FROM users');
    await db.execute('SET FOREIGN_KEY_CHECKS = 1');
    await Review.deleteMany({});

    // Create sample users
    console.log('👤 Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Customers
    const [customer1] = await db.execute(
      'INSERT INTO users (email, password, role, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?, ?)',
      ['john.doe@gmail.com', hashedPassword, 'customer', 'John', 'Doe', '+94771234567']
    );

    const [customer2] = await db.execute(
      'INSERT INTO users (email, password, role, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?, ?)',
      ['jane.smith@gmail.com', hashedPassword, 'customer', 'Jane', 'Smith', '+94777654321']
    );

    // Shop Owners
    const [shopOwner1] = await db.execute(
      'INSERT INTO users (email, password, role, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?, ?)',
      ['tech.store@gmail.com', hashedPassword, 'shop_owner', 'Tech', 'Store', '+94112345678']
    );

    const [shopOwner2] = await db.execute(
      'INSERT INTO users (email, password, role, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?, ?)',
      ['gadget.world@gmail.com', hashedPassword, 'shop_owner', 'Gadget', 'World', '+94118765432']
    );

    // Create shops
    console.log('🏪 Creating shops...');
    const [shop1] = await db.execute(
      'INSERT INTO shops (user_id, shop_name, address, verification_status, tags, average_rating, total_reviews) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [shopOwner1.insertId, 'TechHub Electronics', '123 Galle Road, Colombo 03', 'verified', JSON.stringify(['Laptop', 'Desktop', 'Mobile', 'Accessories']), 4.5, 15]
    );

    const [shop2] = await db.execute(
      'INSERT INTO shops (user_id, shop_name, address, verification_status, tags, average_rating, total_reviews) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [shopOwner2.insertId, 'Gadget World', '456 Kandy Road, Peradeniya', 'verified', JSON.stringify(['Mobile', 'Tablet', 'Smartwatch', 'Accessories']), 4.2, 8]
    );

    // Create requirements
    console.log('📝 Creating requirements...');
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);

    const [req1] = await db.execute(
      'INSERT INTO requirements (customer_id, title, description, budget, tags, expiry_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [customer1.insertId, 'Gaming Laptop Required', 'Looking for a high-performance gaming laptop with RTX graphics', 250000, JSON.stringify(['Laptop', 'Gaming', 'RTX']), futureDate, 'active']
    );

    const [req2] = await db.execute(
      'INSERT INTO requirements (customer_id, title, description, budget, tags, expiry_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [customer2.insertId, 'iPhone 15 Pro Max', 'Need latest iPhone with 256GB storage', 380000, JSON.stringify(['Mobile', 'iPhone', 'Apple']), futureDate, 'active']
    );

    // Create bids
    console.log('💰 Creating bids...');
    const bidExpiryDate = new Date();
    bidExpiryDate.setDate(bidExpiryDate.getDate() + 3);

    await db.execute(
      'INSERT INTO bids (requirement_id, shop_id, price, warranty_details, message, expiry_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req1.insertId, shop1.insertId, 235000, '2 years international warranty', 'ASUS ROG Strix G15 with RTX 3060, perfect for gaming!', bidExpiryDate, 'pending']
    );

    await db.execute(
      'INSERT INTO bids (requirement_id, shop_id, price, warranty_details, message, expiry_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req2.insertId, shop2.insertId, 375000, '1 year Apple warranty', 'Brand new iPhone 15 Pro Max 256GB in Natural Titanium', bidExpiryDate, 'pending']
    );

    // Create sample reviews
    console.log('⭐ Creating reviews...');
    const sampleReviews = [
      {
        customerId: customer1.insertId,
        shopId: shop1.insertId,
        bidId: 1,
        rating: 5,
        comment: 'Excellent service and quality products! Highly recommended.',
        customerName: 'John Doe'
      },
      {
        customerId: customer2.insertId,
        shopId: shop1.insertId,
        bidId: 2,
        rating: 4,
        comment: 'Good experience overall, fast delivery.',
        customerName: 'Jane Smith'
      },
      {
        customerId: customer1.insertId,
        shopId: shop2.insertId,
        bidId: 3,
        rating: 4,
        comment: 'Great prices and helpful staff.',
        customerName: 'John Doe'
      }
    ];

    for (const review of sampleReviews) {
      const newReview = new Review(review);
      await newReview.save();
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('📧 Sample login credentials:');
    console.log('   Customer: john.doe@gmail.com / password123');
    console.log('   Customer: jane.smith@gmail.com / password123');
    console.log('   Shop Owner: tech.store@gmail.com / password123');
    console.log('   Shop Owner: gadget.world@gmail.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();