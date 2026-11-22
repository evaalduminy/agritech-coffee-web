import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Award, Sparkles } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

// مكوّن العرض ثلاثي الأبعاد التفاعلي الفاخر للمنتج بتقنية 3D Parallax والزجاج النقي
export default function Product3DShowcase({ product }) {
  const { isEnglish } = useSettings();
  const containerRef = useRef(null);

  // قيم حركة الماوس بالنسبة لمركز الحاوية
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // نوابض فيزيائية ناعمة وسريعة الاستجابة لضمان سلاسة الدوران بدون أي تقطيع
  const springConfig = { stiffness: 220, damping: 22 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  // دوران ثلاثي الأبعاد متوازن للإطار الزجاجي (حتى ±10 درجات لإحساس عمق فاخر)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  // حركة عمق Parallax خفيفة للشارة العائمة في الاتجاه المعاكس
  const badgeTranslateX = useTransform(mouseXSpring, [-0.5, 0.5], ['-14px', '14px']);
  const badgeTranslateY = useTransform(mouseYSpring, [-0.5, 0.5], ['-10px', '10px']);

  // موضع لمعة الإضاءة المتتبعة للمؤشر فوق الصورة
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  // معالجة حركة الماوس فوق الحاوية
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;

    x.set(xPct);
    y.set(yPct);

    setGlare({
      x: (mouseX / rect.width) * 100,
      y: (mouseY / rect.height) * 100,
      opacity: 0.45,
    });
  };

  // استعادة وضع الاستقرار عند خروج المؤشر
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  // استخراج شارة تقييم الجودة من مواصفات المنتج
  const specs = product?.specs || [];
  const scoreSpec = specs[3] || {
    label: 'تقييم الجودة',
    label_en: 'Quality Score',
    value: '88.5 SCAA',
    value_en: '88.5 SCAA',
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => e.stopPropagation()}
      style={{ perspective: 1000 }}
      className="relative w-full h-full min-h-[300px] lg:min-h-[340px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#091710] via-[#0d2218] to-[#07130e] select-none"
    >
      {/* خلفية الإضاءة الهادئة المتدرجة في العمق */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-40 h-40 rounded-full bg-amber-500/15 blur-3xl" />
      </div>

      {/* الشارة العائمة الوحيدة في الزاوية العلوية بمسافة مدروسة وحركة عمق Parallax */}
      <motion.div
        style={{
          x: badgeTranslateX,
          y: badgeTranslateY,
          transform: 'translateZ(35px)',
        }}
        className="absolute top-14 rtl:left-4 ltr:right-4 z-20 pointer-events-none"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-emerald-400/30 text-white text-xs font-bold shadow-xl">
          <Award className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span>{isEnglish ? (scoreSpec.value_en || scoreSpec.value) : scoreSpec.value}</span>
        </div>
      </motion.div>

      {/* الإطار الزجاجي ثلاثي الأبعاد الحامل لصورة المحصول الطبيعية بدون أي مط أو تشويه */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 w-44 sm:w-52 aspect-[3/4] rounded-2xl p-1 bg-white/10 dark:bg-emerald-400/10 backdrop-blur-md border border-white/30 dark:border-emerald-400/30 shadow-2xl shadow-emerald-950/70 overflow-hidden cursor-grab active:cursor-grabbing"
      >
        {/* صورة المحصول بأبعادها الطبيعية النظيفة */}
        <img
          src={product?.image_url || '/images/coffee-1.jpg'}
          alt={product?.name || 'محصول الموسم'}
          className="w-full h-full object-cover rounded-xl pointer-events-none"
        />

        {/* لمعة إضاءة زجاجية تتحرك فوق الصورة مع حركة المؤشر */}
        <div
          className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle 220px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.45), transparent 75%)`,
          }}
        />

        {/* شارة توثيق صغيرة هادئة في أسفل الإطار */}
        <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-md border border-white/15 text-[11px] text-white/90 font-medium">
          <span className="truncate">{product?.origin || 'حراز - اليمن'}</span>
          <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
        </div>
      </motion.div>
    </div>
  );
}
