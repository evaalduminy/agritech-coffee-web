import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowUp } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { openWhatsAppSupport } from '../../services/whatsapp';

// مكوّن الأزرار العائمة الذكية: زر دعم واتساب بفقاعة تفاعلية وشارة إشعار وزر العودة للأعلى
export default function FloatingActions() {
  const { t, isEnglish } = useSettings();
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
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/85 dark:bg-[#122019]/85 backdrop-blur-md border border-[#DCE5D8] dark:border-emerald-400/20 text-on-surface hover:text-white hover:bg-[#31691D] dark:hover:bg-[#31691D] shadow-lg flex items-center justify-center cursor-pointer transition-colors"
          >
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 2. زر دعم واتساب العائم بالأخضر (#25D366) مع الفقاعة التفاعلية وشارة الإشعار */}
      <div className="flex items-center gap-2.5">
        {/* فقاعة النص الجانبية بنمط Glassmorphism (تتكيف مع الوضعين وظاهرة للشاشات المتوسطة والكبيرة) */}
        <div
          onClick={handleWhatsAppClick}
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-[#122019]/90 backdrop-blur-md border border-[#DCE5D8] dark:border-emerald-400/20 text-[#1A2B15] dark:text-white shadow-xl cursor-pointer hover:scale-102 active:scale-98 transition-all group"
        >
          {/* نقطة خضراء متوهجة */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366]" />
          </span>
          <span className="text-xs font-bold whitespace-nowrap">
            {isEnglish ? 'Chat with us on WhatsApp' : 'تحدث معنا عبر الواتساب'}
          </span>
        </div>

        {/* الزر الدائري الأخضر (#25D366) مع حلقة النبض وشارة الإشعار 1 */}
        <div className="relative flex items-center">
          {/* حلقة النبض الناعمة في الخلفية */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-35 pointer-events-none" />

          <button
            type="button"
            onClick={handleWhatsAppClick}
            aria-label={isEnglish ? 'Chat with us on WhatsApp' : 'تحدث معنا عبر الواتساب'}
            className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl shadow-[#25D366]/30 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />

            {/* شارة إشعار حمراء صغيرة تحمل الرقم 1 في الزاوية العلوية */}
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#E53935] text-white text-[11px] font-black flex items-center justify-center shadow-md border-2 border-white dark:border-[#111411]">
              1
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
