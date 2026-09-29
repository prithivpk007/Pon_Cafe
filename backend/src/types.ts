export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  address?: string;
  createdAt: string;
}

export type ProductCategory = 'Cakes' | 'Snacks' | 'Breads' | 'Cookies' | 'Beverages';
export type AvailabilityStatus = 'available' | 'limited' | 'out_of_stock';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  image: string;
  stock: number;
  availability: AvailabilityStatus;
  featured: boolean;
  isNew?: boolean;
  unit?: string;
  weightOptions?: string[];
  ingredients?: string[];
  allergens?: string[];
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  category: ProductCategory;
  price: number;
  quantity: number;
  subtotal: number;
  image: string;
  selectedWeight?: string;
}

export type OrderStatus =
  | 'Order Placed'
  | 'Order Confirmed'
  | 'Preparing'
  | 'Ready for Pickup'
  | 'Out for Delivery'
  | 'Completed'
  | 'Cancelled';

export type DeliveryType = 'delivery' | 'pickup';
export type PaymentMethod = 'cod' | 'upi' | 'card';

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  phone: string;
  email: string;
  deliveryType: DeliveryType;
  address?: string;
  landmark?: string;
  pincode?: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  couponCode?: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid';
  status: OrderStatus;
  statusHistory: Array<{
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export type CakeRequestStatus =
  | 'New'
  | 'Reviewing'
  | 'Accepted'
  | 'In Preparation'
  | 'Completed'
  | 'Rejected';

export interface CustomCakeRequest {
  id: string;
  userId?: string;
  customerName: string;
  phone: string;
  email: string;
  cakeType: string;
  size: string;
  flavor: string;
  theme: string;
  color: string;
  cakeMessage: string;
  referenceImage?: string;
  requiredDate: string;
  requiredTime: string;
  requirements?: string;
  status: CakeRequestStatus;
  estimatedPrice?: number;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  id: string;
  title: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  categoryLimit?: ProductCategory;
  expiryDate: string;
  active: boolean;
  badgeText?: string;
  createdAt?: string;
}

export interface DatabaseSchema {
  users: User[];
  products: Product[];
  orders: Order[];
  customCakes: CustomCakeRequest[];
  offers: Offer[];
}
