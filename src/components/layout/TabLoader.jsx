import { motion, AnimatePresence } from 'framer-motion';
import { Sprout } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

// مكوّن شاشة الانتقال والتحميل الخفيفة بين التبويبات والمحاصيل مع دعم الترجمة
export default function TabLoader({
  isLoading = false,
  message,
}) {
  const { settings, t } = useSettings();
  const loaderStyle = settings?.loaderStyle || 'logo';
  const displayMessage = message || t('loader.defaultMessage');

  // 1. إذا كان الإعداد "بدون مؤشر" نتجاوز العرض بالكامل
  if (loaderStyle === 'none') {
    return null;
  }

  // 2. إذا كان الإعداد "شريط تقدم علوي" (Top Progress Bar)
  if (loaderStyle === 'bar') {
    return (
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="top-progress-bar-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 inset-x-0 z-[110] pointer-events-none"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              style={{ transformOrigin: 'right' }}
              className="h-1.5 bg-primary shadow-sm w-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // 3. النمط الافتراضي: بطاقة الشعار المركزي مع الإطار الدوار النابض (Logo Overlay)
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="tab-loader-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-surface/85 backdrop-blur-md"
        >
          {/* بطاقة الشعار مع حركة دخول وتكبير ناعمة */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex flex-col items-center gap-4 text-center p-6"
          >
            {/* الشعار المركزي مع الإطار الدوار النابض */}
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center shadow-lg relative z-10 animate-pulse">
                <Sprout className="w-9 h-9" />
              </div>
              <div className="absolute inset-0 -m-2 rounded-3xl border-2 border-primary/30 border-t-primary animate-spin" />
            </div>

            {/* الاسم التجاري للمنصة */}
            <div className="flex flex-col items-center gap-1 mt-2">
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                {t('navbar.brand')}
              </span>
              <span className="font-label-sm text-label-sm text-secondary tracking-wider font-semibold">
                {t('navbar.brandSubtitle')}
              </span>
            </div>

            {/* مؤشر النقاط النابضة مع نص الحالة */}
            <div className="flex items-center gap-1.5 mt-1 text-primary text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.3s]" />
              <span className="mr-1 text-on-surface-variant font-label-sm text-label-sm">
                {displayMessage}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
