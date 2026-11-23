import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShoppingBag, MessageSquare, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { openWhatsAppInquiry } from '../../services/whatsapp';

// مكوّن بطاقة المحصول المستقل بتصميم متجاوب يدعم إضافة السلة المباشرة والاستفسار السريع عبر واتساب
export default function ProductCard({
  product,
  onClick = () => {},
  index = 0,
}) {
  const { addToCart, triggerFlyToCart } = useCart();
  const { t, settings, isEnglish } = useSettings();

  // مرجع البطاقة وحالة أجهزة سطح المكتب
  const cardRef = useRef(null);
  const [isDesktopMouse, setIsDesktopMouse] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(pointer: fine)').matches;
    }
    return false;
  });

  // متابعة التغيير في نوع المؤشر أو الشاشة
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(pointer: fine)');
    const listener = (e) => setIsDesktopMouse(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  // قيم الحركة لميلان البطاقة مع الماوس
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // نوابض تخميد ناعمة للميلان الفيزيائي
  const mouseXSpring = useSpring(x, { stiffness: 240, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 240, damping: 20 });

  // تحويل إحداثيات المؤشر إلى زوايا ميلان لا تتجاوز ±6 درجات
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['6deg', '-6deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-6deg', '6deg']);

  // موضع لمعة الإضاءة المتتبعة للمؤشر فوق البطاقة
  const [sheenPosition, setSheenPosition] = useState({ x: 50, y: 50, opacity: 0 });

  // حالة التنبيه المرئي الخفيف عند إضافة المنتج للسلة بنجاح
  const [isAdded, setIsAdded] = useState(false);

  // تفعيل تأثير الميلان فقط عند تمكين الإعداد واستخدام شاشة سطح مكتب
  const isTiltActive = Boolean(settings?.enableCard3DTilt && isDesktopMouse);

  // تحديث الميلان واللمعة عند تحرك المؤشر فوق البطاقة
  const handleMouseMove = (e) => {
    if (!isTiltActive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);

    setSheenPosition({
      x: (mouseX / rect.width) * 100,
      y: (mouseY / rect.height) * 100,
      opacity: 1,
    });
  };

  // استعادة الوضع الطبيعي عند مغادرة المؤشر للبطاقة
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setSheenPosition((prev) => ({ ...prev, opacity: 0 }));
  };

  // اختيار الحقول المناسبة بحسب اللغة الحالية مع بدائل احتياطية موثوقة
  const displayName = isEnglish ? (product.name_en || product.name) : product.name;
  const displayBadge = isEnglish ? (product.badge_en || product.badge) : product.badge;
  const displayDesc = isEnglish ? (product.description_en || product.description) : product.description;

  // استخراج السطر الفرعي العام سواء كان للبن أو لأي محصول زراعي آخر
  const displaySubtitle = isEnglish
    ? (product.subtitle_en || product.subtitle || `${product.weight_en || product.weight || ''} - ${product.roast_level_en || product.roast_level || ''}`)
    : (product.subtitle || `${product.weight || ''} - ${product.roast_level || ''}`);

  // احتساب السعر التقديري بالريال اليمني كإشارة مرجعية
  const approximateYer = Math.round(product.price * 250).toLocaleString();

  // معالجة النقر على زر الإضافة للسلة مع تأثير الطيران دون فتح واتساب
  const handleAddClick = (e) => {
    e.stopPropagation();

    // إطلاق تأثير طيران صورة المحصول للسلة إذا كان مفعلاً
    if (settings?.enableFlyToCart && triggerFlyToCart) {
      const cardContainer = cardRef.current || e.currentTarget.closest('.group');
      const cardImage = cardContainer?.querySelector('img');
      const startRect = cardImage ? cardImage.getBoundingClientRect() : e.currentTarget.getBoundingClientRect();
      const targetElement = document.getElementById('navbar-cart-icon');
      const targetRect = targetElement ? targetElement.getBoundingClientRect() : null;

      if (startRect && targetRect) {
        triggerFlyToCart({
          id: `${product.id}-${Date.now()}`,
          imageUrl: product.image_url,
          startRect,
          targetRect,
        });
      }
    }

    addToCart(product, 1, { openDrawer: false });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  // معالجة النقر على زر الاستفسار لفتح رسالة استفسار مخصصة عبر واتساب
  const handleInquiryClick = (e) => {
    e.stopPropagation();
    openWhatsAppInquiry(product, isEnglish);
  };

  return (
    <motion.div
      ref={cardRef}
      data-index={index}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        isTiltActive
          ? {
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }
          : undefined
      }
      className="relative group cursor-pointer flex flex-col justify-between bg-white/80 dark:bg-[#122019]/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out border border-[#DCE5D8] dark:border-emerald-400/15 hover:border-[#31691D]/30 text-start"
    >
      {/* لمعة ضوئية ناعمة تتبع المؤشر في وضع 3D Tilt */}
      {isTiltActive && (
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-2xl transition-opacity duration-300"
          style={{
            opacity: sheenPosition.opacity ? 0.35 : 0,
            background: `radial-gradient(circle 220px at ${sheenPosition.x}% ${sheenPosition.y}%, rgba(255, 255, 255, 0.4), transparent 80%)`,
          }}
        />
      )}

      <div>
        {/* حاوية صورة المنتج المدمجة والمرنة مع الشارة التعريفية العلوية */}
        <div className="relative w-full h-44 sm:h-48 bg-surface-container-low/70 overflow-hidden">
          <img
            src={product.image_url}
            alt={displayName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {displayBadge && (
            <div className="absolute top-2.5 right-2.5 bg-[#31691D] text-white px-2.5 py-0.5 rounded-lg text-xs shadow-sm font-semibold">
              {displayBadge}
            </div>
          )}
        </div>

        {/* تفاصيل المحصول المنسقة والمحكمة: الاسم والسطر الفرعي والسعر والوصف */}
        <div className="p-3.5 sm:p-4 space-y-2">
          <h3 className="text-base font-bold text-[#1A2B15] dark:text-white line-clamp-1 group-hover:text-[#31691D] transition-colors duration-200">
            {displayName}
          </h3>

          {/* السطر الفرعي العام المتكيف مع أي محصول */}
          <p className="text-xs text-[#556650] dark:text-gray-400 font-medium line-clamp-1">
            {displaySubtitle}
          </p>

          {/* عرض السعر بالدولار والريال بتناسق خطي رشيق */}
          <div className="flex items-baseline gap-1 pt-0.5">
            <span className="text-base sm:text-lg text-[#31691D] dark:text-[#7BC662] font-extrabold">
              ${Number(product.price).toFixed(2)}
            </span>
            <span className="text-xs text-[#556650] dark:text-gray-400 font-normal">
              ({approximateYer} {t('product.yerUnit')})
            </span>
          </div>

          <p className="text-xs text-[#556650] dark:text-gray-300 line-clamp-2 leading-relaxed">
            {displayDesc}
          </p>
        </div>
      </div>

      {/* زرا الإجراءات المفصولة المدمجة: الإضافة للسلة والاستفسار السريع عبر واتساب */}
      <div className="p-3.5 sm:p-4 pt-0 grid grid-cols-2 gap-2">
        {/* زر الإضافة إلى سلة المحاصيل مع تنبيه مرئي خفيف */}
        <button
          type="button"
          onClick={handleAddClick}
          className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-surface-container text-[#1A2B15] hover:bg-[#E9F2E4] hover:text-[#31691D] dark:text-emerald-300 dark:border dark:border-emerald-700/60 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 active:scale-95 transition-all text-center text-xs font-semibold cursor-pointer border border-transparent"
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#31691D] dark:text-[#7BC662]" />
              <span className="text-[#31691D] dark:text-[#7BC662]">{t('product.added')}</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5 text-[#31691D] dark:text-[#7BC662]" />
              <span>{t('product.addToCart')}</span>
            </>
          )}
        </button>

        {/* زر الاستفسار السريع عن المحصول عبر واتساب بالأخضر الزراعي المعتمد */}
        <button
          type="button"
          onClick={handleInquiryClick}
          className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-[#31691D] text-white hover:bg-[#255215] hover:shadow-md dark:bg-emerald-700 dark:hover:bg-emerald-600 active:scale-95 transition-all text-center text-xs font-semibold cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{t('product.inquire')}</span>
        </button>
      </div>
    </motion.div>
  );
}
