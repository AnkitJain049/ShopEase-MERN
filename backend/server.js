import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import flash from 'express-flash';
import cors from "cors";
import methodOverride from 'method-override';
import path from 'path';
import { fileURLToPath } from 'url';

// Import custom modules
import { connectDB } from "./utils/database.js";
import { initializePassport, isAuthenticated } from "./utils/auth.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Method override for PUT/DELETE requests
app.use(methodOverride('_method'));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize Passport
initializePassport(passport);

// Authentication check endpoint (unprotected)
app.get('/api/auth/check', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ 
      authenticated: true, 
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
      }
    });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', isAuthenticated,productRoutes);
app.use('/api/user', isAuthenticated,userRoutes);
app.use('/api/payment', isAuthenticated,paymentRoutes);
app.use('/api/reviews', isAuthenticated,reviewRoutes);
app.use('/api/chatbot', isAuthenticated,chatbotRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ShopEase API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to database and start server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
}); 