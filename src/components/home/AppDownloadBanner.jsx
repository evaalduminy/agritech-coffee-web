import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Download, Bell, X } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { SITE_CONFIG } from '../../config/siteConfig';

// مكوّن بانر تحميل التطبيق الزراعي للهواتف الذكية مع إشعار التوفر القريب
export default function AppDownloadBanner() {
  const { t } = useSettings();

  // حالة إظهار التنبيه التوضيحي للتحميل
  const [showToast, setShowToast] = useState(false);

  // إخفاء التنبيه تلقائياً بعد 3.5 ثوانٍ
  useEffect(() => {
    let timer;
    if (showToast) {
      timer = setTimeout(() => {
        setShowToast(false);
      }, 3500);
    }
    return () => clearTimeout(timer);
  }, [showToast]);

  // معالجة النقر على زر متجر Google Play
  const handlePlayStoreClick = () => {
    if (SITE_CONFIG.appDownload.playStoreUrl) {
      window.open(SITE_CONFIG.appDownload.playStoreUrl, '_blank', 'noopener,noreferrer');
    } else {
      setShowToast(true);
    }
  };

  // معالجة النقر على زر تحميل ملف APK المباشر
  const handleApkClick = () => {
    if (SITE_CONFIG.appDownload.apkUrl) {
      window.open(SITE_CONFIG.appDownload.apkUrl, '_blank', 'noopener,noreferrer');
    } else {
      setShowToast(true);
    }
  };

  return (
    <section className="w-full py-8 sm:py-12 bg-transparent">
      <div className="max-w-7xl mx-auto px-margin">
        <div className="relative rounded-3xl p-6 sm:p-8 lg:p-10 overflow-hidden bg-gradient-to-br from-[#142610] via-[#102d1a] to-[#0a1c10] text-white shadow-xl border border-[#DCE5D8] dark:border-emerald-800/40">
          
          {/* لمسات إضاءة هادئة في خلفية البانر */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-[#FEF3C7]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8 text-start">
            
            {/* الجهة اليمنى: أيقونة تطبيق أجري تك الرسمية مع العنوان والوصف */}
            <div className="flex items-start sm:items-center gap-4 sm:gap-5 flex-1">
              {/* إطار أيقونة تطبيق أجري تك المعتمدة بحواف ناعمة وظل خفيف */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-2 shadow-md border border-white/20 shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src="/images/agritech-app-icon.png"
                  alt={t('appBanner.title')}
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h3 className="font-headline-sm text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {t('appBanner.title')}
                </h3>
                <p className="font-body-md text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-xl leading-relaxed">
                  {t('appBanner.desc')}
                </p>
              </div>
            </div>

            {/* الجهة اليسرى: زرا التحميل المتناسقان */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* زر متجر Google Play */}
              <button
                type="button"
                onClick={handlePlayStoreClick}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 active:scale-95 transition-all text-xs sm:text-sm font-bold shadow-md cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{t('appBanner.googlePlay')}</span>
              </button>

              {/* زر تحميل ملف APK المباشر */}
              <button
                type="button"
                onClick={handleApkClick}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/20 transition-all text-xs sm:text-sm font-semibold cursor-pointer backdrop-blur-md"
              >
                <Download className="w-4 h-4" />
                <span>{t('appBanner.directApk')}</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* التنبيه المنبثق المؤقت عند محاولة التحميل */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 inset-x-4 max-w-md mx-auto z-50 p-3.5 rounded-2xl bg-black/90 backdrop-blur-md text-white text-xs sm:text-sm font-bold border border-emerald-500/40 shadow-2xl flex items-center justify-between gap-3 text-start"
          >
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t('appBanner.comingSoonToast')}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowToast(false)}
              aria-label="إغلاق التنبيه"
              className="text-white/60 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
