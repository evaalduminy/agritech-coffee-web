import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowUp } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { openWhatsAppSupport } from '../../services/whatsapp';

// مكوّن الأزرار العائمة الذكية: زر دعم واتساب بنبض خفيف وزر العودة للأعلى
export default function FloatingActions() {
  const { t } = useSettings();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // مراقبة تمرير الصفحة لإظهار زر العودة للأعلى بعد تجاوز 350 بكسل
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // دالة التمرير السلس إلى أعلى الصفحة
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // دالة فتح محادثة الدعم الفني الفوري عبر واتساب
  const handleWhatsAppClick = () => {
    openWhatsAppSupport(t('floating.supportMessage'));
  };

  return (
    <aside
      aria-label="إجراءات المساعدة السريعة"
      className="fixed bottom-5 sm:bottom-6 rtl:left-5 rtl:sm:left-6 ltr:right-5 ltr:sm:right-6 z-40 flex flex-col items-center gap-2.5 sm:gap-3 select-none pointer-events-auto"
    >
      {/* 1. زر العودة للأعلى يظهر بنعومة فقط عند التمرير لأسفل */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="scroll-top-button"
            type="button"
            onClick={handleScrollToTop}
            aria-label={t('floating.scrollToTop')}
            title={t('floating.scrollToTop')}
            initial={{ scale: 0, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/85 dark:bg-[#122019]/85 backdrop-blur-md border border-emerald-900/10 dark:border-emerald-400/20 text-on-surface hover:text-white hover:bg-primary dark:hover:bg-emerald-600 shadow-lg flex items-center justify-center cursor-pointer transition-colors"
          >
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 2. زر دعم واتساب العائم بنبض خفيف وتلميح نصي */}
      <div className="relative group flex items-center">
        {/* حلقة النبض الخافتة في الخلفية */}
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-25 pointer-events-none" />

        <button
          type="button"
          onClick={handleWhatsAppClick}
          aria-label={t('floating.whatsappSupport')}
          className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-900/25 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95"
        >
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        {/* تلميح التوجيه السريع يظهر عند مرور المؤشر على سطح المكتب */}
        <div className="hidden sm:group-hover:flex absolute rtl:left-full ltr:right-full mx-3 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-[#0d1812]/90 backdrop-blur-md border border-emerald-900/10 dark:border-emerald-400/20 text-xs text-on-surface dark:text-white font-semibold shadow-lg whitespace-nowrap pointer-events-none">
          {t('floating.whatsappTooltip')}
        </div>
      </div>
    </aside>
  );
}
