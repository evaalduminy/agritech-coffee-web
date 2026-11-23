import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';

// مكوّن التوهج العضوي المتقدم وشبكة النقاط الهندسية وإضاءة تتبع المؤشر
export default function HeroAmbientBackground() {
  const { settings } = useSettings();
  const containerRef = useRef(null);

  // التحقق من تفعيل الوضع الليلي لضبط درجات الشفافية ودمج الألوان
  const isDark = settings?.themeMode === 'dark';

  // حالة التحقق من توافر مؤشر دقيق (شاشات سطح المكتب والماوس)
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches
  );

  // قيم الحركة المباشرة لموضع إضاءة المؤشر
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 400);
  const mouseY = useMotionValue(200);

  // نوابض حركة مرنة لتنعيم انتقال كشاف الضوء مع المؤشر
  const springSettings = { damping: 25, stiffness: 120, mass: 0.5 };
  const smoothX = useSpring(mouseX, springSettings);
  const smoothY = useSpring(mouseY, springSettings);

  // تفعيل تتبع المؤشر حصرياً لأجهزة سطح المكتب مع تنظيف مستمع الحدث
  useEffect(() => {
    // إذا كان نمط الخلفية المختار هو المبسط الهادئ نتوقف عن إضافة مستمع الحركة
    if (settings?.heroBackground === 'minimal') return;

    const mediaQuery = window.matchMedia('(pointer: fine)');
    const handleMediaChange = (e) => setIsDesktop(e.matches);
    mediaQuery.addEventListener('change', handleMediaChange);

    if (!mediaQuery.matches) {
      return () => {
        mediaQuery.removeEventListener('change', handleMediaChange);
      };
    }

    // حساب موضع المؤشر بالنسبة لحدود الحاوية
    const handleMouseMove = (event) => {
      if (!containerRef.current) return;
      const bounds = containerRef.current.getBoundingClientRect();
      const relativeX = event.clientX - bounds.left;
      const relativeY = event.clientY - bounds.top;
      mouseX.set(relativeX);
      mouseY.set(relativeY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY, settings?.heroBackground]);

  // إذا اختار المستخدم نمط الخلفية المبسط الهادئ
  if (settings?.heroBackground === 'minimal') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent dark:from-emerald-950/20" />
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: isDark
              ? 'radial-gradient(rgba(82, 183, 136, 0.12) 1.2px, transparent 1.2px)'
              : 'radial-gradient(rgba(49, 105, 29, 0.08) 1.2px, transparent 1.2px)',
            backgroundSize: '24px 24px',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, #000 35%, transparent 85%)',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, #000 35%, transparent 85%)',
          }}
        />
      </div>
    );
  }

  // النمط الافتراضي: التوهج العضوي التفاعلي ثلاثي الألوان مع كشاف المؤشر
  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
    >
      {/* 1. طبقة التوهج العضوي ثلاثي الألوان المدمج بنمط multiply نهاراً و screen ليلاً */}
      <div className="absolute inset-0">
        {/* الدائرة الأولى: أخضر زمردي غابي (#2D6A4F) في الأعلى يميناً */}
        <motion.div
          animate={{
            x: [0, 50, -40, 0],
            y: [0, -55, 30, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ backgroundColor: isDark ? 'rgba(45, 106, 79, 0.28)' : 'rgba(45, 106, 79, 0.16)' }}
          className="absolute -top-16 right-[15%] w-[450px] h-[450px] rounded-full blur-[80px] mix-blend-multiply dark:mix-blend-screen"
        />

        {/* الدائرة الثانية: نعناعي متوسط (#52B788) في المنتصف يساراً */}
        <motion.div
          animate={{
            x: [0, -45, 50, 0],
            y: [0, 50, -35, 0],
            scale: [1, 0.93, 1.08, 1],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ backgroundColor: isDark ? 'rgba(82, 183, 136, 0.24)' : 'rgba(82, 183, 136, 0.18)' }}
          className="absolute top-16 left-[5%] w-[420px] h-[420px] rounded-full blur-[80px] mix-blend-multiply dark:mix-blend-screen"
        />

        {/* الدائرة الثالثة: ذهبي دافئ مستوحى من نكهات البن (#D4A373) في الأسفل */}
        <motion.div
          animate={{
            x: [0, 55, -45, 0],
            y: [0, -40, 45, 0],
            scale: [1, 1.08, 0.94, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ backgroundColor: isDark ? 'rgba(212, 163, 115, 0.22)' : 'rgba(212, 163, 115, 0.16)' }}
          className="absolute -bottom-16 right-1/3 w-[440px] h-[440px] rounded-full blur-[80px] mix-blend-multiply dark:mix-blend-screen"
        />
      </div>

      {/* 2. شبكة نقاط هندسية دقيقة مع قناع تلاشٍ دائري ناعم */}
      <div
        className="absolute inset-0 pointer-events-none opacity-100 dark:opacity-60"
        style={{
          backgroundImage: isDark
            ? 'radial-gradient(rgba(82, 183, 136, 0.12) 1.2px, transparent 1.2px)'
            : 'radial-gradient(rgba(49, 105, 29, 0.12) 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, #000 35%, transparent 85%)',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, #000 35%, transparent 85%)',
        }}
      />

      {/* 3. كشاف الإضاءة الدائري الناعم الذي يتبع المؤشر فوق شبكة النقاط (سطح المكتب فقط) */}
      {isDesktop && (
        <motion.div
          style={{
            x: smoothX,
            y: smoothY,
            translateX: '-50%',
            translateY: '-50%',
            background: isDark
              ? 'radial-gradient(circle, rgba(82, 183, 136, 0.16) 0%, rgba(82, 183, 136, 0) 70%)'
              : 'radial-gradient(circle, rgba(64, 145, 108, 0.18) 0%, rgba(64, 145, 108, 0) 70%)',
          }}
          className="absolute w-[380px] h-[380px] rounded-full pointer-events-none mix-blend-screen"
        />
      )}
    </div>
  );
}
