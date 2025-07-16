import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import User from '../models/UserModel.js';
import { isAuthenticated } from '../utils/auth.js';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, contactNumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      contactNumber,
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login route
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ 
    message: 'Login successful', 
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      profilePic: req.user.profilePic
    }
  });
});

// Logout route
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logout successful' });
  });
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000');
  }
);

// Get current user
router.get('/me', isAuthenticated, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      profilePic: req.user.profilePic,
      contactNumber: req.user.contactNumber
    }
  });
});

// Check authentication status
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ 
      authenticated: true, 
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        profilePic: req.user.profilePic
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

// Get user ID for chatbot
router.get('/chatbot-user-id', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ userId: req.user._id.toString() });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

export default router; 