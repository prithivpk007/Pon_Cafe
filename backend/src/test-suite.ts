// Comprehensive automated API verification script
async function runVerification() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('🚀 Starting PON CAFE Bakery automated verification test suite...\n');

  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`❌ FAIL: ${name} ->`, err.message);
      failed++;
    }
  }

  // 1. Health check
  await test('Health check returns bakery info', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    if (data.status !== 'healthy' || data.bakery.admin !== 'Rukmani' || data.bakery.phone !== '6374123265') {
      throw new Error(`Unexpected health payload: ${JSON.stringify(data)}`);
    }
  });

  // 2. Fetch products
  let chocolateCakeId = '';
  await test('Fetch products returns 24 bakery items with categories', async () => {
    const res = await fetch(`${BASE_URL}/products`);
    const data = await res.json();
    if (!data.success || data.products.length < 24) {
      throw new Error(`Expected at least 24 products, got ${data.products?.length}`);
    }
    const choco = data.products.find((p: any) => p.name.includes('Chocolate Cake'));
    if (!choco) throw new Error('Chocolate Cake not found in menu');
    chocolateCakeId = choco.id;
  });

  // 3. Category filter
  await test('Category filter returns only selected items', async () => {
    const res = await fetch(`${BASE_URL}/products?category=Snacks`);
    const data = await res.json();
    if (!data.success || data.products.some((p: any) => p.category !== 'Snacks')) {
      throw new Error('Category filter failed');
    }
  });

  // 4. Validate coupon code
  await test('Validate coupon code FRESH10 applies 10% discount', async () => {
    const res = await fetch(`${BASE_URL}/offers/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'FRESH10', cartTotal: 500 })
    });
    const data = await res.json();
    if (!data.success || data.discountAmount !== 50) {
      throw new Error(`Expected discount ₹50, got ${data.discountAmount}`);
    }
  });

  // 5. Customer Login
  let customerToken = '';
  await test('Customer Login with demo credentials', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'customer@example.com', password: 'customer123' })
    });
    const data = await res.json();
    if (!data.success || !data.token) {
      throw new Error(`Login failed: ${data.message}`);
    }
    customerToken = data.token;
  });

  // 6. Admin Login
  let adminToken = '';
  await test('Administrator (Rukmani) Login', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'admin@poncafe.com', password: 'admin123' })
    });
    const data = await res.json();
    if (!data.success || !data.token || data.user.role !== 'admin' || data.user.name !== 'Rukmani') {
      throw new Error(`Admin login failed: ${JSON.stringify(data)}`);
    }
    adminToken = data.token;
  });

  // 7. Place new order
  let createdOrderId = '';
  await test('Place customer order with coupon discount', async () => {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        customerName: 'Karthik Raja',
        phone: '9876543210',
        email: 'customer@example.com',
        deliveryType: 'delivery',
        address: 'No. 14, Gandhi Street, Chennimalai',
        landmark: 'Near Temple',
        pincode: '638051',
        preferredDate: '2026-08-27',
        preferredTime: '06:00 PM - 08:00 PM',
        notes: 'Please add 2 birthday candles and extra napkins.',
        paymentMethod: 'upi',
        couponCode: 'FRESH10',
        items: [
          {
            productId: chocolateCakeId,
            quantity: 1,
            selectedWeight: '1 kg'
          }
        ]
      })
    });
    const data = await res.json();
    if (!data.success || !data.order || !data.order.id.startsWith('PON-')) {
      throw new Error(`Order placement failed: ${JSON.stringify(data)}`);
    }
    createdOrderId = data.order.id;
    console.log(`   📦 Created Order: ${createdOrderId}, Total: ₹${data.order.totalAmount}`);
  });

  // 8. Track order
  await test(`Track order by Order ID '${createdOrderId}'`, async () => {
    const res = await fetch(`${BASE_URL}/orders/track/${createdOrderId}`);
    const data = await res.json();
    if (!data.success || data.order.id !== createdOrderId || data.order.status !== 'Order Placed') {
      throw new Error(`Order tracking failed: ${JSON.stringify(data)}`);
    }
  });

  // 9. Admin update order status progression
  await test(`Admin advances order status: Order Placed -> Preparing -> Out for Delivery -> Completed`, async () => {
    // Step 1: Confirmed
    let res = await fetch(`${BASE_URL}/orders/${createdOrderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'Order Confirmed', note: 'Order accepted by Rukmani' })
    });
    let data = await res.json();
    if (!data.success || data.order.status !== 'Order Confirmed') throw new Error('Failed to confirm order');

    // Step 2: Preparing
    res = await fetch(`${BASE_URL}/orders/${createdOrderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'Preparing', note: 'Chef is baking fresh chocolate sponge' })
    });
    data = await res.json();
    if (!data.success || data.order.status !== 'Preparing') throw new Error('Failed to mark preparing');

    // Step 3: Out for Delivery
    res = await fetch(`${BASE_URL}/orders/${createdOrderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'Out for Delivery', note: 'Delivery executive dispatched to Gandhi Street' })
    });
    data = await res.json();
    if (!data.success || data.order.status !== 'Out for Delivery') throw new Error('Failed to mark out for delivery');

    // Step 4: Completed
    res = await fetch(`${BASE_URL}/orders/${createdOrderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'Completed', note: 'Delivered to customer' })
    });
    data = await res.json();
    if (!data.success || data.order.status !== 'Completed') throw new Error('Failed to mark completed');
  });

  // 10. Custom Cake Booking Submission
  let cakeReqId = '';
  await test('Submit Custom Cake Booking request', async () => {
    const res = await fetch(`${BASE_URL}/custom-cakes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        customerName: 'Priya Sundaram',
        phone: '9842176543',
        email: 'priya.s@gmail.com',
        cakeType: 'Custom Themed Fondant Cake',
        size: '2 kg (14-16 Servings)',
        flavor: 'Royal Rasmalai & Pistachio',
        theme: 'Floral Elegance & Gold Foil',
        color: 'Pastel Pink & Gold Accents',
        cakeMessage: 'Happy 25th Silver Jubilee Amma & Appa',
        requiredDate: '2026-08-30',
        requiredTime: '06:00 PM',
        requirements: 'Eggless cake required with gold foil accents.'
      })
    });
    const data = await res.json();
    if (!data.success || !data.requestId || !data.requestId.startsWith('CAKE-')) {
      throw new Error(`Custom cake submission failed: ${JSON.stringify(data)}`);
    }
    cakeReqId = data.requestId;
    console.log(`   🎂 Created Custom Cake Booking: ${cakeReqId}`);
  });

  // 11. Admin Accept Cake Request with Price Quote
  await test(`Admin reviews and accepts Custom Cake Request '${cakeReqId}'`, async () => {
    const res = await fetch(`${BASE_URL}/custom-cakes/${cakeReqId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        status: 'Accepted',
        estimatedPrice: 2200,
        adminNotes: 'Confirmed with customer via call. Premium edible gold foil included.'
      })
    });
    const data = await res.json();
    if (!data.success || data.request.status !== 'Accepted' || data.request.estimatedPrice !== 2200) {
      throw new Error(`Failed to quote cake request: ${JSON.stringify(data)}`);
    }
  });

  // 12. Admin Dashboard Stats
  await test('Admin stats returns updated revenues and KPI counters', async () => {
    const res = await fetch(`${BASE_URL}/stats/admin`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (!data.success || data.stats.totalOrders < 2 || data.stats.totalRevenue <= 0) {
      throw new Error(`Invalid stats: ${JSON.stringify(data)}`);
    }
    console.log(`   📊 Total Revenue: ₹${data.stats.totalRevenue}, Total Orders: ${data.stats.totalOrders}`);
  });

  console.log(`\n=================================================`);
  console.log(`✨ TEST SUITE FINISHED: ${passed} PASSED, ${failed} FAILED`);
  console.log(`=================================================\n`);
}

runVerification();
