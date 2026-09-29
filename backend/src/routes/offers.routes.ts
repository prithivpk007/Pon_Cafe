import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDb } from '../config/database.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth.js';
import { Offer } from '../types.js';

const router = Router();

// GET active offers for public
router.get('/', (req: Request, res: Response): void => {
  try {
    const db = getDb();
    const activeOffers = db.offers.filter(o => o.active);
    res.json({ success: true, offers: activeOffers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve offers' });
  }
});

// POST validate coupon code
router.post('/validate', (req: Request, res: Response): void => {
  try {
    const { code, cartTotal } = req.body;
    if (!code) {
      res.status(400).json({ success: false, message: 'Promo code is required.' });
      return;
    }

    const cleanCode = code.trim().toUpperCase();
    const db = getDb();
    const offer = db.offers.find(o => o.code.toUpperCase() === cleanCode && o.active);

    if (!offer) {
      res.status(404).json({ success: false, message: 'Invalid or expired coupon code.' });
      return;
    }

    const total = Number(cartTotal) || 0;
    if (total < offer.minOrderValue) {
      res.status(400).json({
        success: false,
        message: `Minimum order value of ₹${offer.minOrderValue} required for coupon '${offer.code}'.`
      });
      return;
    }

    let discount = 0;
    if (offer.discountType === 'percentage') {
      const rawDiscount = (total * offer.discountValue) / 100;
      discount = offer.maxDiscount ? Math.min(rawDiscount, offer.maxDiscount) : rawDiscount;
    } else {
      discount = offer.discountValue;
    }

    res.json({
      success: true,
      valid: true,
      message: `Coupon '${offer.code}' applied successfully! Saved ₹${discount}.`,
      offer,
      discountAmount: discount
    });
  } catch (err) {
    console.error('Error validating coupon:', err);
    res.status(500).json({ success: false, message: 'Coupon validation failed' });
  }
});

// GET all offers (Admin)
router.get('/all', authenticateToken, requireAdmin, (req: AuthRequest, res: Response): void => {
  try {
    const db = getDb();
    res.json({ success: true, offers: db.offers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve offers' });
  }
});

// POST create offer (Admin)
router.post('/', authenticateToken, requireAdmin, (req: AuthRequest, res: Response): void => {
  try {
    const { title, code, description, discountType, discountValue, minOrderValue, maxDiscount, expiryDate, active, badgeText } = req.body;

    if (!title || !code || !discountValue) {
      res.status(400).json({ success: false, message: 'Offer title, code, and discount value are required.' });
      return;
    }

    const db = getDb();
    const newOffer: Offer = {
      id: `off-${uuidv4().substring(0, 8)}`,
      title: title.trim(),
      code: code.trim().toUpperCase(),
      description: description?.trim() || '',
      discountType: discountType || 'percentage',
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrderValue) || 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      expiryDate: expiryDate || '2026-12-31T23:59:59.000Z',
      active: active !== undefined ? Boolean(active) : true,
      badgeText: badgeText || `${discountValue}% OFF`,
      createdAt: new Date().toISOString()
    };

    db.offers.unshift(newOffer);
    saveDb(db);

    res.status(201).json({ success: true, message: 'Offer created successfully!', offer: newOffer });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create offer' });
  }
});

// PUT update offer (Admin)
router.put('/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const db = getDb();
    const index = db.offers.findIndex(o => o.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'Offer not found' });
      return;
    }

    const existing = db.offers[index];
    const updated: Offer = {
      ...existing,
      ...req.body,
      id: existing.id,
      code: req.body.code ? req.body.code.trim().toUpperCase() : existing.code,
      discountValue: req.body.discountValue !== undefined ? Number(req.body.discountValue) : existing.discountValue,
      minOrderValue: req.body.minOrderValue !== undefined ? Number(req.body.minOrderValue) : existing.minOrderValue
    };

    db.offers[index] = updated;
    saveDb(db);

    res.json({ success: true, message: 'Offer updated successfully!', offer: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update offer' });
  }
});

// DELETE offer (Admin)
router.delete('/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const db = getDb();
    const index = db.offers.findIndex(o => o.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'Offer not found' });
      return;
    }

    db.offers.splice(index, 1);
    saveDb(db);

    res.json({ success: true, message: 'Offer removed successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete offer' });
  }
});

export default router;
