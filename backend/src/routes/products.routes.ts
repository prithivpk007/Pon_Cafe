import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDb } from '../config/database.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth.js';
import { Product, ProductCategory, AvailabilityStatus } from '../types.js';

const router = Router();

// GET all products with filtering, search & sort
router.get('/', (req: Request, res: Response): void => {
  try {
    const { category, search, availability, featured, isNew, sort, minPrice, maxPrice } = req.query;
    const db = getDb();
    let results: Product[] = [...db.products];

    // Filter by Category
    if (category && category !== 'All') {
      results = results.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
    }

    // Filter by Availability
    if (availability && availability !== 'All') {
      results = results.filter(p => p.availability === availability);
    }

    // Filter by Featured / New
    if (featured === 'true') {
      results = results.filter(p => p.featured);
    }
    if (isNew === 'true') {
      results = results.filter(p => p.isNew);
    }

    // Filter by Price range
    if (minPrice) {
      const min = Number(minPrice);
      if (!isNaN(min)) results = results.filter(p => p.price >= min);
    }
    if (maxPrice) {
      const max = Number(maxPrice);
      if (!isNaN(max)) results = results.filter(p => p.price <= max);
    }

    // Search query in name, description, ingredients, category
    if (search) {
      const q = (search as string).toLowerCase().trim();
      results = results.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.ingredients?.some(i => i.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sort === 'price_asc') {
      results.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      results.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'newest') {
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      // Default: featured first, then name
      results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    res.json({
      success: true,
      count: results.length,
      products: results
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve products' });
  }
});

// GET single product by ID
router.get('/:id', (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const db = getDb();
    const product = db.products.find(p => p.id === id);

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.json({ success: true, product });
  } catch (err) {
    console.error('Error fetching product details:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve product details' });
  }
});

// POST create product (Admin only)
router.post('/', authenticateToken, requireAdmin, (req: AuthRequest, res: Response): void => {
  try {
    const {
      name,
      category,
      description,
      price,
      image,
      stock,
      availability,
      featured,
      isNew,
      unit,
      weightOptions,
      ingredients,
      allergens
    } = req.body;

    if (!name || !category || !price) {
      res.status(400).json({ success: false, message: 'Product name, category, and price are required.' });
      return;
    }

    const db = getDb();
    const newProduct: Product = {
      id: `prod-${uuidv4().substring(0, 8)}`,
      name: name.trim(),
      category: category as ProductCategory,
      description: description?.trim() || '',
      price: Number(price),
      image: image || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      stock: Number(stock) || 10,
      availability: (availability as AvailabilityStatus) || 'available',
      featured: Boolean(featured),
      isNew: Boolean(isNew),
      unit: unit || '1 pc',
      weightOptions: Array.isArray(weightOptions) ? weightOptions : [],
      ingredients: Array.isArray(ingredients) ? ingredients : (ingredients ? ingredients.split(',').map((s: string) => s.trim()) : []),
      allergens: Array.isArray(allergens) ? allergens : (allergens ? allergens.split(',').map((s: string) => s.trim()) : []),
      rating: 4.8,
      reviewCount: 1,
      createdAt: new Date().toISOString()
    };

    db.products.unshift(newProduct);
    saveDb(db);

    res.status(201).json({ success: true, message: 'Product added successfully!', product: newProduct });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
});

// PUT update product (Admin only)
router.put('/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const db = getDb();
    const index = db.products.findIndex(p => p.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const existing = db.products[index];
    const updated: Product = {
      ...existing,
      ...req.body,
      id: existing.id, // Preserve ID
      price: req.body.price !== undefined ? Number(req.body.price) : existing.price,
      stock: req.body.stock !== undefined ? Number(req.body.stock) : existing.stock,
      updatedAt: new Date().toISOString()
    };

    // Auto-update availability based on stock
    if (updated.stock <= 0) {
      updated.availability = 'out_of_stock';
    } else if (updated.stock <= 5 && updated.availability === 'available') {
      updated.availability = 'limited';
    }

    db.products[index] = updated;
    saveDb(db);

    res.json({ success: true, message: 'Product updated successfully!', product: updated });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
});

// PATCH stock & availability (Admin only)
router.patch('/:id/stock', authenticateToken, requireAdmin, (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { stock, availability } = req.body;
    const db = getDb();
    const product = db.products.find(p => p.id === id);

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    if (stock !== undefined) product.stock = Number(stock);
    if (availability) product.availability = availability;
    product.updatedAt = new Date().toISOString();

    saveDb(db);
    res.json({ success: true, message: 'Stock updated', product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update stock' });
  }
});

// DELETE product (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const db = getDb();
    const index = db.products.findIndex(p => p.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const removed = db.products.splice(index, 1)[0];
    saveDb(db);

    res.json({ success: true, message: `Product '${removed.name}' removed successfully!` });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
});

export default router;
