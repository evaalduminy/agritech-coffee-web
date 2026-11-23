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

  // قائمة العناصر الطائرة حالياً نحو أيقونة السلة (Fly-to-Cart)
  const [flyingItems, setFlyingItems] = useState([]);

  // حفظ السلة في التخزين المحلي تلقائياً عند أي تعديل على العناصر
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('فشل في حفظ السلة محلياً:', error);
    }
  }, [cartItems]);

  // دالة إضافة منتج إلى السلة مع دعم الخيارات المتاحة والملاحظات
  const addToCart = (product, quantity = 1, options = {}) => {
    const qty = typeof quantity === 'number' && quantity > 0 ? quantity : 1;
    const variant = options.selectedVariant || (product.variants && product.variants[0]) || null;
    const unitPrice = options.unitPrice ?? (variant ? Number(variant.price) : Number(product.price));
    const notes = options.notes ? String(options.notes).trim().slice(0, 1000) : '';

    // معرّف فريد لعنصر السلة بناءً على معرّف المحصول والحجم
    const cartItemId = options.cartItemId || `${product.id}-${variant?.id || 'def'}`;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => (item.cartItemId || item.id) === cartItemId
      );

      if (existingIndex > -1) {
        // تحديث الكمية والملاحظات للعنصر المطابق
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty,
          notes: notes || updated[existingIndex].notes || '',
        };
        return updated;
      }

      // إضافة عنصر جديد في السلة
      return [
        ...prevItems,
        {
          ...product,
          cartItemId,
          price: unitPrice,
          originalPrice: variant ? Number(variant.price) : Number(product.price),
          selectedVariant: variant,
          notes,
          name: product.name,
          name_en: product.name_en || product.name,
          subtitle: product.subtitle || '',
          subtitle_en: product.subtitle_en || '',
          quantity: qty,
        },
      ];
    });

    // فتح نافذة السلة الجانبية لمعاينة الإضافة إذا لم يطلب كتمها صراحة
    if (options.openDrawer !== false) {
      setIsCartOpen(true);
    }
  };

  // دالة إطلاق حركة طيران صورة المحصول نحو السلة
  const triggerFlyToCart = (item) => {
    setFlyingItems((prev) => [...prev, item]);
  };

  // دالة حذف عنصر الطيران فور انتهاء مسار حركته
  const removeFlyingItem = (id) => {
    setFlyingItems((prev) => prev.filter((item) => item.id !== id));
  };

  // دالة حذف منتج من السلة بواسطة معرّف العنصر
  const removeFromCart = (cartItemId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => (item.cartItemId || item.id) !== cartItemId)
    );
  };

  // دالة تعديل كمية منتج معين في السلة
  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        (item.cartItemId || item.id) === cartItemId
          ? { ...item, quantity: newQuantity }
          : item
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

  // احتساب الإجمالي الكلي لأسعار المنتجات في السلة
  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  // احتساب إجمالي عدد الحصص أو المنتجات في السلة
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
    flyingItems,
    triggerFlyToCart,
    removeFlyingItem,
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
