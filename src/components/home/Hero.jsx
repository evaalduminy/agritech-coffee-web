import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  BadgeCheck,
  ArrowDown,
  Mountain,
  Award,
  ShieldCheck,
  Compass,
  Check,
  Sparkles,
  PhoneCall,
  Search,
  ShoppingBag,
  Sprout,
} from 'lucide-react';
import HeroAmbientBackground from './HeroAmbientBackground';
import HeroParticlesBackground from './HeroParticlesBackground';
import { useSettings } from '../../context/SettingsContext';
import { mockProducts } from '../../data/mockData';

// مكوّن الواجهة الترحيبية العصري المفتوح بمجسم هاتف ثلاثي الأبعاد وكرات زجاجية وإحصائيات عائمة
export default function Hero({
  onSelectProduct = () => {},
  onOpenFarmersModal = () => {},
}) {
  const { t, settings, isEnglish } = useSettings();
  const heroBg = settings?.heroBackground || 'ambient';

  // تتبع إحداثيات مؤشر الماوس للمجسم ثلاثي الأبعاد والكرات العائمة
  const heroContainerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // نوابض فيزيائية ناعمة وسريعة الاستجابة لزوايا الميلان
  const springConfig = { stiffness: 180, damping: 24 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // زوايا دوران مجسم الهاتف ثلاثي الأبعاد
  const phoneRotateX = useTransform(smoothMouseY, [-0.5, 0.5], ['10deg', '-10deg']);
  const phoneRotateY = useTransform(smoothMouseX, [-0.5, 0.5], ['-16deg', '8deg']);

  // حركة عمق Parallax خفيفة للكرات الزجاجية الثلاث
  const sphere1X = useTransform(smoothMouseX, [-0.5, 0.5], ['-18px', '18px']);
  const sphere1Y = useTransform(smoothMouseY, [-0.5, 0.5], ['-16px', '16px']);

  const sphere2X = useTransform(smoothMouseX, [-0.5, 0.5], ['22px', '-22px']);
  const sphere2Y = useTransform(smoothMouseY, [-0.5, 0.5], ['18px', '-18px']);

  const sphere3X = useTransform(smoothMouseX, [-0.5, 0.5], ['-12px', '12px']);
  const sphere3Y = useTransform(smoothMouseY, [-0.5, 0.5], ['14px', '-14px']);

  // لمعة الإضاءة الزجاجية فوق شاشة الهاتف
  const [phoneGlare, setPhoneGlare] = useState({ x: 50, y: 50, opacity: 0 });

  // تفاعل الزر المغناطيسي
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });

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

  const handleMagneticLeave = () => {
    setMagneticOffset({ x: 0, y: 0 });
  };

  // معالجة حركة الماوس العامة في القسم الترحيبي
  const handleHeroMouseMove = (e) => {
    if (!heroContainerRef.current) return;
    const rect = heroContainerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(xPct);
    mouseY.set(yPct);

    setPhoneGlare({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      opacity: 0.35,
    });
  };

  const handleHeroMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setPhoneGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  // دالة التمرير السلس إلى شبكة المحاصيل
  const handleScrollToProducts = () => {
    const productsSection = document.getElementById('coffee-products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // فتح نافذة بوابة المزارعين
  const handleOpenFarmers = () => {
    if (onOpenFarmersModal) {
      onOpenFarmersModal();
    }
    window.dispatchEvent(new CustomEvent('open-farmers-modal'));
  };

  // اختيار أول 4 محاصيل حقيقية لعرضها في الشاشة المصغرة للهاتف
  const miniCrops = mockProducts.slice(0, 4);

  return (
    <section
      ref={heroContainerRef}
      onMouseMove={handleHeroMouseMove}
      onMouseLeave={handleHeroMouseLeave}
      className="relative w-full overflow-hidden bg-transparent pt-28 md:pt-36 pb-16 md:pb-24 transition-colors duration-300"
    >
      {/* خلفية الواجهة الترحيبية التفاعلية حسب الإعداد المختار */}
      {heroBg === 'particles' && <HeroParticlesBackground />}
      {heroBg === 'ambient' && <HeroAmbientBackground />}

      {/* نقشة هندسية ناعمة من النقاط الخافتة في الخلفية */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06] dark:opacity-[0.08]"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* 3 كرات زجاجية لامعة ثلاثية الأبعاد تطفو في الخلفية مع حركة Parallax */}
      {/* الكرة 1: كرة بتدرج أخضر زراعي ناعم */}
      <motion.div
        style={{ x: sphere1X, y: sphere1Y }}
        animate={{ y: [0, -14, 0], x: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute top-16 rtl:right-10 ltr:left-10 w-32 h-32 sm:w-44 sm:h-44 rounded-full z-0 opacity-80 dark:opacity-90"
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background:
              'radial-gradient(circle at 35% 28%, #A8C99B, rgba(168, 201, 155, 0.6) 45%, #4F8A3A 85%)',
            boxShadow:
              '0 25px 50px -12px rgba(49, 105, 29, 0.45), inset -6px -6px 14px rgba(0, 0, 0, 0.4), inset 6px 6px 14px rgba(255, 255, 255, 0.5)',
          }}
        />
      </motion.div>

      {/* الكرة 2: كرة كهرمانية دافئة وسط المشهد */}
      <motion.div
        style={{ x: sphere2X, y: sphere2Y }}
        animate={{ y: [0, 12, 0], x: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="pointer-events-none absolute top-1/2 rtl:right-1/3 ltr:left-1/3 w-20 h-20 sm:w-28 sm:h-28 rounded-full z-0 opacity-75 dark:opacity-85"
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background:
              'radial-gradient(circle at 35% 30%, rgba(245, 158, 11, 0.65), rgba(217, 119, 6, 0.28) 50%, rgba(120, 53, 15, 0.45) 88%)',
            boxShadow:
              '0 20px 40px -10px rgba(180, 83, 9, 0.4), inset -4px -4px 10px rgba(0, 0, 0, 0.4), inset 5px 5px 12px rgba(255, 255, 255, 0.4)',
          }}
        />
      </motion.div>

      {/* الكرة 3: كرة بتدرج أخضر زراعي عميق متناسق */}
      <motion.div
        style={{ x: sphere3X, y: sphere3Y }}
        animate={{ y: [0, -10, 0], x: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="pointer-events-none absolute bottom-10 rtl:left-12 ltr:right-12 w-36 h-36 sm:w-48 sm:h-48 rounded-full z-0 opacity-70 dark:opacity-85"
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background:
              'radial-gradient(circle at 32% 28%, #A8C99B 15%, #4F8A3A 75%, #31691D 95%)',
            boxShadow:
              '0 30px 60px -15px rgba(49, 105, 29, 0.5), inset -8px -8px 16px rgba(0, 0, 0, 0.45), inset 8px 8px 16px rgba(255, 255, 255, 0.4)',
          }}
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-margin relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ============================================================== */}
          {/* الجهة اليمنى: النصوص والأزرار المفتوحة بدون أي صناديق تخنق النص */}
          {/* ============================================================== */}
          <div className="lg:col-span-7 flex flex-col items-start text-start">
            
            {/* شارة AgriMarket الزجاجية الراقية مع أيقونة Sprout ونقطة المؤشر */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-emerald-950/70 backdrop-blur-md border border-[#DCE5D8] dark:border-emerald-400/25 shadow-xs text-xs font-semibold mb-3">
              <div className="w-5 h-5 rounded-lg bg-[#31691D] hover:bg-[#255215] flex items-center justify-center text-white shadow-xs ring-1 ring-[#31691D]/20 transition-colors">
                <Sprout className="w-3.5 h-3.5" />
              </div>
              <span dir="ltr" className="inline-flex items-baseline font-bold tracking-tight">
                <span className="font-extrabold text-[#1A2B15] dark:text-white">Agri</span>
                <span className="font-extrabold text-[#31691D] dark:text-[#7BC662]">Market</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#31691D] animate-pulse" />
              <span className="text-secondary dark:text-emerald-300/80 text-[11px] font-medium border-r rtl:border-r-0 rtl:border-l border-[#DCE5D8] dark:border-emerald-400/20 px-1.5">
                {isEnglish ? 'Smart Agricultural Marketplace' : 'منصة التسويق الزراعي'}
              </span>
            </div>

            {/* الشارة التوثيقية العلوية الزجاجية بالخلفية الفاتحة المعتمدة */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9F2E4] dark:bg-[#142610] backdrop-blur-md border border-[#31691D]/20 dark:border-[#7BC662]/30 text-[#31691D] dark:text-[#7BC662] shadow-xs text-xs font-semibold">
              <BadgeCheck className="w-4 h-4 text-[#31691D] dark:text-[#7BC662]" />
              <span>{t('hero.badge')}</span>
            </div>

            {/* العنوان الرئيسي الجريء مع لمسة تدرج خفيفة على اسم المنصة */}
            <h1 className="font-headline-lg text-3xl sm:text-4xl lg:text-[44px] lg:leading-[54px] font-black text-[#1A2B15] dark:text-white tracking-tight mt-4 mb-3">
              <span className="block text-sm sm:text-base font-bold text-[#31691D] dark:text-[#7BC662] mb-1.5 tracking-normal">
                {isEnglish ? 'Welcome to ' : 'مرحباً بكم في '}
                <span dir="ltr" className="inline-flex items-baseline font-extrabold bg-gradient-to-r from-[#31691D] via-[#4F8A3A] to-[#7BC662] dark:from-[#7BC662] dark:via-emerald-300 dark:to-emerald-200 bg-clip-text text-transparent">
                  AgriMarket
                </span>
                <span className="text-on-surface-variant/60 dark:text-emerald-300/40 font-normal mx-1.5">|</span>
                <span className="font-medium text-xs sm:text-sm text-secondary dark:text-emerald-300/80">
                  {isEnglish ? 'Specialty Agricultural Hub' : 'وجهة المحاصيل الزراعية الفاخرة'}
                </span>
              </span>
              {t('hero.title')}
            </h1>

            {/* شارة التمييز البارزة باللون الدافئ الموحد */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] text-[#D97706] border border-[#D97706]/30 text-xs font-bold shadow-xs mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{t('hero.accentBadge')}</span>
            </div>

            {/* الوصف الإرشادي الواضح للمنصة */}
            <p className="font-body-lg text-base sm:text-lg text-on-surface-variant dark:text-emerald-100/85 leading-relaxed mb-6 max-w-xl">
              {t('hero.description')}
            </p>

            {/* الزر الرئيسي البارز مع التفاعل المغناطيسي والدائرة الخضراء المعتمدة */}
            <motion.button
              type="button"
              onClick={handleScrollToProducts}
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
              animate={{ x: magneticOffset.x, y: magneticOffset.y }}
              transition={{ type: 'spring', stiffness: 220, damping: 14, mass: 0.15 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-between gap-5 px-6 py-3.5 rounded-2xl bg-white text-[#1A2B15] hover:bg-[#F4F7F2] active:scale-95 transition-all shadow-xl shadow-emerald-950/15 border border-[#DCE5D8] dark:border-white/80 cursor-pointer group mb-3.5"
            >
              <div className="flex flex-col text-start">
                <span className="font-bold text-base sm:text-lg text-[#1A2B15] leading-tight">
                  {t('hero.browseStore')}
                </span>
                <span className="text-[11px] text-[#556650] font-semibold mt-0.5">
                  {t('hero.browseSubtext')}
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#31691D] group-hover:bg-[#255215] text-white flex items-center justify-center shrink-0 group-hover:translate-y-0.5 transition-colors shadow-sm">
                <ArrowDown className="w-4 h-4" />
              </div>
            </motion.button>

            {/* الأزرار الثانوية المتناسقة: استكشف المصادر وبوابة المزارعين */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleScrollToProducts}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/40 dark:bg-emerald-950/60 hover:bg-white/60 dark:hover:bg-emerald-900/60 backdrop-blur-md border border-[#DCE5D8] dark:border-emerald-700/40 text-on-surface dark:text-white transition-all text-xs sm:text-sm font-semibold cursor-pointer shadow-xs active:scale-95"
              >
                <Compass className="w-4 h-4 text-[#31691D] dark:text-[#7BC662]" />
                <span>{t('hero.exploreOrigins')}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenFarmers}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FEF3C7] hover:bg-[#fde68a] border border-[#D97706]/30 text-[#D97706] transition-all text-xs sm:text-sm font-bold cursor-pointer shadow-xs active:scale-95"
              >
                <PhoneCall className="w-4 h-4 text-[#D97706]" />
                <span>{t('hero.farmersAppBtn')}</span>
              </button>
            </div>

            {/* سطر الثقة الناعم بثلاث علامات صح في الأسفل */}
            <div className="flex flex-wrap items-center gap-3 pt-6 text-xs text-on-surface-variant dark:text-emerald-200/80 font-medium">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#31691D] dark:text-[#7BC662] stroke-[2.5]" />
                <span>{t('hero.trustVerified')}</span>
              </div>
              <span className="text-[#31691D]/40">•</span>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#31691D] dark:text-[#7BC662] stroke-[2.5]" />
                <span>{t('hero.trustAuthentic')}</span>
              </div>
              <span className="text-[#31691D]/40">•</span>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#31691D] dark:text-[#7BC662] stroke-[2.5]" />
                <span>{t('hero.trustShipping')}</span>
              </div>
            </div>

          </div>

          {/* ============================================================== */}
          {/* الجهة اليسرى: مجسم هاتف 3D تفاعلي مائل + بطاقات إحصائيات عائمة */}
          {/* ============================================================== */}
          <div className="lg:col-span-5 flex items-center justify-center relative pt-6 lg:pt-0">
            
            {/* حاوية المجسم ثلاثي الأبعاد مع منظور العمق */}
            <div style={{ perspective: 1200 }} className="relative flex items-center justify-center">

              {/* 1. البطاقة الإحصائية العائمة العلوية (+42 مزرعة موثقة) */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-3 rtl:-left-4 ltr:-right-4 z-20 pointer-events-none"
              >
                <div className="px-3 py-2 rounded-2xl bg-white/80 dark:bg-[#122019]/90 backdrop-blur-md border border-[#DCE5D8] dark:border-emerald-500/30 text-on-surface dark:text-white shadow-xl flex items-center gap-2 text-start">
                  <div className="w-7 h-7 rounded-lg bg-[#31691D] hover:bg-[#255215] text-white flex items-center justify-center shrink-0 transition-colors">
                    <Mountain className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-black text-xs sm:text-sm text-[#31691D] dark:text-[#7BC662] leading-none">
                      +42
                    </span>
                    <span className="block text-[10px] text-on-surface-variant dark:text-gray-300 font-medium mt-0.5 whitespace-nowrap">
                      {t('hero.statsFarmsLabel')}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* 2. البطاقة الإحصائية العائمة الجانبية (100% أصالة وتوثيق مصدر) */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute top-1/2 rtl:-left-8 ltr:-right-8 z-20 pointer-events-none"
              >
                <div className="px-3 py-2 rounded-2xl bg-white/80 dark:bg-[#122019]/90 backdrop-blur-md border border-[#DCE5D8] dark:border-emerald-500/30 text-on-surface dark:text-white shadow-xl flex items-center gap-2 text-start">
                  <div className="w-7 h-7 rounded-lg bg-[#31691D] hover:bg-[#255215] text-white flex items-center justify-center shrink-0 transition-colors">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-black text-xs sm:text-sm text-[#31691D] dark:text-[#7BC662] leading-none">
                      100%
                    </span>
                    <span className="block text-[10px] text-on-surface-variant dark:text-gray-300 font-medium mt-0.5 whitespace-nowrap">
                      {t('hero.statsAuthenticityLabel')}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* 3. البطاقة الإحصائية العائمة السفلية (85+ تقييم SCAA مختص) باللون الدافئ الموحد */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-4 rtl:-right-6 ltr:-left-6 z-20 pointer-events-none"
              >
                <div className="px-3 py-2 rounded-2xl bg-[#FEF3C7] backdrop-blur-md border border-[#D97706]/30 text-[#D97706] shadow-xl flex items-center gap-2 text-start">
                  <div className="w-7 h-7 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4 text-[#D97706]" />
                  </div>
                  <div>
                    <span className="block font-black text-xs sm:text-sm text-[#D97706] leading-none">
                      85+
                    </span>
                    <span className="block text-[10px] text-[#D97706]/90 font-medium mt-0.5 whitespace-nowrap">
                      {t('hero.statsScoringLabel')}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* مجسم الهاتف ثلاثي الأبعاد المائل باللون الزراعي الداكن #142610 */}
              <motion.div
                style={{
                  rotateX: phoneRotateX,
                  rotateY: phoneRotateY,
                  transformStyle: 'preserve-3d',
                }}
                className="w-[270px] sm:w-[290px] aspect-[9/18.5] rounded-[44px] border-[7px] border-[#142610] dark:border-emerald-700/80 bg-[#142610] p-2.5 shadow-2xl shadow-[#142610]/80 relative overflow-hidden select-none"
              >
                {/* شريط الكاميرا والحساسات العلوي (Dynamic Island) */}
                <div className="w-24 h-4 rounded-full bg-black mx-auto mb-2 flex items-center justify-center gap-1.5 shadow-inner z-20 relative">
                  <span className="w-2 h-2 rounded-full bg-[#142610]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7BC662]" />
                </div>

                {/* شاشة الهاتف الحقيقية المصغّرة لمتجر سوق البن بالخلفية الزراعية الداكنة #142610 */}
                <div className="bg-[#142610] text-white rounded-[34px] p-3 flex flex-col h-[calc(100%-24px)] overflow-hidden">
                  
                  {/* ترويسة التطبيق المصغرة */}
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                    <span className="text-[11px] font-bold text-[#7BC662] truncate">
                      {t('hero.phoneAppTitle')}
                    </span>
                    <div className="w-5 h-5 rounded-md bg-[#31691D] text-[#7BC662] flex items-center justify-center">
                      <ShoppingBag className="w-3 h-3 text-[#7BC662]" />
                    </div>
                  </div>

                  {/* شريط بحث مصغّر داخل التطبيق */}
                  <div className="rounded-xl bg-white/10 px-2.5 py-1.5 text-[9px] text-white/60 flex items-center gap-1.5 mb-2.5">
                    <Search className="w-3 h-3 text-[#7BC662] shrink-0" />
                    <span className="truncate">{t('hero.phoneSearchPlaceholder')}</span>
                  </div>

                  {/* عنوان قائمة المحاصيل داخل الشاشة */}
                  <div className="flex items-center justify-between text-[10px] text-white/80 font-bold mb-1.5">
                    <span>{t('hero.phoneFeaturedTag')}</span>
                    <span className="text-[#7BC662] text-[9px]">• حي</span>
                  </div>

                  {/* شبكة مصغّرة من 4 محاصيل حقيقية قابلة للنقر لفتح التفاصيل مع أسعار ونصوص مميزة #7BC662 */}
                  <div className="grid grid-cols-2 gap-2 flex-1 overflow-hidden">
                    {miniCrops.map((item) => {
                      const itemName = isEnglish ? (item.name_en || item.name) : item.name;
                      return (
                        <div
                          key={item.id}
                          onClick={() => onSelectProduct(item)}
                          className="rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 p-1.5 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] active:scale-95 group text-start"
                        >
                          <div className="w-full aspect-square rounded-lg overflow-hidden bg-black/40 mb-1">
                            <img
                              src={item.image_url}
                              alt={itemName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div>
                            <span className="block text-[9px] font-bold text-white truncate leading-tight">
                              {itemName}
                            </span>
                            <span className="block text-[9px] font-extrabold text-[#7BC662] mt-0.5">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>

                {/* لمعة إضاءة زجاجية تتحرك فوق شاشة الهاتف مع حركة المؤشر */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-[44px] transition-opacity duration-300"
                  style={{
                    opacity: phoneGlare.opacity,
                    background: `radial-gradient(circle 240px at ${phoneGlare.x}% ${phoneGlare.y}%, rgba(255, 255, 255, 0.4), transparent 75%)`,
                  }}
                />
              </motion.div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
