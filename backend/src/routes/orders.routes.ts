import { Router, Request, Response } from 'express';
import { getDb, saveDb } from '../config/database.js';
import { authenticateToken, requireAdmin, optionalAuth, AuthRequest } from '../middleware/auth.js';
import { Order, OrderStatus, OrderItem, PaymentMethod, DeliveryType } from '../types.js';

const router = Router();

// Helper to generate readable Bakery Order ID: e.g. PON-84923
function generateOrderId(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `PON-${randomNum}`;
}

// POST create new order (Guest or Authenticated)
router.post('/', optionalAuth, (req: AuthRequest, res: Response): void => {
  try {
    const {
      customerName,
      phone,
      email,
      deliveryType,
      address,
      landmark,
      pincode,
      preferredDate,
      preferredTime,
      notes,
      items,
      paymentMethod,
      couponCode
    } = req.body;

    if (!customerName || !phone || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: 'Customer name, phone number, and cart items are required.' });
      return;
    }

    if (!preferredDate || !preferredTime) {
      res.status(400).json({ success: false, message: 'Preferred date and time slot must be selected.' });
      return;
    }

    if (deliveryType === 'delivery' && !address) {
      res.status(400).json({ success: false, message: 'Delivery address is required for home delivery orders.' });
      return;
    }

    const db = getDb();

    // Verify and calculate item prices from active product catalog to prevent price tampering
    let calculatedSubtotal = 0;
    const verifiedItems: OrderItem[] = [];

    for (const item of items) {
      const product = db.products.find(p => p.id === item.productId);
      if (!product) {
        res.status(400).json({ success: false, message: `Product '${item.name || item.productId}' is no longer available.` });
        return;
      }

      if (product.availability === 'out_of_stock' || product.stock <= 0) {
        res.status(400).json({ success: false, message: `'${product.name}' is currently out of stock.` });
        return;
      }

      const qty = Math.max(1, Number(item.quantity) || 1);
      const itemSubtotal = product.price * qty;
      calculatedSubtotal += itemSubtotal;

      verifiedItems.push({
        productId: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: qty,
        subtotal: itemSubtotal,
        image: product.image,
        selectedWeight: item.selectedWeight
      });

      // Deduct inventory
      product.stock = Math.max(0, product.stock - qty);
      if (product.stock === 0) product.availability = 'out_of_stock';
      else if (product.stock <= 5) product.availability = 'limited';
    }

    // Delivery charge calculation
    // Free delivery for orders over ₹500, otherwise ₹30
    let deliveryCharge = 0;
    if (deliveryType === 'delivery') {
      deliveryCharge = calculatedSubtotal >= 500 ? 0 : 30;
    }

    // Calculate coupon discount
    let discount = 0;
    let validCouponCode = undefined;
    if (couponCode) {
      const cleanCode = couponCode.trim().toUpperCase();
      const offer = db.offers.find(o => o.code.toUpperCase() === cleanCode && o.active);
      if (offer && calculatedSubtotal >= offer.minOrderValue) {
        validCouponCode = offer.code;
        if (offer.discountType === 'percentage') {
          const rawDiscount = (calculatedSubtotal * offer.discountValue) / 100;
          discount = offer.maxDiscount ? Math.min(rawDiscount, offer.maxDiscount) : rawDiscount;
        } else {
          discount = offer.discountValue;
        }
      }
    }

    const finalTotal = Math.max(0, calculatedSubtotal + deliveryCharge - discount);
    const orderId = generateOrderId();
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: orderId,
      userId: req.user?.id || undefined,
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email?.trim() || '',
      deliveryType: (deliveryType as DeliveryType) || 'pickup',
      address: address?.trim(),
      landmark: landmark?.trim(),
      pincode: pincode?.trim() || '638051',
      preferredDate,
      preferredTime,
      notes: notes?.trim() || '',
      items: verifiedItems,
      subtotal: calculatedSubtotal,
      deliveryCharge,
      discount,
      couponCode: validCouponCode,
      totalAmount: finalTotal,
      paymentMethod: (paymentMethod as PaymentMethod) || 'cod',
      paymentStatus: paymentMethod === 'upi' ? 'paid' : 'pending',
      status: 'Order Placed',
      statusHistory: [
        {
          status: 'Order Placed',
          timestamp: now,
          note: `Order placed online via ${deliveryType === 'delivery' ? 'Home Delivery' : 'Store Pickup'}`
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    db.orders.unshift(newOrder);
    saveDb(db);

    res.status(201).json({
      success: true,
      message: 'Your order has been placed successfully!',
      order: newOrder
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ success: false, message: 'Failed to place order. Please try again.' });
  }
});

// GET track order by Order ID or Phone number
router.get('/track/:query', (req: Request, res: Response): void => {
  try {
    const { query } = req.params;
    const cleanQuery = query.trim().toUpperCase();
    const db = getDb();

    // Look by Order ID or customer phone
    const order = db.orders.find(
      o => o.id.toUpperCase() === cleanQuery || o.phone === query.trim()
    );

    if (!order) {
      res.status(404).json({ success: false, message: `No order found with ID or phone number '${query}'.` });
      return;
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error('Error tracking order:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve order tracking information.' });
  }
});

// GET customer orders
router.get('/my-orders', authenticateToken, (req: AuthRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const db = getDb();
    const userOrders = db.orders.filter(
      o => o.userId === req.user?.id || o.email.toLowerCase() === req.user?.email.toLowerCase() || o.phone === req.user?.phone
    );

    res.json({ success: true, orders: userOrders });
  } catch (err) {
    console.error('Error getting user orders:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve your orders.' });
  }
});

// GET all orders (Admin only)
router.get('/', authenticateToken, requireAdmin, (req: AuthRequest, res: Response): void => {
  try {
    const { status, deliveryType, search } = req.query;
    const db = getDb();
    let results = [...db.orders];

    if (status && status !== 'All') {
      results = results.filter(o => o.status === status);
    }
    if (deliveryType && deliveryType !== 'All') {
      results = results.filter(o => o.deliveryType === deliveryType);
    }
    if (search) {
      const q = (search as string).toLowerCase().trim();
      results = results.filter(
        o =>
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.phone.includes(q)
      );
    }

    res.json({ success: true, count: results.length, orders: results });
  } catch (err) {
    console.error('Error fetching admin orders:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve orders.' });
  }
});

// PATCH update order status (Admin only)
router.patch('/:id/status', authenticateToken, requireAdmin, (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { status, note } = req.body as { status: OrderStatus; note?: string };
    const db = getDb();
    const order = db.orders.find(o => o.id === id);

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    const validStatuses: OrderStatus[] = [
      'Order Placed',
      'Order Confirmed',
      'Preparing',
      'Ready for Pickup',
      'Out for Delivery',
      'Completed',
      'Cancelled'
    ];

    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: `Invalid status '${status}'.` });
      return;
    }

    const now = new Date().toISOString();
    order.status = status;
    order.updatedAt = now;

    if (status === 'Completed') {
      order.paymentStatus = 'paid';
    }

    order.statusHistory.push({
      status,
      timestamp: now,
      note: note || `Status updated to ${status} by Rukmani`
    });

    saveDb(db);
    res.json({ success: true, message: `Order status updated to '${status}'.`, order });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
});

export default router;
