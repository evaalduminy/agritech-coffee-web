import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  X,
  Trash2,
  ShieldCheck,
  MessageSquare,
  Lock,
  ArrowRight,
  User,
  MapPin,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { mockProducts } from '../../data/mockData';
import { openWhatsApp } from '../../services/whatsapp';

// مكوّن السلة الجانبية المنبثقة مع دعم كامل للغتين والبحث في mockProducts كبديل
export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    totalPrice,
    totalCount,
  } = useCart();

  const { requireAuth } = useAuth();
  const { t, isEnglish } = useSettings();

  // بيانات استلام الطلب السريعة لربطها برسالة واتساب
  const [buyerName, setBuyerName] = useState('عبد الرحمن اليافعي');
  const [buyerAddress, setBuyerAddress] = useState('صنعاء، شارع حدة');

  // إغلاق السلة الجانبية عند الضغط على زر Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  // دالة تأكيد الطلب وتوجيهه مباشرة عبر واتساب بعد التحقق الإلزامي من تسجيل الدخول
  const handleCheckoutWhatsApp = () => {
    if (cartItems.length === 0) return;

    requireAuth((currentUser) => {
      const order = {
        id: `ORD-${Date.now().toString().slice(-4)}`,
        type: 'order',
        status: 'pending',
        total_price: totalPrice,
        created_at: new Date().toISOString().split('T')[0],
        items: cartItems.map((item) => {
          const matched = mockProducts.find((p) => p.id === item.id);
          const finalName = isEnglish
            ? (item.name_en || matched?.name_en || item.name)
            : (item.name || matched?.name);

          return {
            product_id: item.id,
            name: finalName,
            quantity: item.quantity,
            price: item.price,
          };
        }),
      };

      openWhatsApp(order, {
        name: currentUser?.name || buyerName,
        phone: currentUser?.emailOrPhone || '',
        city: buyerAddress,
      });
    });
  };

  // احتساب المقابل بالريال اليمني
  const totalPriceYer = Math.round(totalPrice * 250).toLocaleString();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* الخلفية الضبابية المعتمة */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/45 backdrop-blur-sm"
          />

          {/* لوحة السلة المنزلقة */}
          <motion.aside
            initial={{ x: isEnglish ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: isEnglish ? '100%' : '-100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            aria-label={t('cart.title')}
            className="relative rtl:mr-auto ltr:ml-auto h-full w-full sm:w-[480px] max-w-full bg-surface shadow-2xl flex flex-col border-r border-surface-container overflow-hidden z-10 text-start"
          >
            {/* 1. رأس السلة الجانبية */}
            <div className="p-5 border-b border-surface-container bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-primary-container flex items-center justify-center text-on-primary shadow-sm">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      {t('cart.title')}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm font-bold shadow-xs">
                      {totalCount} {totalCount === 1 ? t('cart.cropSingular') : t('cart.cropPlural')}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-secondary font-medium mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span>{t('cart.subtitle')}</span>
                  </p>
                </div>
              </div>

              {/* زر إغلاق السلة */}
              <button
                type="button"
                onClick={closeCart}
                aria-label={t('cart.removeItem')}
                className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. محتوى قائمة المنتجات أو الحالة الفارغة */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                /* حالة السلة الفارغة بتصميم أنيق */
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-20 h-20 rounded-3xl bg-surface-container-low flex items-center justify-center text-outline">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-headline-sm text-on-surface font-bold">
                      {t('cart.emptyTitle')}
                    </h3>
                    <p className="font-body-sm text-xs text-on-surface-variant max-w-xs leading-relaxed">
                      {t('cart.emptyDesc')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      closeCart();
                      document.getElementById('coffee-products')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:bg-[#204613] transition-all shadow-sm cursor-pointer"
                  >
                    <span>{t('cart.browseNow')}</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                </div>
              ) : (
                <>
                  {/* قائمة بطاقات المنتجات المضافة مع البحث في mockProducts كبديل */}
                  {cartItems.map((item) => {
                    const matched = mockProducts.find((p) => p.id === item.id);
                    const itemName = isEnglish
                      ? (item.name_en || matched?.name_en || item.name)
                      : (item.name || matched?.name);
                    const itemWeight = isEnglish
                      ? (item.weight_en || matched?.weight_en || item.weight)
                      : (item.weight || matched?.weight);
                    const itemRoast = isEnglish
                      ? (item.roast_level_en || matched?.roast_level_en || item.roast_level)
                      : (item.roast_level || matched?.roast_level);
                    const itemTotalUsd = (item.price * item.quantity).toFixed(2);
                    const itemTotalYer = Math.round(item.price * item.quantity * 250).toLocaleString();

                    return (
                      <div
                        key={item.id}
                        className="flex items-start gap-3.5 p-3.5 bg-surface-container-lowest border border-surface-container rounded-2xl shadow-xs hover:border-primary/30 transition-all text-start"
                      >
                        {/* صورة المنتج */}
                        <img
                          src={item.image_url || matched?.image_url}
                          alt={itemName}
                          className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-surface-container-low border border-surface-container"
                        />

                        {/* معلومات المحصول والكمية والتحكم */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-headline-sm text-[15px] font-bold text-on-surface leading-tight truncate">
                              {itemName}
                            </h4>
                            {/* زر حذف المنتج من السلة */}
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              aria-label={t('cart.removeItem')}
                              className="text-on-surface-variant hover:text-error p-1 rounded-lg hover:bg-error-container/60 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <p className="font-body-sm text-[12px] text-secondary font-medium mt-0.5">
                            {itemWeight} - {itemRoast}
                          </p>

                          {/* عداد الكمية والسعر */}
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-surface-container">
                            <div className="flex items-center gap-2 bg-surface-container-low rounded-lg p-1">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                aria-label="إنقاص الكمية"
                                className="w-6 h-6 rounded flex items-center justify-center bg-surface hover:bg-surface-container text-on-surface text-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                              >
                                -
                              </button>
                              <span className="font-label-md text-label-md font-bold px-2 text-on-surface min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                aria-label="زيادة الكمية"
                                className="w-6 h-6 rounded flex items-center justify-center bg-surface hover:bg-surface-container text-on-surface text-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <div className="text-end">
                              <div className="font-headline-sm text-[15px] text-primary font-bold">
                                ${itemTotalUsd}
                              </div>
                              <div className="font-body-sm text-[11px] text-on-surface-variant">
                                ({itemTotalYer} {t('product.yerUnit')})
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* حقول بيانات استلام الطلب السريعة */}
                  <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container space-y-3.5 shadow-xs text-start">
                    <div className="flex items-center justify-between border-b border-surface-container pb-2">
                      <span className="font-headline-sm text-[14px] text-on-surface font-bold flex items-center gap-1.5">
                        <User className="w-4 h-4 text-primary" />
                        <span>{t('cart.deliveryInfoTitle')}</span>
                      </span>
                      <span className="font-label-sm text-[11px] text-secondary font-medium">
                        {t('cart.quickFill')}
                      </span>
                    </div>

                    <div>
                      <label
                        htmlFor="buyer-name"
                        className="block font-label-md text-xs text-on-surface font-semibold mb-1"
                      >
                        {t('cart.buyerNameLabel')}
                      </label>
                      <input
                        id="buyer-name"
                        type="text"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder={t('cart.buyerNamePlaceholder')}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body-md"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="buyer-address"
                        className="block font-label-md text-xs text-on-surface font-semibold mb-1 flex items-center gap-1"
                      >
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span>{t('cart.buyerAddressLabel')}</span>
                      </label>
                      <input
                        id="buyer-address"
                        type="text"
                        value={buyerAddress}
                        onChange={(e) => setBuyerAddress(e.target.value)}
                        placeholder={t('cart.buyerAddressPlaceholder')}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body-md"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 3. أسفل السلة: الإجماليات وزر المتابعة عبر واتساب */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-surface-container bg-surface-container-low/70 space-y-3.5 text-start">
                <div className="space-y-1.5 px-1">
                  <div className="flex items-center justify-between text-body-sm text-on-surface-variant font-medium">
                    <span>{t('cart.subtotal')}</span>
                    <span className="font-bold text-on-surface">${totalPrice.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-body-sm text-on-surface-variant font-medium">
                    <span>{t('cart.delivery')}</span>
                    <span className="text-primary font-bold">{t('cart.freeDelivery')}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-surface-container">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      {t('cart.total')}
                    </span>
                    <div className="text-end">
                      <div className="font-headline-lg text-headline-lg text-primary font-bold">
                        ${totalPrice.toFixed(2)}
                      </div>
                      <div className="font-body-sm text-body-sm text-secondary font-semibold">
                        ({totalPriceYer} {t('product.yerUnit')})
                      </div>
                    </div>
                  </div>
                </div>

                {/* إشعار خلو المنصة من بوابات الدفع الإلكتروني */}
                <div className="p-3 rounded-xl bg-surface-container-lowest border border-primary/20 text-on-surface text-[12px] leading-relaxed flex items-start gap-2 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    {t('cart.noGatewayNotice')}
                  </span>
                </div>

                {/* زر تأكيد الطلب والتوجيه لواتساب بعد التحقق من تسجيل الدخول */}
                <button
                  type="button"
                  onClick={handleCheckoutWhatsApp}
                  className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-[#204613] text-white hover:shadow-xl active:scale-[0.98] transform transition-all duration-200 flex items-center justify-center gap-2.5 font-label-lg text-label-lg font-bold shadow-lg cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>{t('cart.confirmWhatsApp')}</span>
                </button>

                <div className="text-center font-label-sm text-xs text-on-surface-variant flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-primary" />
                  <span>{t('cart.trustBanner')}</span>
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
