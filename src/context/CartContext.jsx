import { createContext, useContext, useState, useEffect, useMemo } from 'react';

// إنشاء سياق إدارة سلة الطلبات
const CartContext = createContext(null);

// المفتاح المخصص لحفظ عناصر السلة في التخزين المحلي للمتصفح
const CART_STORAGE_KEY = 'agritech_coffee_cart';

// مزود سياق السلة لكافة أجزاء التطبيق
export function CartProvider({ children }) {
  // استرجاع السلة المحفوظة مسبقاً من التخزين المحلي لدعم التصفح الحر
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // حالة فتح وإغلاق نافذة السلة الجانبية
  const [isCartOpen, setIsCartOpen] = useState(false);

  // حفظ السلة في التخزين المحلي تلقائياً عند أي تعديل على العناصر
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('فشل في حفظ السلة محلياً:', error);
    }
  }, [cartItems]);

  // دالة إضافة منتج إلى السلة مع حفظ كامل البيانات الأصلية والمترجمة
  const addToCart = (product, quantity = 1) => {
    const qty = typeof quantity === 'number' && quantity > 0 ? quantity : 1;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === product.id);

      if (existingIndex > -1) {
        // تحديث كمية المنتج وتحديث أي حقول مترجمة مفقودة
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          ...product,
          quantity: updated[existingIndex].quantity + qty,
        };
        return updated;
      }

      // إضافة المنتج كعنصر جديد في السلة مع حفظ الحقول الإنجليزية بالكامل
      return [
        ...prevItems,
        {
          ...product,
          name: product.name,
          name_en: product.name_en || product.name,
          weight: product.weight,
          weight_en: product.weight_en || product.weight,
          roast_level: product.roast_level,
          roast_level_en: product.roast_level_en || product.roast_level,
          description: product.description,
          description_en: product.description_en || product.description,
          origin: product.origin,
          origin_en: product.origin_en || product.origin,
          badge: product.badge,
          badge_en: product.badge_en || product.badge,
          quantity: qty,
        },
      ];
    });

    // فتح نافذة السلة الجانبية لمعاينة الإضافة
    setIsCartOpen(true);
  };

  // دالة حذف منتج من السلة نهائياً
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // دالة تعديل كمية منتج معين في السلة
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // دالة تفريغ السلة بالكامل
  const clearCart = () => {
    setCartItems([]);
  };

  // فتح السلة
  const openCart = () => setIsCartOpen(true);

  // إغلاق السلة
  const closeCart = () => setIsCartOpen(false);

  // احتساب الإجمالي الكلي للأسعار
  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  // احتساب إجمالي عدد الحصص/المنتجات في السلة
  const totalCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const value = {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    openCart,
    closeCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    totalCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// دالة مخصصة لسهولة الوصول إلى سياق السلة
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
