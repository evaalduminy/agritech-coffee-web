import { useSettings } from '../../context/SettingsContext';
import { SITE_CONFIG } from '../../config/siteConfig';

// أحجام الشعار المتناسبة بدقة مع واجهات المنصة المختلفة وفق مقاسات Tailwind القياسية
const SIZE_CONFIGS = {
  sm: {
    container: 'w-8 h-8 rounded-full',
    title: 'text-sm sm:text-base',
    subtitle: 'text-[10px]',
  },
  md: {
    container: 'w-10 h-10 sm:w-11 sm:h-11 rounded-full',
    title: 'text-base sm:text-lg',
    subtitle: 'text-[11px] sm:text-xs',
  },
  lg: {
    container: 'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl',
    title: 'text-xl sm:text-2xl',
    subtitle: 'text-xs sm:text-sm',
  },
};

// مكوّن الشعار الموحّد للمنصة مع دعم الأحجام واللغتين والوضعين النهاري والليلي
export default function BrandLogo({
  size = 'md',
  showSubtitle = false,
  className = '',
  logoContainerClassName = '',
  onClick,
}) {
  const { isEnglish } = useSettings();
  const config = SIZE_CONFIGS[size] || SIZE_CONFIGS.md;
  const currentLang = isEnglish ? 'en' : 'ar';

  // نص السطر الفرعي المترجم للمنصة من مصدر الحقيقة الموحد
  const subtitleText = SITE_CONFIG.brand.subtitle[currentLang];

  // فئة حاوية الشعار بمقاس ثابت لمنع تمدد الصورة الأصلية على الشاشات الضيقة
  const resolvedContainerSize = logoContainerClassName || config.container;

  const content = (
    <div className={`flex items-center gap-2 sm:gap-3 select-none min-w-0 ${className}`}>
      {/* حاوية شعار المنصة الرسمي بمقاس ثابت وخلفية فاتحة لضمان التباين في الوضعين */}
      <div
        className={`${resolvedContainerSize} shrink-0 bg-[#f8faf5] p-1.5 flex items-center justify-center overflow-hidden border border-[#31691D]/20 shadow-xs transition-all duration-200 group-hover:scale-105`}
      >
        <img
          src="/images/agritech-emblem.png"
          alt={SITE_CONFIG.brand.name}
          width={44}
          height={44}
          className="w-full h-full object-contain block"
        />
      </div>

      {/* الشعار النصي ثنائي الدرجة مع اتجاه ltr لثبات الاسم مستمد من مصدر الحقيقة */}
      <div className="flex flex-col text-start min-w-0">
        <span
          dir="ltr"
          className={`font-black ${config.title} leading-tight tracking-tight inline-flex items-baseline whitespace-nowrap`}
        >
          <span className="font-extrabold text-[#1A2B15] dark:text-white transition-colors">
            {SITE_CONFIG.brand.prefix}
          </span>
          <span className="font-extrabold text-[#31691D] dark:text-[#7BC662] transition-colors">
            {SITE_CONFIG.brand.suffix}
          </span>
        </span>

        {/* السطر الفرعي التعريفي الاختياري مع منع تجاوز العرض على الجوال */}
        {showSubtitle && (
          <span
            className={`${config.subtitle} text-secondary dark:text-[#7BC662]/80 font-medium tracking-wide leading-tight mt-0.5 truncate`}
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
        className="group text-start cursor-pointer focus:outline-none min-w-0 shrink"
      >
        {content}
      </button>
    );
  }

  return content;
}
