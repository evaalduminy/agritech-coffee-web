import { Sprout } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { SITE_CONFIG } from '../../config/siteConfig';

// أحجام الشعار المتناسبة بدقة مع واجهات المنصة المختلفة
const SIZE_CONFIGS = {
  sm: {
    container: 'w-8 h-8 rounded-lg',
    icon: 'w-4 h-4',
    title: 'text-sm sm:text-base',
    subtitle: 'text-[10px]',
  },
  md: {
    container: 'w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-xl',
    icon: 'w-5 h-5 sm:w-5.5 sm:h-5.5',
    title: 'text-base sm:text-lg',
    subtitle: 'text-[11px] sm:text-xs',
  },
  lg: {
    container: 'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl',
    icon: 'w-7 h-7 sm:w-8 sm:h-8',
    title: 'text-xl sm:text-2xl',
    subtitle: 'text-xs sm:text-sm',
  },
};

// مكوّن الشعار الموحّد للمنصة AgriMarket مع دعم الأحجام واللغتين والوضعين النهاري والليلي
export default function BrandLogo({
  size = 'md',
  showSubtitle = false,
  className = '',
  onClick,
}) {
  const { isEnglish } = useSettings();
  const config = SIZE_CONFIGS[size] || SIZE_CONFIGS.md;
  const currentLang = isEnglish ? 'en' : 'ar';

  // نص السطر الفرعي المترجم للمنصة من مصدر الحقيقة الموحد
  const subtitleText = SITE_CONFIG.brand.subtitle[currentLang];

  const content = (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* حاوية أيقونة النبتة بتدرج زمردي ولمسة إضاءة زجاجية */}
      <div
        className={`${config.container} bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 dark:from-emerald-500 dark:via-emerald-600 dark:to-[#0f2d1e] text-white flex items-center justify-center shadow-xs ring-1 ring-emerald-400/20 shrink-0 transition-transform duration-200 group-hover:scale-105`}
      >
        <Sprout className={config.icon} />
      </div>

      {/* الشعار النصي ثنائي الدرجة مع اتجاه ltr لثبات الاسم مستمد من مصدر الحقيقة */}
      <div className="flex flex-col text-start">
        <span
          dir="ltr"
          className={`font-black ${config.title} leading-tight tracking-tight inline-flex items-baseline`}
        >
          <span className="font-extrabold text-emerald-950 dark:text-white transition-colors">
            {SITE_CONFIG.brand.prefix}
          </span>
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 transition-colors">
            {SITE_CONFIG.brand.suffix}
          </span>
        </span>

        {/* السطر الفرعي التعريفي الاختياري */}
        {showSubtitle && (
          <span
            className={`${config.subtitle} text-secondary dark:text-emerald-400/80 font-medium tracking-wide leading-tight mt-0.5`}
          >
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="group text-start cursor-pointer focus:outline-none"
      >
        {content}
      </button>
    );
  }

  return content;
}
