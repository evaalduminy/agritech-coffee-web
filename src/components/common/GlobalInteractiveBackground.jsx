import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Leaf, Sparkles, Sprout } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

// مكوّن الخلفية التفاعلية الشاملة لكامل المنصة مع التوهج والجزيئات والعمق ثلاثي الأبعاد
export default function GlobalInteractiveBackground() {
  const { settings } = useSettings();
  const canvasRef = useRef(null);

  // التحقق من الوضع الليلي ونمط الخلفية المختار
  const isDark = settings?.themeMode === 'dark';
  const bgMode = settings?.heroBackground || 'ambient';
  const isMinimal = bgMode === 'minimal';

  // حالة دعم مؤشر الماوس الدقيق لأجهزة سطح المكتب
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches
  );

  // إحداثيات مؤشر الماوس المباشرة للهالة الضوئية
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 500);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 400);

  // نوابض مرنة لتنعيم انتقال هالة الضوء مع المؤشر
  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // إحداثيات نسبية طبيعية [-0.5, 0.5] لحركة العمق ثلاثي الأبعاد (Parallax)
  const normX = useMotionValue(0);
  const normY = useMotionValue(0);
  const smoothNormX = useSpring(normX, { damping: 30, stiffness: 90 });
  const smoothNormY = useSpring(normY, { damping: 30, stiffness: 90 });

  // مرجع مباشر لموضع الماوس لاستخدامه في حلقة رسم الكانفاس بدون إعادة تصيير
  const mousePosRef = useRef({ x: -1000, y: -1000, isActive: false });

  // الاستماع لحركة الماوس وتحديث المؤشرات والنوابض
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    const handleMediaChange = (e) => setIsDesktop(e.matches);
    mediaQuery.addEventListener('change', handleMediaChange);

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      mousePosRef.current = { x: e.clientX, y: e.clientY, isActive: true };

      const w = window.innerWidth || 1000;
      const h = window.innerHeight || 800;
      normX.set(e.clientX / w - 0.5);
      normY.set(e.clientY / h - 0.5);
    };

    const handleMouseLeave = () => {
      mousePosRef.current.isActive = false;
      normX.set(0);
      normY.set(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, normX, normY]);

  // إدارة رسم وتحديث الجزيئات التفاعلية عبر HTML5 Canvas
  useEffect(() => {
    if (isMinimal) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // ضبط دقة الكانفاس عند تغيير مقاس الشاشة
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // إنشاء مصفوفة الجزيئات المتفاعلة (38 جزيئاً لتوازن الأداء والجمالية)
    const particleCount = 38;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2.2 + 1.2,
        baseAlpha: Math.random() * 0.25 + 0.15,
        alpha: Math.random() * 0.25 + 0.15,
        isAmber: Math.random() > 0.75, // 25% من الجزيئات بلون كرمي دافئ
      });
    }

    // حلقة الرسم والتحريك المستمرة مع استجابة التنافر للماوس
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mousePosRef.current;
      const repelDistance = 140;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. التفاعل والتنافر الناعم عند اقتراب الماوس
        if (mouse.isActive) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < repelDistance && dist > 0) {
            const force = (repelDistance - dist) / repelDistance;
            p.x += (dx / dist) * force * 2.5;
            p.y += (dy / dist) * force * 2.5;
            p.alpha = Math.min(p.baseAlpha * 1.8, 0.6);
          } else {
            p.alpha += (p.baseAlpha - p.alpha) * 0.05;
          }
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.05;
        }

        // 2. تحديث موضع الجزيء بالسرعة الذاتية
        p.x += p.vx;
        p.y += p.vy;

        // ارتداد ناعم عن حواف الشاشة
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // 3. رسم الجزيء بلون متناغم مع الوضعين النهاري والليلي
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.isAmber) {
          ctx.fillStyle = isDark
            ? `rgba(245, 158, 11, ${p.alpha * 0.9})`
            : `rgba(217, 119, 6, ${p.alpha * 0.85})`;
        } else {
          ctx.fillStyle = isDark
            ? `rgba(52, 211, 153, ${p.alpha})`
            : `rgba(46, 125, 50, ${p.alpha * 0.9})`;
        }
        ctx.fill();

        // 4. خطوط ربط خفيفة جداً بين الجزيئات المتقاربة
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distLinks = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (distLinks < 85) {
            const linkAlpha = (1 - distLinks / 85) * (isDark ? 0.08 : 0.05);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isDark
              ? `rgba(52, 211, 153, ${linkAlpha})`
              : `rgba(46, 125, 50, ${linkAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark, isMinimal]);

  // إعداد حركة الأشكال العائمة المعاكسة للمؤشر (عمق Parallax)
  const shape1X = useTransform(smoothNormX, [-0.5, 0.5], ['28px', '-28px']);
  const shape1Y = useTransform(smoothNormY, [-0.5, 0.5], ['24px', '-24px']);

  const shape2X = useTransform(smoothNormX, [-0.5, 0.5], ['-36px', '36px']);
  const shape2Y = useTransform(smoothNormY, [-0.5, 0.5], ['-30px', '30px']);

  const shape3X = useTransform(smoothNormX, [-0.5, 0.5], ['22px', '-22px']);
  const shape3Y = useTransform(smoothNormY, [-0.5, 0.5], ['-18px', '18px']);

  const shape4X = useTransform(smoothNormX, [-0.5, 0.5], ['-26px', '26px']);
  const shape4Y = useTransform(smoothNormY, [-0.5, 0.5], ['22px', '-22px']);

  const shape5X = useTransform(smoothNormX, [-0.5, 0.5], ['34px', '-34px']);
  const shape5Y = useTransform(smoothNormY, [-0.5, 0.5], ['-28px', '28px']);

  const shape6X = useTransform(smoothNormX, [-0.5, 0.5], ['-20px', '20px']);
  const shape6Y = useTransform(smoothNormY, [-0.5, 0.5], ['-22px', '22px']);

  const shape7X = useTransform(smoothNormX, [-0.5, 0.5], ['25px', '-25px']);
  const shape7Y = useTransform(smoothNormY, [-0.5, 0.5], ['30px', '-30px']);

  // ألوان ونقاط هالة الماوس حسب الوضع الليلي والنهاري
  const spotlightColor = useMemo(() => {
    return isDark
      ? 'rgba(52, 211, 153, 0.08)'
      : 'rgba(16, 185, 129, 0.07)';
  }, [isDark]);

  // خلفية كشاف الماوس الناعمة المحسوبة عند المستوى الأعلى لتوافق قواعد هوكس
  const spotlightBackground = useTransform(
    [smoothX, smoothY],
    ([x, y]) =>
      `radial-gradient(circle 380px at ${x}px ${y}px, ${spotlightColor}, transparent 70%)`
  );

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
    >
      {/* ============================================================ */}
      {/* الطبقة 1: التوهج المحيطي الناعم مع كشاف إضاءة يتبع الماوس */}
      {/* ============================================================ */}

      {/* 1.1 كرة التوهج العلوية (زمردي هادئ متحرك) */}
      <motion.div
        animate={{
          x: [0, 45, -35, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -left-32 w-[520px] sm:w-[680px] h-[520px] sm:h-[680px] rounded-full blur-[130px] sm:blur-[160px] bg-emerald-500/12 dark:bg-emerald-600/15"
      />

      {/* 1.2 كرة التوهج السفلية (كهرماني دافئ / زمردي داكن) */}
      <motion.div
        animate={{
          x: [0, -50, 40, 0],
          y: [0, 35, -45, 0],
          scale: [1, 0.94, 1.08, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-40 -right-40 w-[550px] sm:w-[720px] h-[550px] sm:h-[720px] rounded-full blur-[140px] sm:blur-[170px] bg-amber-500/8 dark:bg-emerald-950/30"
      />

      {/* 1.3 هالة إضاءة كشاف الماوس الناعمة التي تتبع المؤشر بسلاسة */}
      {isDesktop && !isMinimal && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: spotlightBackground,
          }}
        />
      )}

      {/* ============================================================ */}
      {/* الطبقة 2: شبكة الجزيئات والخطوط التفاعلية عبر HTML5 Canvas */}
      {/* ============================================================ */}
      {!isMinimal && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      )}

      {/* ============================================================ */}
      {/* الطبقة 3: الأشكال والأيقونات العائمة بعمق ثلاثي الأبعاد (Parallax) */}
      {/* ============================================================ */}
      {!isMinimal && (
        <div className="absolute inset-0 pointer-events-none">
          {/* شكل 1: شتلة ناعمة في الجزء العلوي الأيسر */}
          <motion.div
            style={{ x: shape1X, y: shape1Y }}
            className="absolute top-[14%] left-[7%] opacity-15 text-primary dark:text-emerald-400"
          >
            <Sprout className="w-8 h-8" />
          </motion.div>

          {/* شكل 2: دائرة مفرغة أنيقة في الجزء العلوي الأيمن */}
          <motion.div
            style={{ x: shape2X, y: shape2Y }}
            className="absolute top-[22%] right-[9%] w-16 h-16 rounded-full border border-primary/20 dark:border-emerald-400/25 opacity-15"
          />

          {/* شكل 3: بريق لامع في المنتصف الأيسر */}
          <motion.div
            style={{ x: shape3X, y: shape3Y }}
            className="absolute top-[46%] left-[5%] opacity-15 text-amber-500 dark:text-amber-400"
          >
            <Sparkles className="w-7 h-7" />
          </motion.div>

          {/* شكل 4: ورقة شجر ناعمة في منتصف الجانب الأيمن */}
          <motion.div
            style={{ x: shape4X, y: shape4Y }}
            className="absolute top-[60%] right-[7%] opacity-15 text-primary dark:text-emerald-300"
          >
            <Leaf className="w-9 h-9" />
          </motion.div>

          {/* شكل 5: دائرة مفرغة كهرمانية دافئة في الثلث السفلي */}
          <motion.div
            style={{ x: shape5X, y: shape5Y }}
            className="absolute top-[76%] left-[10%] w-20 h-20 rounded-full border border-amber-500/20 dark:border-amber-400/25 opacity-15"
          />

          {/* شكل 6: شتلة زراعية إضافية قرب الأسفل */}
          <motion.div
            style={{ x: shape6X, y: shape6Y }}
            className="absolute top-[86%] right-[12%] opacity-15 text-primary dark:text-emerald-400"
          >
            <Sprout className="w-8 h-8" />
          </motion.div>

          {/* شكل 7: حلقة دائرية مزدوجة ناعمة */}
          <motion.div
            style={{ x: shape7X, y: shape7Y }}
            className="absolute top-[38%] right-[22%] w-10 h-10 rounded-full border border-dashed border-primary/25 dark:border-emerald-400/30 opacity-15"
          />
        </div>
      )}
    </div>
  );
}
