import bcrypt from 'bcryptjs';
import { Product, Offer, Order, CustomCakeRequest, User } from '../types.js';
import { getDb, saveDb } from '../config/database.js';

export async function seedDatabase(force: boolean = false): Promise<void> {
  const db = getDb();

  if (!force && db.products && db.products.length > 0) {
    console.log('Database already contains products. Skipping seed.');
    return;
  }

  console.log('Seeding bakery database with PON CAFE / Rukmani Bakery data...');

  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const customerPasswordHash = await bcrypt.hash('customer123', 10);

  const users: User[] = [
    {
      id: 'usr-admin-1',
      name: 'Rukmani',
      email: 'admin@poncafe.com',
      phone: '6374123265',
      password: adminPasswordHash,
      role: 'admin',
      address: 'Kangeayam Road, Chennimalai, Erode – 638051',
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 'usr-cust-1',
      name: 'Karthik Raja',
      email: 'customer@example.com',
      phone: '9876543210',
      password: customerPasswordHash,
      role: 'customer',
      address: 'No. 14, Gandhi Street, Chennimalai, Erode - 638051',
      createdAt: '2026-02-01T10:30:00.000Z'
    }
  ];

  const products: Product[] = [
    // --- CAKES ---
    {
      id: 'prod-cake-1',
      name: 'Chocolate Cake',
      category: 'Cakes',
      description: 'Decadent Dutch chocolate sponge layered with smooth chocolate ganache and crowned with artisanal chocolate curls.',
      price: 550,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
      stock: 12,
      availability: 'available',
      featured: true,
      isNew: false,
      unit: '1 kg',
      weightOptions: ['0.5 kg (₹300)', '1 kg (₹550)', '2 kg (₹1050)'],
      ingredients: ['Dark Cocoa', 'Pure Butter', 'Fresh Cream', 'Belgian Chocolate Curls', 'Vanilla Extract'],
      allergens: ['Milk / Dairy', 'Gluten / Wheat', 'Soy'],
      rating: 4.9,
      reviewCount: 48,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod-cake-2',
      name: 'Black Forest Cake',
      category: 'Cakes',
      description: 'Classic German-style chocolate sponge soaked with cherry syrup, whipped vanilla cream, and imported sour cherries.',
      price: 600,
      image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80',
      stock: 8,
      availability: 'available',
      featured: true,
      isNew: false,
      unit: '1 kg',
      weightOptions: ['0.5 kg (₹320)', '1 kg (₹600)', '2 kg (₹1150)'],
      ingredients: ['Cocoa Sponge', 'Maraschino Cherries', 'Fresh Whipped Cream', 'Chocolate Flakes'],
      allergens: ['Milk / Dairy', 'Gluten / Wheat'],
      rating: 4.8,
      reviewCount: 36,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod-cake-3',
      name: 'White Forest Cake',
      category: 'Cakes',
      description: 'Delicate vanilla sponge dressed with velvety white chocolate shavings, sweet cherries, and light fresh cream.',
      price: 650,
      image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80',
      stock: 5,
      availability: 'limited',
      featured: false,
      isNew: true,
      unit: '1 kg',
      weightOptions: ['0.5 kg (₹350)', '1 kg (₹650)', '2 kg (₹1250)'],
      ingredients: ['White Chocolate', 'Vanilla Sponge', 'Sweet Cherries', 'Dairy Cream'],
      allergens: ['Milk / Dairy', 'Gluten / Wheat'],
      rating: 4.7,
      reviewCount: 22,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod-cake-4',
      name: 'Red Velvet Cake',
      category: 'Cakes',
      description: 'Velvety crimson sponge with a hint of cocoa, frosted with our signature smooth cream cheese frosting.',
      price: 750,
      image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=800&q=80',
      stock: 10,
      availability: 'available',
      featured: true,
      isNew: false,
      unit: '1 kg',
      weightOptions: ['0.5 kg (₹400)', '1 kg (₹750)', '2 kg (₹1400)'],
      ingredients: ['Cocoa', 'Buttermilk', 'Cream Cheese', 'Vanilla Bean', 'Red Velvet Crumb'],
      allergens: ['Milk / Dairy', 'Gluten / Wheat'],
      rating: 4.9,
      reviewCount: 54,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod-cake-5',
      name: 'Butterscotch Cake',
      category: 'Cakes',
      description: 'Moist golden sponge layered with house-made butterscotch caramel crunch and smooth praline cream.',
      price: 580,
      image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
      stock: 14,
      availability: 'available',
      featured: false,
      isNew: false,
      unit: '1 kg',
      weightOptions: ['0.5 kg (₹300)', '1 kg (₹580)', '2 kg (₹1100)'],
      ingredients: ['Butterscotch Praline', 'Caramel Drizzle', 'Vanilla Sponge', 'Whipped Cream'],
      allergens: ['Milk / Dairy', 'Gluten / Wheat', 'Nuts (Praline)'],
      rating: 4.8,
      reviewCount: 29,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod-cake-6',
      name: 'Vanilla Cake',
      category: 'Cakes',
      description: 'Timeless light and fluffy sponge cake infused with pure Madagascar vanilla extract and delicate buttercream.',
      price: 450,
      image: 'https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=800&q=80',
      stock: 15,
      availability: 'available',
      featured: false,
      isNew: false,
      unit: '1 kg',
      weightOptions: ['0.5 kg (₹240)', '1 kg (₹450)', '2 kg (₹850)'],
      ingredients: ['Pure Vanilla Bean', 'Farm Fresh Milk', 'Refined Flour', 'Buttercream'],
      allergens: ['Milk / Dairy', 'Gluten / Wheat'],
      rating: 4.6,
      reviewCount: 19,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod-cake-7',
      name: 'Birthday Cake',
      category: 'Cakes',
      description: 'Custom celebration birthday cake adorned with colorful sprinkles, chocolate drips, festive toppers, and personalized lettering.',
      price: 800,
      image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
      stock: 6,
      availability: 'available',
      featured: true,
      isNew: true,
      unit: '1 kg',
      weightOptions: ['1 kg (₹800)', '2 kg (₹1500)', '3 kg (₹2200)'],
      ingredients: ['Custom Flavors', 'Fondant Accents', 'Gourmet Chocolate', 'Sprinkles'],
      allergens: ['Milk / Dairy', 'Gluten / Wheat'],
      rating: 5.0,
      reviewCount: 62,
      createdAt: new Date().toISOString()
    },

    // --- SNACKS ---
    {
      id: 'prod-snack-1',
      name: 'Puffs',
      category: 'Snacks',
      description: 'Golden, ultra-crispy multi-layered puff pastry baked to perfection with aromatic local herbs and spices.',
      price: 20,
      image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80',
      stock: 45,
      availability: 'available',
      featured: true,
      isNew: false,
      unit: '1 pc',
      ingredients: ['Puff Pastry', 'Special Bakery Masala', 'Butter', 'Herbs'],
      allergens: ['Gluten / Wheat'],
      rating: 4.8,
      reviewCount: 88,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod-snack-2',
      name: 'Samosa',
      category: 'Snacks',
      description: 'Crispy golden triangular pastry stuffed with a savory filling of spiced potatoes, green peas, and fresh coriander.',
      price: 15,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
      stock: 50,
      availability: 'available',
      featured: true,
      isNew: false,
      unit: '1 pc',
      ingredients: ['Potatoes', 'Green Peas', 'Garam Masala', 'Crispy Pastry Shell'],
      allergens: ['Gluten / Wheat'],
      rating: 4.9,
      reviewCount: 110,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod-snack-3',
      name: 'Veg Puff',
      category: 'Snacks',
      description: 'Freshly baked flaky pastry stuffed with sauteed carrots, cabbage, potatoes, and signature Chennimalai spices.',
      price: 25,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      stock: 35,
      availability: 'available',
      featured: false,
      isNew: false,
      unit: '1 pc',
      ingredients: ['Carrot', 'Potato', 'Beans', 'Flaky Dough', 'Aromatic Spices'],
      allergens: ['Gluten / Wheat'],
      rating: 4.7,
      reviewCount: 45,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod-snack-4',
      name: 'Egg Puff',
      category: 'Snacks',
      description: 'Flaky buttery puff pastry filled with hard-boiled egg half and savory pepper onion masala gravy.',
      price: 30,
      image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80',
      stock: 30,
      availability: 'available',
      featured: true,
      isNew: false,
      unit: '1 pc',
      ingredients: ['Farm Fresh Egg', 'Caramelized Onions', 'Black Pepper', 'Crispy Puff Sheet'],
      allergens: ['Egg', 'Gluten / Wheat'],
      rating: 4.9,
      reviewCount: 73,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod-snack-5',
      name: 'Chicken Puff',
      category: 'Snacks',
      description: 'Succulent minced chicken slow-cooked with roasted spices, encased inside golden flaky puff pastry.',
      price: 40,
      image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80',
      stock: 25,
      availability: 'available',
      featured: true,
      isNew: false,
      unit: '1 pc',
      ingredients: ['Tender Chicken', 'South Indian Masala', 'Ginger Garlic', 'Flaky Crust'],
      allergens: ['Gluten / Wheat'],
      rating: 4.9,
      reviewCount: 92,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod-snack-6',
      name: 'Sandwich',
      category: 'Snacks',
      description: 'Double-layered grilled sandwich packed with sliced cucumber, tomato, paneer cheese, and mint chutney.',
      price: 50,
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
      stock: 20,
      availability: 'available',
      featured: false,
      isNew: true,
      unit: '1 plate',
      ingredients: ['Bakery Fresh Bread', 'Cheddar/Paneer Cheese', 'Mint Chutney', 'Cucumber & Tomato'],
      allergens: ['Milk / Dairy', 'Gluten / Wheat'],
      rating: 4.6,
      reviewCount: 31,
      createdAt: new Date().toISOString()
    },

    // --- BREADS ---
    {
      id: 'prod-bread-1',
      name: 'Bread',
      category: 'Breads',
      description: 'Freshly baked soft white milk bread loaf. Prepared daily every morning without preservatives.',
      price: 40,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      stock: 40,
      availability: 'available',
      featured: false,
      isNew: false,
      unit: '400g Loaf',
      ingredients: ['Wheat Flour', 'Fresh Milk', 'Active Yeast', 'Pure Butter', 'Pinch of Sea Salt'],
      allergens: ['Milk / Dairy', 'Gluten / Wheat'],
      rating: 4.9,
      reviewCount: 67,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod-bread-2',
      name: 'Bun',
      category: 'Breads',
      description: 'Traditional pillowy soft round bakery bun, lightly glazed with butter. Ideal for tea-time dipping.',
      price: 15,
      image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80',
      stock: 50,
      availability: 'available',
      featured: false,
      isNew: false,
      unit: 'Pack of 2',
      ingredients: ['Refined Flour', 'Butter Glaze', 'Yeast', 'Cardamom Essence'],
      allergens: ['Milk / Dairy', 'Gluten / Wheat'],
      rating: 4.7,
      reviewCount: 38,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod-bread-3',
      name: 'Sweet Bun',
      category: 'Breads',
      description: 'Soft sweet bread rolls embedded with sweetened tutti-frutti, desiccated coconut, and candied cherries.',
      price: 20,
      image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80',
      stock: 35,
      availability: 'available',
      featured: false,
      isNew: false,
      unit: 'Pack of 2',
      ingredients: ['Tutti Frutti', 'Sweet Coconut', 'Flour', 'Sugar Syrup Glaze'],
      allergens: ['Gluten / Wheat'],
      rating: 4.8,
      reviewCount: 42,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod-bread-4',
      name: 'Cream Bun',
      category: 'Breads',
      description: 'Soft golden bun split in the center and filled with luscious sweet vanilla cream and a cherry on top.',
      price: 25,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      stock: 25,
      availability: 'available',
      featured: true,
      isNew: false,
      unit: '1 pc',
      ingredients: ['Vanilla Dairy Cream', 'Soft Bun', 'Icing Sugar', 'Red Cherry'],
      allergens: ['Milk / Dairy', 'Gluten / Wheat'],
      rating: 4.9,
      reviewCount: 78,
      createdAt: new Date().toISOString()
    },

    // --- COOKIES ---
    {
      id: 'prod-cookie-1',
      name: 'Butter Cookies',
      category: 'Cookies',
      description: 'Melt-in-your-mouth Danish-style cookies made with 100% pure churned butter and gentle vanilla aroma.',
      price: 120,
      image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80',
      stock: 30,
      availability: 'available',
      featured: true,
      isNew: false,
      unit: '250g Box',
      ingredients: ['Pure Creamery Butter', 'Fine Flour', 'Cane Sugar', 'Vanilla'],
      allergens: ['Milk / Dairy', 'Gluten / Wheat'],
      rating: 4.9,
      reviewCount: 56,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod-cookie-2',
      name: 'Chocolate Cookies',
      category: 'Cookies',
      description: 'Rich dark chocolate cookies loaded with semi-sweet chocolate chips and crunchy roasted almonds.',
      price: 140,
      image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80',
      stock: 25,
      availability: 'available',
      featured: true,
      isNew: false,
      unit: '250g Box',
      ingredients: ['Dark Cocoa', 'Choco Chips', 'Butter', 'Toasted Almonds'],
      allergens: ['Milk / Dairy', 'Gluten / Wheat', 'Nuts (Almond)'],
      rating: 4.8,
      reviewCount: 47,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod-cookie-3',
      name: 'Coconut Cookies',
      category: 'Cookies',
      description: 'Crispy golden biscuits generously coated with freshly grated toasted coconut for an irresistible tropical crunch.',
      price: 130,
      image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80',
      stock: 20,
      availability: 'available',
      featured: false,
      isNew: false,
      unit: '250g Box',
      ingredients: ['Toasted Coconut Flakes', 'Pure Butter', 'Cardamom', 'Raw Sugar'],
      allergens: ['Milk / Dairy', 'Gluten / Wheat'],
      rating: 4.7,
      reviewCount: 39,
      createdAt: new Date().toISOString()
    },

    // --- BEVERAGES ---
    {
      id: 'prod-bev-1',
      name: 'Tea',
      category: 'Beverages',
      description: 'Authentic Indian hot masala chai brewed with freshly crushed cardamom, ginger, and full-cream milk.',
      price: 20,
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      stock: 100,
      availability: 'available',
      featured: true,
      isNew: false,
      unit: '1 Cup (150ml)',
      ingredients: ['Nilgiri Tea Leaves', 'Green Cardamom', 'Ginger', 'Full Cream Milk'],
      allergens: ['Milk / Dairy'],
      rating: 4.9,
      reviewCount: 130,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod-bev-2',
      name: 'Coffee',
      category: 'Beverages',
      description: 'Traditional South Indian frothy filter coffee brewed from roasted chicory blend and hot foaming milk.',
      price: 30,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      stock: 100,
      availability: 'available',
      featured: true,
      isNew: false,
      unit: '1 Cup (150ml)',
      ingredients: ['South Indian Coffee Decoction', 'Frothy Fresh Milk', 'Raw Sugar'],
      allergens: ['Milk / Dairy'],
      rating: 5.0,
      reviewCount: 142,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod-bev-3',
      name: 'Fresh Juice',
      category: 'Beverages',
      description: '100% natural cold-pressed fruit juice made from fresh seasonal oranges, pomegranate, or sweet lime.',
      price: 60,
      image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',
      stock: 40,
      availability: 'available',
      featured: false,
      isNew: true,
      unit: '300ml Glass',
      ingredients: ['Fresh Seasonal Fruits', 'Mint', 'Touch of Rock Salt'],
      allergens: [],
      rating: 4.8,
      reviewCount: 44,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prod-bev-4',
      name: 'Milkshake',
      category: 'Beverages',
      description: 'Rich and creamy thickshake blended with whole milk, vanilla bean ice cream, and chocolate fudge drizzle.',
      price: 90,
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
      stock: 30,
      availability: 'available',
      featured: true,
      isNew: false,
      unit: '350ml Glass',
      ingredients: ['Rich Dairy Ice Cream', 'Chilled Milk', 'Cocoa Fudge Sauce'],
      allergens: ['Milk / Dairy'],
      rating: 4.9,
      reviewCount: 65,
      createdAt: new Date().toISOString()
    }
  ];

  const offers: Offer[] = [
    {
      id: 'off-1',
      title: 'Welcome Treat',
      code: 'FRESH10',
      description: 'Get 10% OFF on all bakery orders above ₹200. Valid for both pickup and delivery.',
      discountType: 'percentage',
      discountValue: 10,
      minOrderValue: 200,
      maxDiscount: 100,
      expiryDate: '2026-12-31T23:59:59.000Z',
      active: true,
      badgeText: '10% OFF'
    },
    {
      id: 'off-2',
      title: 'Celebration Cakes Discount',
      code: 'WEEKEND20',
      description: 'Flat 20% discount on all artisan Cakes with order value above ₹600.',
      discountType: 'percentage',
      discountValue: 20,
      minOrderValue: 600,
      maxDiscount: 200,
      categoryLimit: 'Cakes',
      expiryDate: '2026-12-31T23:59:59.000Z',
      active: true,
      badgeText: '20% OFF CAKES'
    },
    {
      id: 'off-3',
      title: 'Snack Combo Offer',
      code: 'COMBO50',
      description: 'Flat ₹50 OFF on any bakery order above ₹300 containing snacks and beverages.',
      discountType: 'flat',
      discountValue: 50,
      minOrderValue: 300,
      expiryDate: '2026-12-31T23:59:59.000Z',
      active: true,
      badgeText: '₹50 FLAT OFF'
    },
    {
      id: 'off-4',
      title: 'Chennimalai Special Treat',
      code: 'RUKMANI5',
      description: 'Special 5% discount for all local Chennimalai town orders with no minimum order restriction.',
      discountType: 'percentage',
      discountValue: 5,
      minOrderValue: 50,
      maxDiscount: 50,
      expiryDate: '2026-12-31T23:59:59.000Z',
      active: true,
      badgeText: 'LOCAL SPECIAL'
    }
  ];

  const sampleOrders: Order[] = [
    {
      id: 'PON-84921',
      userId: 'usr-cust-1',
      customerName: 'Karthik Raja',
      phone: '9876543210',
      email: 'customer@example.com',
      deliveryType: 'delivery',
      address: 'No. 14, Gandhi Street, Chennimalai',
      landmark: 'Near Murugan Temple',
      pincode: '638051',
      preferredDate: '2026-08-26',
      preferredTime: '05:00 PM - 06:00 PM',
      notes: 'Please add birthday candle and napkins.',
      items: [
        {
          productId: 'prod-cake-4',
          name: 'Red Velvet Cake',
          category: 'Cakes',
          price: 750,
          quantity: 1,
          subtotal: 750,
          image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=800&q=80',
          selectedWeight: '1 kg'
        },
        {
          productId: 'prod-snack-5',
          name: 'Chicken Puff',
          category: 'Snacks',
          price: 40,
          quantity: 2,
          subtotal: 80,
          image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80'
        }
      ],
      subtotal: 830,
      deliveryCharge: 0,
      discount: 83,
      couponCode: 'FRESH10',
      totalAmount: 747,
      paymentMethod: 'upi',
      paymentStatus: 'paid',
      status: 'Preparing',
      statusHistory: [
        { status: 'Order Placed', timestamp: '2026-08-25T14:30:00.000Z', note: 'Order received online' },
        { status: 'Order Confirmed', timestamp: '2026-08-25T14:35:00.000Z', note: 'Confirmed by Rukmani' },
        { status: 'Preparing', timestamp: '2026-08-25T15:00:00.000Z', note: 'Chef is baking fresh cake' }
      ],
      createdAt: '2026-08-25T14:30:00.000Z',
      updatedAt: '2026-08-25T15:00:00.000Z'
    },
    {
      id: 'PON-84920',
      userId: 'usr-cust-1',
      customerName: 'Karthik Raja',
      phone: '9876543210',
      email: 'customer@example.com',
      deliveryType: 'pickup',
      preferredDate: '2026-08-24',
      preferredTime: '10:00 AM - 11:00 AM',
      items: [
        {
          productId: 'prod-snack-4',
          name: 'Egg Puff',
          category: 'Snacks',
          price: 30,
          quantity: 4,
          subtotal: 120,
          image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80'
        },
        {
          productId: 'prod-bev-2',
          name: 'Coffee',
          category: 'Beverages',
          price: 30,
          quantity: 2,
          subtotal: 60,
          image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
        }
      ],
      subtotal: 180,
      deliveryCharge: 0,
      discount: 0,
      totalAmount: 180,
      paymentMethod: 'cod',
      paymentStatus: 'paid',
      status: 'Completed',
      statusHistory: [
        { status: 'Order Placed', timestamp: '2026-08-24T09:00:00.000Z' },
        { status: 'Order Confirmed', timestamp: '2026-08-24T09:10:00.000Z' },
        { status: 'Preparing', timestamp: '2026-08-24T09:20:00.000Z' },
        { status: 'Ready for Pickup', timestamp: '2026-08-24T09:45:00.000Z' },
        { status: 'Completed', timestamp: '2026-08-24T10:15:00.000Z', note: 'Customer collected from store' }
      ],
      createdAt: '2026-08-24T09:00:00.000Z',
      updatedAt: '2026-08-24T10:15:00.000Z'
    }
  ];

  const sampleCakeRequests: CustomCakeRequest[] = [
    {
      id: 'CAKE-9102',
      userId: 'usr-cust-1',
      customerName: 'Priya Sundaram',
      phone: '9842176543',
      email: 'priya.s@gmail.com',
      cakeType: '2-Tier Fondant Cake',
      size: '2 kg',
      flavor: 'Chocolate Truffle & Red Velvet',
      theme: 'Floral & Gold Butterfly',
      color: 'Pastel Pink & Gold Accents',
      cakeMessage: 'Happy 25th Silver Jubilee Amma & Appa',
      referenceImage: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
      requiredDate: '2026-08-28',
      requiredTime: '06:00 PM',
      requirements: 'Eggless cake required with delicate edible sugar flowers.',
      status: 'Accepted',
      estimatedPrice: 2400,
      adminNotes: 'Confirmed with customer via call. Premium edible gold foil included.',
      createdAt: '2026-08-24T16:00:00.000Z',
      updatedAt: '2026-08-25T09:30:00.000Z'
    }
  ];

  saveDb({
    users,
    products,
    orders: sampleOrders,
    customCakes: sampleCakeRequests,
    offers
  });

  console.log('Database successfully seeded with 24 items, offers, and admin account.');
}

// Self-run when executed directly via npm run seed
if (process.argv[1]?.endsWith('seedData.ts') || process.argv[1]?.endsWith('seedData.js')) {
  seedDatabase(true).then(() => {
    console.log('Seed command completed.');
    process.exit(0);
  });
}
