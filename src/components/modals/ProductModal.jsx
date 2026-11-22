import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShoppingBag,
  Calendar,
  ShieldCheck,
  Sprout,
  Mountain,
  Coffee,
  Sparkles,
  Check,
  CalendarSync,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

// مكوّن النافذة المنبثقة التفاعلية لعرض تفاصيل المحصول وخياراته الديناميكية وحجزه أو إضافته للطلب
export default function ProductModal({
  product = null,
  isOpen = false,
  onClose = () => {},
  onAddToCart = () => {},
  onReserve = () => {},
}) {
  const { user, requireAuth } = useAuth();
  const { t, isEnglish } = useSettings();

  // الاحتفاظ بنسخة المحصول محلياً لتمكين حركات الإغلاق المتناسقة
  const [cachedProduct, setCachedProduct] = useState(product);

  // تحديث المحصول المخزن مباشرة أثناء التصيير عند توفر محصول جديد
  if (product && product !== cachedProduct) {
    setCachedProduct(product);
  }

  // المحصول الفعلي المعتمد للعرض داخل النافذة
  const activeProduct = product || cachedProduct;

  // حالة معرف المحصول المعروض حالياً لضبط الخيارات بدقة
  const [prevProductId, setPrevProductId] = useState(activeProduct?.id);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(activeProduct?.variants?.[0] || null);
  const [selectedOption, setSelectedOption] = useState(activeProduct?.custom_options?.choices?.[0] || null);
  const [isSubscription, setIsSubscription] = useState(false);

  // تحديث الخيارات تلقائياً عند تغيير المحصول لتفادي إعادة الرسم المتتالية
  if (activeProduct && activeProduct.id !== prevProductId) {
    setPrevProductId(activeProduct.id);
    setQuantity(1);
    setSelectedVariant(activeProduct.variants?.[0] || null);
    setSelectedOption(activeProduct.custom_options?.choices?.[0] || null);
    setIsSubscription(false);
  }

  // قفل تمرير الصفحة الخلفية عند فتح النافذة المنبثقة
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // إغلاق النافذة عند الضغط على زر الهروب في لوحة المفاتيح
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // التحقق من وجود بيانات المحصول وملاءمة بيئة المتصفح
  if (!activeProduct || typeof document === 'undefined') return null;

  // اختيار الحقول المترجمة للعرض
  const displayName = isEnglish ? (activeProduct.name_en || activeProduct.name) : activeProduct.name;
  const displayOrigin = isEnglish ? (activeProduct.origin_en || activeProduct.origin) : activeProduct.origin;
  const displayFarmer = isEnglish ? (activeProduct.farmer_name_en || activeProduct.farmer_name) : activeProduct.farmer_name;
  const displayBadge = isEnglish ? (activeProduct.badge_en || activeProduct.badge) : activeProduct.badge;
  const displayDesc = isEnglish ? (activeProduct.description_en || activeProduct.description) : activeProduct.description;
  const displayFreshnessTag = isEnglish
    ? (activeProduct.freshness_tag_en || activeProduct.freshness_tag || displayBadge)
    : (activeProduct.freshness_tag || displayBadge);

  // احتساب السعر الفعلي بناء على الحجم المختار ونسبة خصم الاشتراك إن وجدت
  const basePrice = selectedVariant ? Number(selectedVariant.price) : Number(activeProduct.price);
  const discountPercent = (isSubscription && activeProduct.subscription_discount) ? Number(activeProduct.subscription_discount) : 0;
  const effectiveUnitPrice = discountPercent > 0 ? basePrice * (1 - discountPercent / 100) : basePrice;

  // احتساب الإجمالي النهائي بالدولار والريال اليمني
  const totalPriceUsd = (effectiveUnitPrice * quantity).toFixed(2);
  const totalPriceYer = Math.round(effectiveUnitPrice * quantity * 250).toLocaleString();

  // تصفية المواصفات الفنية لاستبعاد أي تقييم جودة أو درجات تنقيط
  const filteredSpecs = Array.isArray(activeProduct.specs)
    ? activeProduct.specs.filter((spec) => {
        const labelAr = (spec.label || '').toLowerCase();
        const labelEn = (spec.label_en || '').toLowerCase();
        const val = (spec.value || '').toLowerCase();
        return (
          !labelAr.includes('تقييم') &&
          !labelAr.includes('جودة') &&
          !labelEn.includes('cupping') &&
          !labelEn.includes('score') &&
          !val.includes('scaa')
        );
      })
    : [];

  // دالة زيادة كمية الحصص
  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  // دالة إنقاص كمية الحصص بحد أدنى حصة واحدة
  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  // إرسال تفاصيل المحصول والخيارات المحددة إلى السلة
  const handleAddToCartClick = () => {
    onAddToCart(activeProduct, quantity, {
      selectedVariant,
      selectedOption,
      isSubscription,
      unitPrice: effectiveUnitPrice,
    });
  };

  // معالجة طلب حجز المحصول مع إغلاق نافذة المنتج أولاً في حال عدم تسجيل الدخول
  const handleReserveClick = () => {
    if (!user) {
      onClose();
      requireAuth(() => {}, t('auth.orderLoginPrompt'));
      return;
    }

    requireAuth(() => {
      onReserve(activeProduct, quantity, {
        selectedVariant,
        selectedOption,
        isSubscription,
        unitPrice: effectiveUnitPrice,
      });
    }, t('auth.orderLoginPrompt'));
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-product-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          {/* الخلفية الضبابية المعتمة القابلة للنقر للإغلاق مع z-[100] */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md"
          />

          {/* الحاوية الرئيسية للنافذة المنبثقة بتصميم Stitch */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[940px] bg-white dark:bg-[#122019] rounded-3xl shadow-2xl border border-primary/20 dark:border-emerald-800/50 overflow-hidden text-start my-auto z-[101] max-h-[90vh] flex flex-col"
          >
            {/* زر الإغلاق الدائري العلوي */}
            <button
              type="button"
              onClick={onClose}
              aria-label={t('product.closeModal')}
              className="absolute top-4 ltr:right-4 rtl:left-4 z-20 w-10 h-10 rounded-full bg-surface-container-high/80 dark:bg-emerald-950/80 hover:bg-surface-container-highest dark:hover:bg-emerald-900 text-on-surface dark:text-emerald-300 flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* محتوى النافذة المنبثقة المقسم إلى عمودين متجاوبين */}
            <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto">
              
              {/* العمود الأول: صورة المحصول والشارات والمعلومات الجغرافية */}
              <div className="md:col-span-5 bg-surface-container-low/50 dark:bg-emerald-950/20 p-6 flex flex-col justify-between border-b md:border-b-0 rtl:md:border-l ltr:md:border-r border-surface-container dark:border-emerald-900/30">
                <div>
                  {/* إطار الصورة الرئيسية */}
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-surface-container shadow-md">
                    <img
                      src={activeProduct.image_url}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* شارة الطزاجة أو الموسم الديناميكية */}
                    {displayFreshnessTag && (
                      <div className="absolute top-3 right-3 bg-primary text-on-primary px-3 py-1 rounded-lg font-label-sm text-label-sm font-semibold shadow-md flex items-center gap-1.5">
                        <Sprout className="w-4 h-4" />
                        <span>{displayFreshnessTag}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* بطاقة المصدر الجغرافي واسم المزارع */}
                <div className="mt-4 p-3 rounded-xl bg-surface-container-lowest dark:bg-[#0E1A14] border border-surface-container dark:border-emerald-900/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary-container/10 dark:bg-emerald-900/30 flex items-center justify-center text-primary dark:text-emerald-300">
                      <Mountain className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-label-sm text-[12px] font-bold text-on-surface dark:text-white">
                        {displayOrigin}
                      </span>
                      <span className="block text-[11px] text-on-surface-variant dark:text-gray-400">
                        {t('product.farmerLabel')} {displayFarmer}
                      </span>
                    </div>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-primary dark:text-emerald-400" />
                </div>
              </div>

              {/* العمود الثاني: تفاصيل المحصول، السعر، الخيارات الديناميكية، والأزرار */}
              <div className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between space-y-4">
                <div>
                  {/* مسار التصنيف العلوي */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-container/15 dark:bg-emerald-950/60 text-primary dark:text-emerald-300 text-[11px] font-bold tracking-wide flex items-center gap-1">
                      <Coffee className="w-3.5 h-3.5" />
                      <span>{t('product.specialtyCategory')}</span>
                    </span>
                    <span className="text-[11px] text-secondary dark:text-emerald-400 font-semibold">
                      {t('product.directNoMiddlemen')}
                    </span>
                  </div>

                  {/* اسم المحصول الرئيسي */}
                  <h2
                    id="modal-product-title"
                    className="font-headline-lg text-[22px] sm:text-[24px] text-on-surface dark:text-white font-bold leading-tight"
                  >
                    {displayName}
                  </h2>

                  {/* السعر الإفرادي والإجمالي بالدولار والريال مع توضيح نسبة الخصم إن وجدت */}
                  <div className="flex items-baseline gap-2.5 mt-2 pb-3 border-b border-surface-container dark:border-emerald-900/30">
                    <span className="font-headline-lg text-[26px] text-primary dark:text-emerald-400 font-bold tracking-tight">
                      ${totalPriceUsd}
                    </span>
                    <span className="font-body-md text-body-md text-secondary dark:text-gray-400 font-semibold">
                      ({totalPriceYer} {t('product.yerUnit')})
                    </span>
                    {discountPercent > 0 && (
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-md">
                        {t('product.saveDiscount')} {discountPercent}%
                      </span>
                    )}
                    <span className="text-[11px] text-on-surface-variant dark:text-gray-400 font-medium mr-auto rtl:mr-auto ltr:ml-auto bg-surface-container-low dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                      {t('product.freshShipping')}
                    </span>
                  </div>

                  {/* 1. خيارات الأحجام أو الأوزان (Variants) بصورة ديناميكية */}
                  {Array.isArray(activeProduct.variants) && activeProduct.variants.length > 0 && (
                    <div className="my-3.5">
                      <span className="text-[11px] font-bold text-on-surface dark:text-gray-300 block mb-1.5">
                        {t('product.variantLabel')}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {activeProduct.variants.map((v) => {
                          const isSelected = selectedVariant?.id === v.id;
                          const vLabel = isEnglish ? (v.label_en || v.label) : v.label;
                          return (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => setSelectedVariant(v)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-primary dark:bg-emerald-700 text-on-primary border-primary dark:border-emerald-600 shadow-xs'
                                  : 'bg-surface-container-low dark:bg-emerald-950/30 text-on-surface dark:text-gray-300 border-surface-container dark:border-emerald-900/50 hover:border-primary/40'
                              }`}
                            >
                              <span>{vLabel}</span>
                              <span className="opacity-80">(${Number(v.price).toFixed(2)})</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 2. الخيارات المخصصة مثل درجة الطحن (Custom Options) إن وُجدت */}
                  {activeProduct.custom_options && Array.isArray(activeProduct.custom_options.choices) && (
                    <div className="my-3.5">
                      <span className="text-[11px] font-bold text-on-surface dark:text-gray-300 block mb-1.5">
                        {isEnglish
                          ? (activeProduct.custom_options.title_en || activeProduct.custom_options.title)
                          : activeProduct.custom_options.title}
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {activeProduct.custom_options.choices.map((choice) => {
                          const isSelected = selectedOption?.id === choice.id;
                          const choiceLabel = isEnglish ? (choice.label_en || choice.label) : choice.label;
                          return (
                            <button
                              key={choice.id}
                              type="button"
                              onClick={() => setSelectedOption(choice)}
                              className={`px-3 py-2 rounded-xl text-xs font-medium border text-start transition-all cursor-pointer flex items-center justify-between ${
                                isSelected
                                  ? 'bg-primary-container/15 dark:bg-emerald-950/60 text-primary dark:text-emerald-300 border-primary dark:border-emerald-600 font-bold'
                                  : 'bg-surface-container-low dark:bg-emerald-950/20 text-on-surface dark:text-gray-300 border-surface-container dark:border-emerald-900/40 hover:border-primary/30'
                              }`}
                            >
                              <span>{choiceLabel}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-primary dark:text-emerald-300 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 3. خيار الاشتراك الدوري الشهري مع التخفيض إن كان متاحاً */}
                  {Boolean(activeProduct.subscription_discount && activeProduct.subscription_discount > 0) && (
                    <div
                      onClick={() => setIsSubscription((prev) => !prev)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between my-3 ${
                        isSubscription
                          ? 'bg-primary-container/15 dark:bg-emerald-950/60 border-primary dark:border-emerald-600 shadow-xs'
                          : 'bg-surface-container-low/60 dark:bg-emerald-950/20 border-surface-container dark:border-emerald-900/40 hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isSubscription
                            ? 'bg-primary dark:bg-emerald-700 text-on-primary'
                            : 'bg-surface-container dark:bg-emerald-900/40 text-on-surface-variant dark:text-gray-400'
                        }`}>
                          <CalendarSync className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-on-surface dark:text-white">
                              {t('product.subscriptionTitle')}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary dark:bg-emerald-700 text-on-primary">
                              {t('product.saveDiscount')} {activeProduct.subscription_discount}%
                            </span>
                          </div>
                          <span className="text-[11px] text-on-surface-variant dark:text-gray-400 block mt-0.5">
                            {t('product.subscriptionDesc')}
                          </span>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isSubscription
                          ? 'bg-primary dark:bg-emerald-700 border-primary dark:border-emerald-600 text-on-primary'
                          : 'border-outline-variant bg-white dark:bg-black/30'
                      }`}>
                        {isSubscription && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  )}

                  {/* 4. المواصفات الفنية الديناميكية (Specs) مع استبعاد تقييم الجودة */}
                  {filteredSpecs.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 my-3">
                      {filteredSpecs.map((spec, idx) => {
                        const specLabel = isEnglish ? (spec.label_en || spec.label) : spec.label;
                        const specValue = isEnglish ? (spec.value_en || spec.value) : spec.value;
                        return (
                          <div
                            key={idx}
                            className="bg-surface-container-low/60 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-surface-container dark:border-emerald-900/40"
                          >
                            <span className="text-[11px] text-on-surface-variant dark:text-gray-400 block mb-0.5">
                              {specLabel}
                            </span>
                            <span className="font-label-sm text-[12px] font-bold text-on-surface dark:text-gray-200 block truncate">
                              {specValue}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 5. دليل التحضير والاستخدام (Usage Guide) إن وُجد */}
                  {activeProduct.usage_guide && Array.isArray(activeProduct.usage_guide.steps) && (
                    <div className="my-3 p-3 rounded-xl bg-surface-container-lowest dark:bg-[#0E1A14] border border-surface-container dark:border-emerald-900/30">
                      <span className="text-[11px] font-bold text-on-surface dark:text-gray-300 block mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-secondary dark:text-emerald-400" />
                        <span>
                          {isEnglish
                            ? (activeProduct.usage_guide.title_en || activeProduct.usage_guide.title)
                            : activeProduct.usage_guide.title}
                        </span>
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {activeProduct.usage_guide.steps.map((step, sIdx) => (
                          <div
                            key={sIdx}
                            className="bg-surface-container-low dark:bg-emerald-950/30 p-2 rounded-lg text-center"
                          >
                            <span className="text-[10px] text-on-surface-variant dark:text-gray-400 block truncate">
                              {isEnglish ? (step.label_en || step.label) : step.label}
                            </span>
                            <span className="text-xs font-bold text-primary dark:text-emerald-300 block mt-0.5">
                              {step.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* الوصف الكامل للمحصول */}
                  <div className="mb-3.5">
                    <p className="font-body-sm text-[13px] text-on-surface-variant dark:text-gray-300 leading-relaxed bg-surface-container-lowest dark:bg-[#0E1A14] p-3 rounded-xl border border-surface-container/70 dark:border-emerald-900/30">
                      {displayDesc}
                    </p>
                  </div>

                  {/* عداد الكمية الرقمي */}
                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-surface-container dark:border-emerald-900/30">
                    <span className="text-xs font-bold text-on-surface dark:text-white">
                      {t('product.requiredQuantity')}
                    </span>
                    <div className="flex items-center bg-surface-container-low dark:bg-emerald-950/40 rounded-xl border border-outline-variant/60 dark:border-emerald-800/50 p-1">
                      <button
                        type="button"
                        onClick={handleDecrease}
                        aria-label={t('product.decreaseQty')}
                        className="w-7 h-7 rounded-lg flex items-center justify-center bg-white dark:bg-emerald-900/70 hover:bg-surface-container dark:hover:bg-emerald-800 text-on-surface dark:text-white shadow-xs active:scale-90 font-bold transition-all cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-label-md text-label-md font-bold px-3 text-on-surface dark:text-white text-center min-w-[36px]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={handleIncrease}
                        aria-label={t('product.increaseQty')}
                        className="w-7 h-7 rounded-lg flex items-center justify-center bg-white dark:bg-emerald-900/70 hover:bg-surface-container dark:hover:bg-emerald-800 text-on-surface dark:text-white shadow-xs active:scale-90 font-bold transition-all cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* أزرار الإجراءات الرئيسية المعتمدة عبر المنصة */}
                <div className="pt-2 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                    {/* الزر الرئيسي: أضف للطلب مع تمرير الخيارات المختارة */}
                    <button
                      type="button"
                      onClick={handleAddToCartClick}
                      className={`${
                        activeProduct.is_reservable ? 'sm:col-span-7' : 'sm:col-span-12'
                      } py-3 px-4 rounded-xl bg-primary hover:bg-[#204613] dark:bg-emerald-700 dark:hover:bg-emerald-600 text-on-primary hover:shadow-lg active:scale-[0.98] transition-all duration-200 font-label-lg text-label-lg font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer`}
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span>{t('product.addToOrder')}</span>
                    </button>

                    {/* الزر الثانوي: طلب حجز المحصول مع التحقق من المصادقة */}
                    {activeProduct.is_reservable && (
                      <button
                        type="button"
                        onClick={handleReserveClick}
                        className="sm:col-span-5 py-3 px-3 rounded-xl border-2 border-primary dark:border-emerald-600 text-primary dark:text-emerald-300 hover:bg-primary/10 dark:hover:bg-emerald-950/50 active:scale-[0.98] transition-all duration-200 font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 bg-surface-container-lowest dark:bg-[#0E1A14] cursor-pointer"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>{t('product.reserve')}</span>
                      </button>
                    )}
                  </div>

                  {/* إشعار الثقة والتأكيد الزراعي المباشر */}
                  <p className="text-center font-label-sm text-[11px] text-on-surface-variant dark:text-gray-400 flex items-center justify-center gap-1 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary dark:text-emerald-400" />
                    <span>{t('product.trustDirectNotice')}</span>
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
