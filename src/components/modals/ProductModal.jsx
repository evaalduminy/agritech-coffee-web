import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShoppingBag,
  Calendar,
  ShieldCheck,
  Sprout,
  Mountain,
  Flame,
  Coffee,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

// مكوّن النافذة المنبثقة لعرض تفاصيل المحصول وحجزه أو إضافته للطلب مع دعم اللغتين
export default function ProductModal({
  product = null,
  isOpen = false,
  onClose = () => {},
  onAddToCart = () => {},
  onReserve = () => {},
}) {
  const { requireAuth } = useAuth();
  const { t, isEnglish } = useSettings();

  // حالة عداد كمية الحصص المطلوبة للمنتج مع حد أدنى 1
  const [quantity, setQuantity] = useState(1);

  // إعادة ضبط الكمية إلى 1 عند تغيير المنتج أو فتح النافذة
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen, product]);

  // إغلاق النافذة عند الضغط على زر Escape في لوحة المفاتيح
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // التحقق من وجود بيانات المنتج قبل العرض
  if (!product) return null;

  // اختيار الحقول المترجمة
  const displayName = isEnglish ? (product.name_en || product.name) : product.name;
  const displayWeight = isEnglish ? (product.weight_en || product.weight) : product.weight;
  const displayRoast = isEnglish ? (product.roast_level_en || product.roast_level) : product.roast_level;
  const displayOrigin = isEnglish ? (product.origin_en || product.origin) : product.origin;
  const displayFarmer = isEnglish ? (product.farmer_name_en || product.farmer_name) : product.farmer_name;
  const displayBadge = isEnglish ? (product.badge_en || product.badge) : product.badge;
  const displayDesc = isEnglish ? (product.description_en || product.description) : product.description;

  // دالة زيادة الكمية
  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  // دالة إنقاص الكمية بحد أدنى 1
  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  // معالجة طلب الحجز بعد التحقق الإلزامي من المصادقة
  const handleReserveClick = () => {
    requireAuth(() => {
      onReserve(product, quantity);
    });
  };

  // احتساب السعر الكلي بحسب الكمية المختارة
  const totalPriceUsd = (product.price * quantity).toFixed(2);
  const totalPriceYer = Math.round(product.price * quantity * 250).toLocaleString();

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-product-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          {/* الخلفية الضبابية المعتمة القابلة للنقر للإغلاق */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/45 backdrop-blur-md"
          />

          {/* الحاوية الرئيسية للنافذة المنبثقة بتصميم Stitch */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[920px] bg-white rounded-3xl shadow-2xl border border-primary/20 overflow-hidden text-start my-auto z-10 max-h-[90vh] flex flex-col"
          >
            {/* زر الإغلاق الدائري العلوي */}
            <button
              type="button"
              onClick={onClose}
              aria-label={t('product.closeModal')}
              className="absolute top-4 ltr:right-4 rtl:left-4 z-20 w-10 h-10 rounded-full bg-surface-container-high/80 hover:bg-surface-container-highest text-on-surface flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* محتوى النافذة المنبثقة المقسم إلى عمودين */}
            <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto">
              
              {/* العمود الأول: صورة المحصول والشارات والمعلومات الجغرافية */}
              <div className="md:col-span-5 bg-surface-container-low/50 p-6 flex flex-col justify-between border-b md:border-b-0 rtl:md:border-l ltr:md:border-r border-surface-container">
                <div>
                  {/* إطار الصورة الرئيسية */}
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-surface-container shadow-md">
                    <img
                      src={product.image_url}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                    {/* شارة المعالجة أو الصنف */}
                    {displayBadge && (
                      <div className="absolute top-3 right-3 bg-primary text-on-primary px-3 py-1 rounded-lg font-label-sm text-label-sm font-semibold shadow-md flex items-center gap-1.5">
                        <Sprout className="w-4 h-4" />
                        <span>{displayBadge}</span>
                      </div>
                    )}
                    {/* شارة جودة التنقيط المختصة */}
                    <div className="absolute bottom-3 right-3 bg-surface-container-lowest/95 backdrop-blur-sm border border-primary/20 text-primary px-2.5 py-1 rounded-lg font-label-sm text-label-sm font-bold shadow-md flex items-center gap-1">
                      <Award className="w-4 h-4 text-secondary" />
                      <span>{t('product.qualityScore')}</span>
                    </div>
                  </div>
                </div>

                {/* بطاقة المصدر الجغرافي واسم المزارع */}
                <div className="mt-4 p-3 rounded-xl bg-surface-container-lowest border border-surface-container flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
                      <Mountain className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-label-sm text-[12px] font-bold text-on-surface">
                        {displayOrigin}
                      </span>
                      <span className="block text-[11px] text-on-surface-variant">
                        {t('product.farmerLabel')} {displayFarmer}
                      </span>
                    </div>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
              </div>

              {/* العمود الثاني: تفاصيل المحصول، السعر، والخيارات الإجرائية */}
              <div className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between space-y-4">
                <div>
                  {/* مسار التصنيف العلوي */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-container/15 text-primary text-[11px] font-bold tracking-wide flex items-center gap-1">
                      <Coffee className="w-3.5 h-3.5" />
                      <span>{t('product.specialtyCategory')}</span>
                    </span>
                    <span className="text-[11px] text-secondary font-semibold">
                      {t('product.directNoMiddlemen')}
                    </span>
                  </div>

                  {/* اسم المحصول الرئيسي */}
                  <h2
                    id="modal-product-title"
                    className="font-headline-lg text-[22px] sm:text-[24px] text-on-surface font-bold leading-tight"
                  >
                    {displayName}
                  </h2>

                  {/* السعر الإفرادي والإجمالي بالدولار والريال */}
                  <div className="flex items-baseline gap-2.5 mt-2 pb-3 border-b border-surface-container">
                    <span className="font-headline-lg text-[26px] text-primary font-bold tracking-tight">
                      ${totalPriceUsd}
                    </span>
                    <span className="font-body-md text-body-md text-secondary font-semibold">
                      ({totalPriceYer} {t('product.yerUnit')})
                    </span>
                    <span className="text-[11px] text-on-surface-variant font-medium mr-auto rtl:mr-auto ltr:ml-auto bg-surface-container-low px-2 py-0.5 rounded-md">
                      {t('product.freshShipping')}
                    </span>
                  </div>

                  {/* بطاقات المواصفات الفنية */}
                  <div className="grid grid-cols-2 gap-2.5 my-3.5">
                    <div className="bg-surface-container-low/60 p-2.5 rounded-xl border border-surface-container">
                      <span className="text-[11px] text-on-surface-variant block mb-0.5">{t('product.roastLevelLabel')}</span>
                      <span className="font-label-sm text-[12px] font-bold text-on-surface flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-secondary" />
                        <span>{displayRoast}</span>
                      </span>
                    </div>

                    <div className="bg-surface-container-low/60 p-2.5 rounded-xl border border-surface-container">
                      <span className="text-[11px] text-on-surface-variant block mb-0.5">{t('product.weightLabel')}</span>
                      <span className="font-label-sm text-[12px] font-bold text-on-surface flex items-center gap-1.5">
                        <Coffee className="w-3.5 h-3.5 text-primary" />
                        <span>{displayWeight}</span>
                      </span>
                    </div>
                  </div>

                  {/* الوصف الكامل للمحصول */}
                  <div className="mb-3.5">
                    <p className="font-body-sm text-[13px] text-on-surface-variant leading-relaxed bg-surface-container-lowest p-3 rounded-xl border border-surface-container/70">
                      {displayDesc}
                    </p>
                  </div>

                  {/* عداد الكمية الرقمي */}
                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-surface-container">
                    <span className="text-xs font-bold text-on-surface">{t('product.requiredQuantity')}</span>
                    <div className="flex items-center bg-surface-container-low rounded-xl border border-outline-variant/60 p-1">
                      <button
                        type="button"
                        onClick={handleDecrease}
                        aria-label={t('product.decreaseQty')}
                        className="w-7 h-7 rounded-lg flex items-center justify-center bg-white hover:bg-surface-container text-on-surface shadow-xs active:scale-90 font-bold transition-all cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-label-md text-label-md font-bold px-3 text-on-surface text-center min-w-[36px]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={handleIncrease}
                        aria-label={t('product.increaseQty')}
                        className="w-7 h-7 rounded-lg flex items-center justify-center bg-white hover:bg-surface-container text-on-surface shadow-xs active:scale-90 font-bold transition-all cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* أزرار الإجراءات الرئيسية المعتمدة عبر المنصة */}
                <div className="pt-2 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                    {/* الزر الرئيسي: أضف للطلب */}
                    <button
                      type="button"
                      onClick={() => onAddToCart(product, quantity)}
                      className={`${
                        product.is_reservable ? 'sm:col-span-7' : 'sm:col-span-12'
                      } py-3 px-4 rounded-xl bg-primary text-on-primary hover:bg-[#204613] hover:shadow-lg active:scale-[0.98] transition-all duration-200 font-label-lg text-label-lg font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer`}
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span>{t('product.addToOrder')}</span>
                    </button>

                    {/* الزر الثانوي: طلب حجز المحصول مع التحقق من المصادقة */}
                    {product.is_reservable && (
                      <button
                        type="button"
                        onClick={handleReserveClick}
                        className="sm:col-span-5 py-3 px-3 rounded-xl border-2 border-primary text-primary hover:bg-primary/10 active:scale-[0.98] transition-all duration-200 font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 bg-surface-container-lowest cursor-pointer"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>{t('product.reserve')}</span>
                      </button>
                    )}
                  </div>

                  {/* إشعار الثقة والتأكيد الزراعي المباشر */}
                  <p className="text-center font-label-sm text-[11px] text-on-surface-variant flex items-center justify-center gap-1 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    <span>{t('product.trustDirectNotice')}</span>
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
