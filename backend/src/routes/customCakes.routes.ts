import { Router, Request, Response } from 'express';
import { getDb, saveDb } from '../config/database.js';
import { authenticateToken, requireAdmin, optionalAuth, AuthRequest } from '../middleware/auth.js';
import { CustomCakeRequest, CakeRequestStatus } from '../types.js';

const router = Router();

function generateCakeRequestId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `CAKE-${randomNum}`;
}

// POST submit custom cake request
router.post('/', optionalAuth, (req: AuthRequest, res: Response): void => {
  try {
    const {
      customerName,
      phone,
      email,
      cakeType,
      size,
      flavor,
      theme,
      color,
      cakeMessage,
      referenceImage,
      requiredDate,
      requiredTime,
      requirements
    } = req.body;

    if (!customerName || !phone || !cakeType || !size || !flavor || !requiredDate || !requiredTime) {
      res.status(400).json({
        success: false,
        message: 'Name, phone, cake type, weight/size, flavor, required date and time are required.'
      });
      return;
    }

    const db = getDb();
    const requestId = generateCakeRequestId();
    const now = new Date().toISOString();

    const newRequest: CustomCakeRequest = {
      id: requestId,
      userId: req.user?.id || undefined,
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email?.trim() || '',
      cakeType: cakeType.trim(),
      size: size.trim(),
      flavor: flavor.trim(),
      theme: theme?.trim() || 'Custom Artisan Theme',
      color: color?.trim() || 'Bakery Choice / Matching Theme',
      cakeMessage: cakeMessage?.trim() || '',
      referenceImage: referenceImage || '',
      requiredDate,
      requiredTime,
      requirements: requirements?.trim() || '',
      status: 'New',
      createdAt: now,
      updatedAt: now
    };

    db.customCakes.unshift(newRequest);
    saveDb(db);

    res.status(201).json({
      success: true,
      message: 'Your custom cake request has been submitted successfully.',
      requestId: newRequest.id,
      request: newRequest
    });
  } catch (err) {
    console.error('Error submitting cake request:', err);
    res.status(500).json({ success: false, message: 'Failed to submit custom cake booking.' });
  }
});

// GET track custom cake request by ID or Phone
router.get('/track/:query', (req: Request, res: Response): void => {
  try {
    const { query } = req.params;
    const cleanQuery = query.trim().toUpperCase();
    const db = getDb();

    const request = db.customCakes.find(
      c => c.id.toUpperCase() === cleanQuery || c.phone === query.trim()
    );

    if (!request) {
      res.status(404).json({ success: false, message: `No custom cake request found for '${query}'.` });
      return;
    }

    res.json({ success: true, request });
  } catch (err) {
    console.error('Error tracking cake request:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve cake booking status.' });
  }
});

// GET customer's cake requests
router.get('/my-requests', authenticateToken, (req: AuthRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const db = getDb();
    const userRequests = db.customCakes.filter(
      c => c.userId === req.user?.id || c.email.toLowerCase() === req.user?.email.toLowerCase() || c.phone === req.user?.phone
    );

    res.json({ success: true, requests: userRequests });
  } catch (err) {
    console.error('Error fetching user cake requests:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve your cake bookings.' });
  }
});

// GET all cake requests (Admin only)
router.get('/', authenticateToken, requireAdmin, (req: AuthRequest, res: Response): void => {
  try {
    const { status, search } = req.query;
    const db = getDb();
    let results = [...db.customCakes];

    if (status && status !== 'All') {
      results = results.filter(c => c.status === status);
    }
    if (search) {
      const q = (search as string).toLowerCase().trim();
      results = results.filter(
        c =>
          c.id.toLowerCase().includes(q) ||
          c.customerName.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.flavor.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: results.length, requests: results });
  } catch (err) {
    console.error('Error fetching admin cake requests:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve cake requests.' });
  }
});

// PATCH update cake request status & quote (Admin only)
router.patch('/:id/status', authenticateToken, requireAdmin, (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { status, estimatedPrice, adminNotes } = req.body as {
      status: CakeRequestStatus;
      estimatedPrice?: number;
      adminNotes?: string;
    };

    const db = getDb();
    const request = db.customCakes.find(c => c.id === id);

    if (!request) {
      res.status(404).json({ success: false, message: 'Custom cake request not found' });
      return;
    }

    if (status) request.status = status;
    if (estimatedPrice !== undefined) request.estimatedPrice = Number(estimatedPrice);
    if (adminNotes !== undefined) request.adminNotes = adminNotes;
    request.updatedAt = new Date().toISOString();

    saveDb(db);

    res.json({ success: true, message: `Cake request '${request.id}' status updated to '${request.status}'!`, request });
  } catch (err) {
    console.error('Error updating cake request:', err);
    res.status(500).json({ success: false, message: 'Failed to update cake request' });
  }
});

export default router;
