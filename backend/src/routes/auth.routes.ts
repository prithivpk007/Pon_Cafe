import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDb } from '../config/database.js';
import { generateToken, authenticateToken, AuthRequest } from '../middleware/auth.js';
import { User } from '../types.js';

const router = Router();

// Register new customer
router.post('/register', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password) {
      res.status(400).json({ success: false, message: 'Full name, email, mobile number, and password are required.' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone.trim();

    const db = getDb();
    const existingUser = db.users.find(u => u.email.toLowerCase() === cleanEmail || u.phone === cleanPhone);

    if (existingUser) {
      res.status(409).json({ success: false, message: 'An account with this email or mobile number already exists.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: `usr-${uuidv4().substring(0, 8)}`,
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      password: hashedPassword,
      role: 'customer',
      address: address?.trim() || '',
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    saveDb(db);

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
      phone: newUser.phone
    });

    const { password: _, ...safeUser } = newUser;
    res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Internal server error during registration.' });
  }
});

// Login for customers and administrator
router.post('/login', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body; // email or phone

    if (!identifier || !password) {
      res.status(400).json({ success: false, message: 'Email/Mobile and password are required.' });
      return;
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const db = getDb();

    const user = db.users.find(
      u => u.email.toLowerCase() === cleanIdentifier || u.phone === cleanIdentifier
    );

    if (!user || !user.password) {
      res.status(401).json({ success: false, message: 'Invalid credentials. Please check and try again.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials. Please check and try again.' });
      return;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      phone: user.phone
    });

    const { password: _, ...safeUser } = user;
    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
});

// Get current profile
router.get('/me', authenticateToken, (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const db = getDb();
  const user = db.users.find(u => u.id === req.user?.id);

  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }

  const { password: _, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
});

// Update profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, phone, address, newPassword } = req.body;
    const db = getDb();
    const userIndex = db.users.findIndex(u => u.id === req.user?.id);

    if (userIndex === -1) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const user = db.users[userIndex];
    if (name) user.name = name.trim();
    if (phone) user.phone = phone.trim();
    if (address !== undefined) user.address = address.trim();

    if (newPassword && newPassword.length >= 6) {
      user.password = await bcrypt.hash(newPassword, 10);
    }

    db.users[userIndex] = user;
    saveDb(db);

    const { password: _, ...safeUser } = user;
    res.json({ success: true, message: 'Profile updated successfully', user: safeUser });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
});

export default router;
