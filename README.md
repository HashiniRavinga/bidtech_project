# BidTech Backend API

Complete backend API for the BidTech bidding platform with MySQL, MongoDB, JWT authentication, and Socket.io real-time notifications.

## 🚀 Quick Start Guide

### Prerequisites

1. **Node.js** (v18 or higher)
2. **MySQL** (v8.0 or higher)
3. **MongoDB** (v5.0 or higher)
4. **npm** or **yarn**

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Database Setup

#### MySQL Setup
1. Install MySQL and start the service
2. Create a database:
```sql
CREATE DATABASE bidtech_db;
```
3. Create a MySQL user (optional but recommended):
```sql
CREATE USER 'bidtech_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON bidtech_db.* TO 'bidtech_user'@'localhost';
FLUSH PRIVILEGES;
```

#### MongoDB Setup
1. Install MongoDB and start the service
2. MongoDB will automatically create the database when first used

### Step 3: Environment Configuration

Create a `.env` file in the backend directory and update the values:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration (CHANGE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
JWT_EXPIRES_IN=7d

# MySQL Database Configuration
DB_HOST=localhost
DB_USER=root                    # or your MySQL username
DB_PASSWORD=your-mysql-password # your MySQL password
DB_NAME=bidtech_db

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/bidtech_reviews

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Step 4: Start the Backend

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

### Step 5: Seed Sample Data (Optional)

```bash
npm run seed
```

This will create sample users, shops, requirements, bids, and reviews for testing.

### Step 6: Update Frontend API URL

In your frontend project, update the API base URL. Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:5000/api
```

Then update your frontend API calls to use this base URL.

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password

### Shops
- `GET /api/shops/profile` - Get shop profile (shop owner only)
- `PUT /api/shops/profile` - Update shop profile (shop owner only)
- `GET /api/shops/verified` - Get all verified shops
- `GET /api/shops/:id` - Get shop by ID

### Requirements
- `POST /api/requirements` - Create requirement (customer only)
- `GET /api/requirements` - Get all active requirements
- `GET /api/requirements/my` - Get user's requirements (customer only)
- `GET /api/requirements/:id` - Get requirement by ID
- `PUT /api/requirements/:id/status` - Update requirement status

### Bids
- `POST /api/bids` - Submit bid (shop owner only)
- `GET /api/bids/requirement/:id` - Get bids for requirement (customer only)
- `GET /api/bids/my` - Get shop's bids (shop owner only)
- `PUT /api/bids/:id/status` - Accept/reject bid (customer only)

### Reviews
- `POST /api/reviews` - Submit review (customer only)
- `GET /api/reviews/shop/:id` - Get reviews for shop
- `GET /api/reviews/my` - Get user's reviews (customer only)

### Notifications
- `GET /api/notifications` - Get user's notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read
- `GET /api/notifications/unread-count` - Get unread notification count

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer your-jwt-token
```

## 📱 Real-time Features

The backend uses Socket.io for real-time notifications. Events include:
- `bid_notification` - New bid received
- `notification` - General notifications
- `new_requirement` - New requirement posted

## 🗄️ Database Schema

### MySQL Tables
- `users` - User authentication and profile data
- `shops` - Shop profiles and verification status
- `requirements` - Customer requirements/requests
- `bids` - Shop bids on requirements
- `notifications` - User notifications

### MongoDB Collections
- `reviews` - Customer reviews and ratings for shops

## 🚨 Important Security Notes

1. **Change JWT_SECRET** in production to a secure random string
2. **Use strong passwords** for database users
3. **Enable SSL/TLS** for production databases
4. **Implement rate limiting** (already included)
5. **Use HTTPS** in production
6. **Validate and sanitize** all user inputs (validation included)

## 📦 Sample Login Credentials

After running `npm run seed`, you can use these test accounts:

**Customers:**
- Email: `john.doe@gmail.com` / Password: `password123`
- Email: `jane.smith@gmail.com` / Password: `password123`

**Shop Owners:**
- Email: `tech.store@gmail.com` / Password: `password123`
- Email: `gadget.world@gmail.com` / Password: `password123`

## 🛠️ Development Tips

1. **Use nodemon** for auto-reload during development:
```bash
npm run dev
```

2. **Check logs** for debugging:
```bash
# Backend logs will show database connections, errors, and requests
```

3. **Test API endpoints** using tools like Postman or Thunder Client

4. **Monitor real-time events** using Socket.io client tools

## 🔧 Troubleshooting

### Common Issues:

1. **MySQL Connection Failed:**
   - Verify MySQL is running
   - Check credentials in `.env`
   - Ensure database exists

2. **MongoDB Connection Failed:**
   - Verify MongoDB is running
   - Check connection string in `.env`

3. **Port Already in Use:**
   - Change PORT in `.env` file
   - Kill existing processes using the port

4. **JWT Token Issues:**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure proper Authorization header format

## 📞 Support

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify all dependencies are installed correctly
3. Ensure databases are running and accessible
4. Check that all environment variables are properly set

The backend is now ready to support all BidTech features including user authentication, shop management, requirement posting, bidding system, reviews, and real-time notifications!