import { useEffect, useRef } from 'react';
import { useSettings } from '../../context/SettingsContext';

// مكوّن خلفية الجزيئات الفيزيائية التفاعلية المعزول باستخدام Canvas خفيف وعالي الأداء
export default function HeroParticlesBackground() {
  const { settings } = useSettings();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // التحقق من الوضع الليلي ونسق الألوان المختار
    const isDark = settings?.themeMode === 'dark';
    const colorTheme = settings?.colorTheme || 'agritech';

    // تحديد لوحة ألوان الجزيئات المتوافقة مع هوية المنصة
    let palette;
    if (colorTheme === 'roasted') {
      palette = isDark
        ? ['#e6c093', '#fed6a7', '#d4a373', '#b07d58']
        : ['#5c381e', '#794d2c', '#8c532b', '#d4a373'];
    } else if (colorTheme === 'obsidian') {
      palette = isDark
        ? ['#c5d1e0', '#8193a8', '#a0aec0', '#5c6b7d']
        : ['#24292e', '#38414e', '#4b5563', '#6b7280'];
    } else {
      // النسق الافتراضي (الأخضر الغابي الزراعي)
      palette = isDark
        ? ['#52B788', '#74C69D', '#95D5B2', '#D4A373', '#40916C']
        : ['#31691D', '#255215', '#40916C', '#52B788', '#D4A373'];
    }

    // تقليل عدد الجزيئات على الأجهزة الصغيرة للأداء السلس
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 24 : 45;

    // حالة مؤشر الماوس
    const mouse = {
      x: -1000,
      y: -1000,
      radius: isMobile ? 80 : 120,
      isHovered: false,
    };

    // موجات النقر التفاعلية
    const shockwaves = [];

    // إنشاء مصفوفة الجزيئات بخصائص فيزيائية متوازنة
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 2 + 1.5;
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: Math.random() * 0.35 + (isDark ? 0.35 : 0.25),
        friction: 0.94,
        ease: 0.03,
      });
    }

    // ضبط أبعاد الـ Canvas عند تغيير حجم الشاشة
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // تتبع حركة الماوس داخل نطاق القسم الترحيبي
    const handleMouseMove = (e) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.isHovered = true;
      } else {
        mouse.isHovered = false;
        mouse.x = -1000;
        mouse.y = -1000;
      }
    };

    // مغادرة الماوس
    const handleMouseLeave = () => {
      mouse.isHovered = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    // توليد موجة دفع خفيفة عند النقر
    const handleMouseDown = (e) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        shockwaves.push({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          radius: 5,
          maxRadius: 130,
          opacity: 0.4,
          speed: 4,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // حلقة الرسم والتحديث الفيزيائي المستمرة
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. تحديث ورسم موجات الدفع عند النقر
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const wave = shockwaves[s];
        wave.radius += wave.speed;
        wave.opacity *= 0.94;

        ctx.save();
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.strokeStyle = palette[0];
        ctx.globalAlpha = Math.max(0, wave.opacity);
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        if (wave.radius >= wave.maxRadius || wave.opacity < 0.02) {
          shockwaves.splice(s, 1);
        }
      }

      // 2. تحديث حركة الجزيئات والتفاعل مع الماوس والموجات
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // الطفو الطبيعي البطيء المستمر
        p.baseX += p.vx;
        p.baseY += p.vy;

        // ارتداد ناعم من حواف الشاشة
        if (p.baseX < 0 || p.baseX > width) p.vx *= -1;
        if (p.baseY < 0 || p.baseY > height) p.vy *= -1;

        // التفاعل مع مؤشر الماوس (التنافر السلس)
        let dx = p.x - mouse.x;
        let dy = p.y - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && mouse.isHovered) {
          const force = (1 - dist / mouse.radius) * 6;
          const angle = Math.atan2(dy, dx);
          p.x += Math.cos(angle) * force;
          p.y += Math.sin(angle) * force;
        }

        // التفاعل مع موجات النقر
        for (let s = 0; s < shockwaves.length; s++) {
          const wave = shockwaves[s];
          const wdx = p.x - wave.x;
          const wdy = p.y - wave.y;
          const wDist = Math.sqrt(wdx * wdx + wdy * wdy);
          if (Math.abs(wDist - wave.radius) < 25) {
            const pushAngle = Math.atan2(wdy, wdx);
            p.x += Math.cos(pushAngle) * 3;
            p.y += Math.sin(pushAngle) * 3;
          }
        }

        // العودة التدريجية نحو المسار الطبيعي
        p.x += (p.baseX - p.x) * p.ease;
        p.y += (p.baseY - p.y) * p.ease;

        // رسم الجزيء الدائري
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.restore();
      }

      // 3. رسم خطوط رفيعة شفافة تربط الجزيئات القريبة من المؤشر فقط
      if (mouse.isHovered) {
        ctx.save();
        const maxLinkDist = isMobile ? 55 : 80;
        for (let i = 0; i < particles.length; i++) {
          const pi = particles[i];
          const distToMouse = Math.sqrt((pi.x - mouse.x) ** 2 + (pi.y - mouse.y) ** 2);
          if (distToMouse > mouse.radius) continue;

          for (let j = i + 1; j < particles.length; j++) {
            const pj = particles[j];
            const distBetween = Math.sqrt((pi.x - pj.x) ** 2 + (pi.y - pj.y) ** 2);

            if (distBetween < maxLinkDist) {
              const lineAlpha = (1 - distBetween / maxLinkDist) * (isDark ? 0.22 : 0.16);
              ctx.beginPath();
              ctx.moveTo(pi.x, pi.y);
              ctx.lineTo(pj.x, pj.y);
              ctx.strokeStyle = pi.color;
              ctx.globalAlpha = lineAlpha;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // تنظيف الموارد ومستمعات الأحداث عند الإلغاء
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [settings?.themeMode, settings?.colorTheme]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}
