import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, ArrowDown, Mountain, Award, Sparkles } from 'lucide-react';
import HeroAmbientBackground from './HeroAmbientBackground';
import HeroParticlesBackground from './HeroParticlesBackground';
import { useSettings } from '../../context/SettingsContext';

// مكوّن العداد التصاعدي السلس للأرقام والإحصائيات
function AnimatedNumber({ target, prefix = '', suffix = '', duration = 1500 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    let frameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // منحنى تخفيف ناعم وسريع في البداية وهادئ في النهاية
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * target));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);

  return (
    <span>
      {prefix}{count}{suffix}
    </span>
  );
}

// مكوّن القسم الترحيبي (Hero) مع بطاقات الإحصائيات المختصرة ودعم اللغتين
export default function Hero() {
  const { t, settings } = useSettings();
  const heroBg = settings?.heroBackground || 'ambient';

  // حالة الإزاحة المغناطيسية للزر
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });

  // تفاعل الزر المغناطيسي عند تحرك المؤشر فوقه
  const handleMagneticMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    setMagneticOffset({
      x: (clientX - centerX) * 0.25,
      y: (clientY - centerY) * 0.25,
    });
  };

  // استعادة موضع الزر الطبيعي عند مغادرة المؤشر
  const handleMagneticLeave = () => {
    setMagneticOffset({ x: 0, y: 0 });
  };

  // دالة التمرير السلس إلى شبكة محاصيل المتجر
  const handleScrollToProducts = () => {
    const productsSection = document.getElementById('coffee-products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-surface-container-low via-surface to-background dark:bg-[#0B1410] dark:from-[#0B1410] dark:via-[#0F1C16] dark:to-[#0B1410] pb-space-lg pt-28 md:pt-space-lg">
      {/* عرض خلفية الواجهة الترحيبية حسب الإعداد المختار */}
      {heroBg === 'particles' && <HeroParticlesBackground />}
      {heroBg === 'ambient' && <HeroAmbientBackground />}

      <div className="max-w-7xl mx-auto px-margin relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-space-md">
          
          {/* الشارة التوثيقية العلوية */}
          <div className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-surface-container-high/80 text-primary shadow-xs backdrop-blur-sm dark:bg-emerald-950/80 dark:text-emerald-300 dark:border dark:border-emerald-800/50">
            <BadgeCheck className="w-4 h-4 text-primary dark:text-emerald-300" />
            <span className="font-label-md text-label-md tracking-wide">
              {t('hero.badge')}
            </span>
          </div>

          {/* العنوان الرئيسي للواجهة */}
          <h1 className="font-headline-lg text-headline-lg text-primary dark:text-white md:text-[34px] md:leading-[46px] tracking-tight font-bold">
            {t('hero.title')}
          </h1>

          {/* الوصف الإرشادي المختصر للمنصة */}
          <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-gray-300 max-w-2xl leading-relaxed">
            {t('hero.description')}
          </p>

          {/* زر الانتقال المباشر للمنتجات مع تفاعل الزر المغناطيسي السلس */}
          <div className="pt-space-xs">
            <motion.button
              type="button"
              onClick={handleScrollToProducts}
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
              animate={{ x: magneticOffset.x, y: magneticOffset.y }}
              transition={{ type: 'spring', stiffness: 220, damping: 14, mass: 0.15 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center justify-center gap-space-sm px-space-xl py-3.5 rounded-xl bg-primary-container dark:bg-emerald-700 dark:hover:bg-emerald-600 text-on-primary hover:bg-[#204613] hover:shadow-lg active:scale-95 transform transition-all duration-300 shadow-md group cursor-pointer"
            >
              <span className="font-label-lg text-label-lg font-bold">{t('hero.browseProducts')}</span>
              <ArrowDown className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-0.5" />
            </motion.button>
          </div>

          {/* بطاقات الإحصائيات السريعة بتأثير زجاجي ناعم وتفاعل حركي خفيف */}
          <div className="w-full pt-space-md">
            <div className="grid grid-cols-3 gap-2 md:gap-space-md bg-white/75 backdrop-blur-md border border-emerald-900/10 p-2 sm:p-space-md rounded-2xl shadow-xs dark:bg-[#122019]/80 dark:border-emerald-800/40">
              
              {/* إحصائية عدد المزارع المعتمدة مع عداد تصاعدي سلس */}
              <motion.div
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="flex flex-col items-center justify-center py-1.5 md:py-space-xs px-1 cursor-default rounded-xl transition-colors"
              >
                <div className="flex items-center gap-1 sm:gap-1.5 text-primary dark:text-emerald-300">
                  <Mountain className="w-4 h-4 md:w-5 md:h-5 text-primary dark:text-emerald-300" />
                  <span className="text-base sm:text-headline-md font-bold">
                    <AnimatedNumber target={42} prefix="+" />
                  </span>
                </div>
                <span className="text-[10px] sm:text-label-sm text-on-surface-variant dark:text-gray-400 mt-1 text-center line-clamp-1 sm:line-clamp-none">
                  {t('hero.statsFarmsLabel')}
                </span>
              </motion.div>

              {/* إحصائية تقييم الجودة التخصصية مع عداد تصاعدي سلس */}
              <motion.div
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="flex flex-col items-center justify-center py-1.5 md:py-space-xs px-1 bg-emerald-900/[0.04] dark:bg-emerald-900/20 rounded-xl cursor-default transition-colors"
              >
                <div className="flex items-center gap-1 sm:gap-1.5 text-primary dark:text-emerald-300">
                  <Award className="w-4 h-4 md:w-5 md:h-5 text-primary dark:text-emerald-300" />
                  <span className="text-base sm:text-headline-md font-bold">
                    <AnimatedNumber target={85} suffix="+" />
                  </span>
                </div>
                <span className="text-[10px] sm:text-label-sm text-on-surface-variant dark:text-gray-400 mt-1 text-center line-clamp-1 sm:line-clamp-none">
                  {t('hero.statsScoringLabel')}
                </span>
              </motion.div>

              {/* إحصائية الأصالة والنقاء مع عداد تصاعدي سلس */}
              <motion.div
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="flex flex-col items-center justify-center py-1.5 md:py-space-xs px-1 cursor-default rounded-xl transition-colors"
              >
                <div className="flex items-center gap-1 sm:gap-1.5 text-primary dark:text-emerald-300">
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary dark:text-emerald-300" />
                  <span className="text-base sm:text-headline-md font-bold">
                    <AnimatedNumber target={100} suffix="%" />
                  </span>
                </div>
                <span className="text-[10px] sm:text-label-sm text-on-surface-variant dark:text-gray-400 mt-1 text-center line-clamp-1 sm:line-clamp-none">
                  {t('hero.statsExperienceLabel')}
                </span>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
