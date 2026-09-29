import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product, CartItem, Offer, DeliveryType } from '../types';
import { api } from '../services/api';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedWeight?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  deliveryType: DeliveryType;
  setDeliveryType: (type: DeliveryType) => void;
  appliedCoupon: Offer | null;
  couponCodeInput: string;
  setCouponCodeInput: (code: string) => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('pon_bakery_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery');
  const [appliedCoupon, setAppliedCoupon] = useState<Offer | null>(() => {
    try {
      const saved = localStorage.getItem('pon_bakery_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [couponCodeInput, setCouponCodeInput] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('pon_bakery_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [items]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('pon_bakery_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('pon_bakery_coupon');
    }
  }, [appliedCoupon]);

  const addToCart = (product: Product, quantity: number = 1, selectedWeight?: string) => {
    if (product.availability === 'out_of_stock' || product.stock <= 0) {
      toast.error(`Sorry, '${product.name}' is currently out of stock.`);
      return;
    }

    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          selectedWeight: selectedWeight || updated[existingIndex].selectedWeight
        };
        return updated;
      } else {
        return [...prev, { product, quantity, selectedWeight }];
      }
    });

    toast.success(`Added ${quantity}x ${product.name} to cart!`, 'Item Added');
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => {
      const item = prev.find(i => i.product.id === productId);
      if (item) {
        toast.info(`Removed ${item.product.name} from cart.`);
      }
      return prev.filter(i => i.product.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          // Check stock limit
          if (quantity > item.product.stock) {
            toast.warning(`Only ${item.product.stock} units available in bakery.`);
            return { ...item, quantity: item.product.stock };
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponCodeInput('');
  };

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [items]);

  const deliveryFee = useMemo(() => {
    if (items.length === 0 || deliveryType === 'pickup') return 0;
    // Free delivery above ₹500
    return subtotal >= 500 ? 0 : 30;
  }, [items.length, deliveryType, subtotal]);

  const discount = useMemo(() => {
    if (!appliedCoupon || subtotal < appliedCoupon.minOrderValue) {
      return 0;
    }
    if (appliedCoupon.discountType === 'percentage') {
      const raw = (subtotal * appliedCoupon.discountValue) / 100;
      return appliedCoupon.maxDiscount ? Math.min(raw, appliedCoupon.maxDiscount) : raw;
    } else {
      return Math.min(appliedCoupon.discountValue, subtotal);
    }
  }, [appliedCoupon, subtotal]);

  const total = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.max(0, subtotal + deliveryFee - discount);
  }, [items.length, subtotal, deliveryFee, discount]);

  const applyCoupon = async (code: string): Promise<boolean> => {
    if (!code || !code.trim()) {
      toast.error('Please enter a valid coupon code.');
      return false;
    }

    try {
      const res = await api.offers.validateCoupon(code, subtotal);
      if (res.success && res.offer) {
        setAppliedCoupon(res.offer);
        setCouponCodeInput(res.offer.code);
        toast.success(res.message, 'Coupon Applied!');
        return true;
      } else {
        toast.error(res.message || 'Invalid coupon code');
        return false;
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to apply coupon');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput('');
    toast.info('Coupon code removed.');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        deliveryFee,
        discount,
        total,
        deliveryType,
        setDeliveryType,
        appliedCoupon,
        couponCodeInput,
        setCouponCodeInput,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
