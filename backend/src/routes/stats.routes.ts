import { Router, Response } from 'express';
import { getDb } from '../config/database.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET admin dashboard KPIs & stats
router.get('/admin', authenticateToken, requireAdmin, (_req: AuthRequest, res: Response): void => {
  try {
    const db = getDb();
    const orders = db.orders || [];
    const products = db.products || [];
    const customCakes = db.customCakes || [];

    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'Completed').length;
    const pendingOrders = orders.filter(
      o => o.status === 'Order Placed' || o.status === 'Order Confirmed' || o.status === 'Preparing' || o.status === 'Ready for Pickup' || o.status === 'Out for Delivery'
    ).length;
    const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;

    const totalRevenue = orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const totalProducts = products.length;
    const outOfStockProducts = products.filter(p => p.availability === 'out_of_stock' || p.stock <= 0).length;
    const limitedStockProducts = products.filter(p => p.availability === 'limited').length;

    const totalCakeRequests = customCakes.length;
    const newCakeRequests = customCakes.filter(c => c.status === 'New').length;

    // Category breakdown
    const categoryStats: Record<string, { count: number; totalSold: number }> = {
      Cakes: { count: 0, totalSold: 0 },
      Snacks: { count: 0, totalSold: 0 },
      Breads: { count: 0, totalSold: 0 },
      Cookies: { count: 0, totalSold: 0 },
      Beverages: { count: 0, totalSold: 0 }
    };

    products.forEach(p => {
      if (categoryStats[p.category]) {
        categoryStats[p.category].count += 1;
      }
    });

    orders.forEach(o => {
      if (o.status !== 'Cancelled') {
        o.items.forEach(item => {
          if (categoryStats[item.category]) {
            categoryStats[item.category].totalSold += item.quantity;
          }
        });
      }
    });

    const recentOrders = [...orders].slice(0, 6);

    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue,
        totalProducts,
        outOfStockProducts,
        limitedStockProducts,
        totalCakeRequests,
        newCakeRequests,
        categoryStats,
        recentOrders
      }
    });
  } catch (err) {
    console.error('Error computing admin statistics:', err);
    res.status(500).json({ success: false, message: 'Failed to compute store statistics' });
  }
});

export default router;
