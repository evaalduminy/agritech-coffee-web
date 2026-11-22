import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sliders,
  X,
  Sun,
  Moon,
  Globe,
  Languages,
  Sparkles,
  Eye,
  RotateCcw,
  Palette,
  Layers,
  Square,
  Circle,
  Check,
  Zap,
  ShieldCheck,
  Save,
  Lock,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';

// مكوّن لوحة إعدادات المنصة والمظهر المفصولة حسب الصلاحية مع دعم كامل للترجمة
export default function SettingsDrawer() {
  const {
    settings,
    updateSetting,
    resetSettings,
    isSettingsOpen,
    closeSettings,
    t,
    isEnglish,
  } = useSettings();

  // جلب حالة المستخدم والصلاحية من سياق المصادقة
  const { isAdmin } = useAuth();

  // حالة عرض تأكيد الحفظ والتعميم للمالك
  const [saveSuccess, setSaveSuccess] = useState(false);

  // إغلاق النافذة عند الضغط على زر Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSettingsOpen) {
        closeSettings();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen, closeSettings]);

  // دالة حفظ وتعميم الإعدادات للمالك (مؤقتاً حفظ محلي لحين الربط مع مسار PUT /api/admin/settings)
  const handleAdminSaveAndBroadcast = () => {
    try {
      localStorage.setItem('agritech_settings', JSON.stringify(settings));
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2500);
    } catch (error) {
      console.error('فشل حفظ إعدادات الهوية العامة:', error);
    }
  };

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[110] flex">
          {/* الخلفية المعتمة مع تأثير التغبيش */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeSettings}
            className="fixed inset-0 z-[110] bg-black/45 backdrop-blur-sm"
          />

          {/* اللوحة الجانبية المنزلقة */}
          <motion.aside
            initial={{ x: isEnglish ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isEnglish ? '-100%' : '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            aria-label={t('settings.title')}
            className="relative rtl:mr-auto ltr:ml-auto h-full w-full sm:w-[460px] max-w-full bg-surface shadow-2xl flex flex-col border-r border-surface-container overflow-hidden z-[111] text-start"
          >
            {/* 1. ترويسة اللوحة الجانبية */}
            <div className="p-space-lg border-b border-surface-container flex items-center justify-between bg-surface-container-low shrink-0">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shadow-xs">
                  <Sliders className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                      {t('settings.title')}
                    </h2>
                    {isAdmin && (
                      <span className="px-2 py-0.5 rounded-md bg-primary text-on-primary text-[10px] font-bold">
                        {t('settings.ownerBadge')}
                      </span>
                    )}
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {isAdmin
                      ? t('settings.subtitleAdmin')
                      : t('settings.subtitlePersonal')}
                  </span>
                </div>
              </div>

              {/* زر الإغلاق */}
              <button
                type="button"
                onClick={closeSettings}
                aria-label={t('settings.closeSettings')}
                className="w-9 h-9 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. محتوى الإعدادات القابل للتمرير */}
            <div className="flex-1 overflow-y-auto p-space-lg space-y-6 scrollbar-none">
              
              {/* ======================================================== */}
              {/* القسم الأول: التفضيلات الشخصية (متاح للجميع) */}
              {/* ======================================================== */}
              <div className="space-y-4">
                <div className="border-b border-surface-container pb-2">
                  <h3 className="font-headline-sm text-[15px] text-on-surface font-bold">
                    {t('settings.sectionPersonal')}
                  </h3>
                  <span className="text-xs text-on-surface-variant">
                    {t('settings.sectionPersonalDesc')}
                  </span>
                </div>

                {/* خيار الوضع العام (نهاري / ليلي) */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-on-surface font-label-md text-label-md font-semibold">
                    <Sun className="w-4 h-4 text-primary" />
                    <span>{t('settings.themeMode')}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => updateSetting('themeMode', 'light')}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                        settings.themeMode === 'light'
                          ? 'border-primary bg-primary-container text-on-primary shadow-xs'
                          : 'border-surface-container bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <Sun className="w-4 h-4" />
                      <span>{t('settings.lightMode')}</span>
                      {settings.themeMode === 'light' && <Check className="w-3.5 h-3.5 rtl:mr-auto ltr:ml-auto" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => updateSetting('themeMode', 'dark')}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                        settings.themeMode === 'dark'
                          ? 'border-primary bg-primary-container text-on-primary shadow-xs'
                          : 'border-surface-container bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <Moon className="w-4 h-4" />
                      <span>{t('settings.darkMode')}</span>
                      {settings.themeMode === 'dark' && <Check className="w-3.5 h-3.5 rtl:mr-auto ltr:ml-auto" />}
                    </button>
                  </div>
                </div>

                {/* خيار لغة الواجهة */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-on-surface font-label-md text-label-md font-semibold">
                    <Globe className="w-4 h-4 text-primary" />
                    <span>{t('settings.language')}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => updateSetting('language', 'ar')}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                        settings.language === 'ar'
                          ? 'border-primary bg-primary-container text-on-primary shadow-xs'
                          : 'border-surface-container bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <Languages className="w-4 h-4" />
                      <span>{t('settings.langArabic')}</span>
                      {settings.language === 'ar' && <Check className="w-3.5 h-3.5 rtl:mr-auto ltr:ml-auto" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => updateSetting('language', 'en')}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                        settings.language === 'en'
                          ? 'border-primary bg-primary-container text-on-primary shadow-xs'
                          : 'border-surface-container bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <Globe className="w-4 h-4" />
                      <span>{t('settings.langEnglish')}</span>
                      {settings.language === 'en' && <Check className="w-3.5 h-3.5 rtl:mr-auto ltr:ml-auto" />}
                    </button>
                  </div>
                </div>

                {/* خيارات الحركات التفاعلية الدقيقة */}
                <div className="space-y-3 pt-3 border-t border-surface-container">
                  <div className="flex items-center gap-2 text-on-surface font-label-md text-label-md font-semibold">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>{t('settings.sectionMicroInteractions')}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    {t('settings.sectionMicroInteractionsDesc')}
                  </p>

                  <div className="space-y-2.5">
                    {/* مفتاح تبديل تأثير الطيران للسلة */}
                    <div className="flex items-center justify-between p-3 rounded-xl border border-surface-container bg-surface-container-low">
                      <div className="flex flex-col pr-2 rtl:pr-0 rtl:pl-2">
                        <span className="font-bold text-sm text-on-surface">{t('settings.enableFlyToCart')}</span>
                        <span className="text-xs text-on-surface-variant mt-0.5">{t('settings.enableFlyToCartDesc')}</span>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={settings.enableFlyToCart}
                        onClick={() => updateSetting('enableFlyToCart', !settings.enableFlyToCart)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          settings.enableFlyToCart ? 'bg-primary dark:bg-emerald-600' : 'bg-surface-container-high dark:bg-emerald-950/80'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            settings.enableFlyToCart
                              ? 'rtl:-translate-x-5 ltr:translate-x-5'
                              : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* مفتاح تبديل ميلان 3D للبطاقات */}
                    <div className="flex items-center justify-between p-3 rounded-xl border border-surface-container bg-surface-container-low">
                      <div className="flex flex-col pr-2 rtl:pr-0 rtl:pl-2">
                        <span className="font-bold text-sm text-on-surface">{t('settings.enableCard3DTilt')}</span>
                        <span className="text-xs text-on-surface-variant mt-0.5">{t('settings.enableCard3DTiltDesc')}</span>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={settings.enableCard3DTilt}
                        onClick={() => updateSetting('enableCard3DTilt', !settings.enableCard3DTilt)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          settings.enableCard3DTilt ? 'bg-primary dark:bg-emerald-600' : 'bg-surface-container-high dark:bg-emerald-950/80'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            settings.enableCard3DTilt
                              ? 'rtl:-translate-x-5 ltr:translate-x-5'
                              : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* القسم الثاني: إعدادات هوية المنصة (للمالك فقط) */}
              {/* ======================================================== */}
              {isAdmin ? (
                <div className="space-y-5 pt-4 border-t border-surface-container">
                  <div className="flex items-center justify-between border-b border-surface-container pb-2">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <h3 className="font-headline-sm text-[15px] text-on-surface font-bold">
                          {t('settings.sectionIdentity')}
                        </h3>
                      </div>
                      <span className="text-xs text-on-surface-variant">
                        {t('settings.sectionIdentityDesc')}
                      </span>
                    </div>
                  </div>

                  {/* 1. نسق ألوان المنصة */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-on-surface font-label-md text-label-md font-semibold">
                      <Palette className="w-4 h-4 text-primary" />
                      <span>{t('settings.colorPalette')}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {/* نسق الأخضر الغابي */}
                      <button
                        type="button"
                        onClick={() => updateSetting('colorTheme', 'agritech')}
                        className={`flex items-center justify-between p-3 rounded-xl border text-start transition-all cursor-pointer ${
                          settings.colorTheme === 'agritech'
                            ? 'border-primary bg-surface-container-high'
                            : 'border-surface-container bg-surface-container-low hover:bg-surface-container'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center -space-x-1.5 rtl:space-x-reverse">
                            <span className="w-5 h-5 rounded-full bg-[#185004] border-2 border-surface" />
                            <span className="w-5 h-5 rounded-full bg-[#31691d] border-2 border-surface" />
                            <span className="w-5 h-5 rounded-full bg-[#a7e78b] border-2 border-surface" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-on-surface">{t('settings.themeAgriTech')}</span>
                            <span className="text-xs text-on-surface-variant">{t('settings.themeAgriTechDesc')}</span>
                          </div>
                        </div>
                        {settings.colorTheme === 'agritech' && <Check className="w-4 h-4 text-primary" />}
                      </button>

                      {/* نسق البن المحمص والذهبي */}
                      <button
                        type="button"
                        onClick={() => updateSetting('colorTheme', 'roasted')}
                        className={`flex items-center justify-between p-3 rounded-xl border text-start transition-all cursor-pointer ${
                          settings.colorTheme === 'roasted'
                            ? 'border-primary bg-surface-container-high'
                            : 'border-surface-container bg-surface-container-low hover:bg-surface-container'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center -space-x-1.5 rtl:space-x-reverse">
                            <span className="w-5 h-5 rounded-full bg-[#5c381e] border-2 border-surface" />
                            <span className="w-5 h-5 rounded-full bg-[#8c532b] border-2 border-surface" />
                            <span className="w-5 h-5 rounded-full bg-[#fed6a7] border-2 border-surface" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-on-surface">{t('settings.themeRoasted')}</span>
                            <span className="text-xs text-on-surface-variant">{t('settings.themeRoastedDesc')}</span>
                          </div>
                        </div>
                        {settings.colorTheme === 'roasted' && <Check className="w-4 h-4 text-primary" />}
                      </button>

                      {/* نسق الفحمي الكلاسيكي */}
                      <button
                        type="button"
                        onClick={() => updateSetting('colorTheme', 'obsidian')}
                        className={`flex items-center justify-between p-3 rounded-xl border text-start transition-all cursor-pointer ${
                          settings.colorTheme === 'obsidian'
                            ? 'border-primary bg-surface-container-high'
                            : 'border-surface-container bg-surface-container-low hover:bg-surface-container'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center -space-x-1.5 rtl:space-x-reverse">
                            <span className="w-5 h-5 rounded-full bg-[#24292e] border-2 border-surface" />
                            <span className="w-5 h-5 rounded-full bg-[#38414e] border-2 border-surface" />
                            <span className="w-5 h-5 rounded-full bg-[#9da7b3] border-2 border-surface" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-on-surface">{t('settings.themeObsidian')}</span>
                            <span className="text-xs text-on-surface-variant">{t('settings.themeObsidianDesc')}</span>
                          </div>
                        </div>
                        {settings.colorTheme === 'obsidian' && <Check className="w-4 h-4 text-primary" />}
                      </button>
                    </div>
                  </div>

                  {/* 2. نمط انحناء الأزرار والبطاقات */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-on-surface font-label-md text-label-md font-semibold">
                      <Layers className="w-4 h-4 text-primary" />
                      <span>{t('settings.buttonShape')}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => updateSetting('buttonStyle', 'soft')}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          settings.buttonStyle === 'soft'
                            ? 'border-primary bg-primary-container text-on-primary shadow-xs'
                            : 'border-surface-container bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        <Square className="w-4 h-4 mb-1 rounded-sm" />
                        <span className="text-xs font-bold">{t('settings.shapeSoft')}</span>
                        <span className="text-[10px] opacity-80">{t('settings.defaultBadge')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateSetting('buttonStyle', 'pill')}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          settings.buttonStyle === 'pill'
                            ? 'border-primary bg-primary-container text-on-primary shadow-xs'
                            : 'border-surface-container bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        <Circle className="w-4 h-4 mb-1" />
                        <span className="text-xs font-bold">{t('settings.shapePill')}</span>
                        <span className="text-[10px] opacity-80">(Pill)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateSetting('buttonStyle', 'sharp')}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          settings.buttonStyle === 'sharp'
                            ? 'border-primary bg-primary-container text-on-primary shadow-xs'
                            : 'border-surface-container bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        <Square className="w-4 h-4 mb-1" />
                        <span className="text-xs font-bold">{t('settings.shapeSharp')}</span>
                        <span className="text-[10px] opacity-80">(Sharp)</span>
                      </button>
                    </div>
                  </div>

                  {/* 3. خلفية الواجهة الترحيبية */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-on-surface font-label-md text-label-md font-semibold">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span>{t('settings.heroEffects')}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => updateSetting('heroBackground', 'particles')}
                        className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                          settings.heroBackground === 'particles'
                            ? 'border-primary bg-primary-container text-on-primary shadow-xs'
                            : 'border-surface-container bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        <Zap className="w-4 h-4 mb-1" />
                        <span className="text-xs font-bold">{t('settings.heroParticles')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateSetting('heroBackground', 'ambient')}
                        className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                          settings.heroBackground === 'ambient'
                            ? 'border-primary bg-primary-container text-on-primary shadow-xs'
                            : 'border-surface-container bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        <Sparkles className="w-4 h-4 mb-1" />
                        <span className="text-xs font-bold">{t('settings.heroAmbient')}</span>
                        <span className="text-[10px] opacity-80">{t('settings.defaultBadge')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateSetting('heroBackground', 'minimal')}
                        className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                          settings.heroBackground === 'minimal'
                            ? 'border-primary bg-primary-container text-on-primary shadow-xs'
                            : 'border-surface-container bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        <Eye className="w-4 h-4 mb-1" />
                        <span className="text-xs font-bold">{t('settings.heroMinimal')}</span>
                      </button>
                    </div>
                  </div>

                  {/* 4. نمط مؤشر التحميل والانتقال */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-on-surface font-label-md text-label-md font-semibold">
                      <Zap className="w-4 h-4 text-primary" />
                      <span>{t('settings.loaderStyle')}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => updateSetting('loaderStyle', 'logo')}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          settings.loaderStyle === 'logo'
                            ? 'border-primary bg-primary-container text-on-primary shadow-xs'
                            : 'border-surface-container bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        <Sparkles className="w-4 h-4 mb-1" />
                        <span className="text-xs font-bold">{t('settings.loaderLogo')}</span>
                        <span className="text-[10px] opacity-80">{t('settings.defaultBadge')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateSetting('loaderStyle', 'bar')}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          settings.loaderStyle === 'bar'
                            ? 'border-primary bg-primary-container text-on-primary shadow-xs'
                            : 'border-surface-container bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        <div className="w-5 h-1 bg-current rounded-full mb-2.5" />
                        <span className="text-xs font-bold">{t('settings.loaderBar')}</span>
                        <span className="text-[10px] opacity-80">(Top Bar)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateSetting('loaderStyle', 'none')}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          settings.loaderStyle === 'none'
                            ? 'border-primary bg-primary-container text-on-primary shadow-xs'
                            : 'border-surface-container bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        <Zap className="w-4 h-4 mb-1" />
                        <span className="text-xs font-bold">{t('settings.loaderNone')}</span>
                        <span className="text-[10px] opacity-80">{t('settings.loaderNoneDesc')}</span>
                      </button>
                    </div>
                  </div>

                  {/* 5. زر حفظ وتعميم الإعدادات على المنصة */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleAdminSaveAndBroadcast}
                      className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-[#204613] text-on-primary font-label-md text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      {saveSuccess ? (
                        <>
                          <Check className="w-4 h-4 text-on-primary" />
                          <span>{t('settings.savedSuccess')}</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 text-on-primary" />
                          <span>{t('settings.saveAndBroadcast')}</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-on-surface-variant text-center mt-1.5">
                      {t('settings.apiBindingNote')}
                    </p>
                  </div>
                </div>
              ) : (
                /* تلميح أنيق لغير المالك */
                <div className="pt-2 border-t border-surface-container">
                  <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex items-center gap-2.5 text-on-surface-variant">
                    <Lock className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-xs leading-relaxed">
                      {t('settings.ownerOnlyNotice')}
                    </span>
                  </div>
                </div>
              )}

            </div>

            {/* 3. أسفل اللوحة: زر استعادة الإعدادات الافتراضية */}
            <div className="p-space-lg border-t border-surface-container bg-surface-container-low shrink-0">
              <button
                type="button"
                onClick={resetSettings}
                className="w-full py-3 px-4 rounded-xl border border-surface-container hover:bg-surface-container text-on-surface font-label-md text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <RotateCcw className="w-4 h-4 text-primary" />
                <span>{t('settings.resetDefaults')}</span>
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
