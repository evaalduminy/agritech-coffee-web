import { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Check, Loader2 } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { SITE_CONFIG } from '../../config/siteConfig';

// مكوّن التحقق البشري المخصص وحماية النماذج من الروبوتات
export default function BotVerification({
  onVerify = () => {},
  resetTrigger = 0,
}) {
  const { isEnglish } = useSettings();

  // حالات التحقق: idle (غير محدد), checking (جاري التحقق), verified (تم التحقق), failed (فشل)
  const [status, setStatus] = useState('idle');
  const [honeypotValue, setHoneypotValue] = useState('');

  // تسجيل توقيت تحميل المكوّن لاصطياد النقرات الآلية الفورية
  const mountTimeRef = useRef(null);

  // إعادة ضبط المكوّن عند تغيّر مفتاح إعادة الضبط الممرر
  useEffect(() => {
    setStatus('idle');
    setHoneypotValue('');
    mountTimeRef.current = Date.now();
  }, [resetTrigger]);

  // معالجة النقر على مربع التحقق
  const handleCheckboxClick = () => {
    if (status === 'checking' || status === 'verified') return;

    // 1. فحص الفخ الخفي (Honeypot): إذا تمت تعبئته فهو روبوت
    if (honeypotValue.trim() !== '') {
      setStatus('failed');
      onVerify(false);
      return;
    }

    // 2. فحص الفارق الزمني: النقر في أقل من 400ms من التحميل يُعد سلوكاً آلياً
    const elapsed = Date.now() - mountTimeRef.current;
    if (elapsed < 400) {
      setStatus('failed');
      onVerify(false);
      return;
    }

    // 3. محاكاة فحص أمني سريع لنصف ثانية ثم تأكيد التحقق البشري
    setStatus('checking');
    setTimeout(() => {
      setStatus('verified');
      onVerify(true);
    }, 550);
  };

  return (
    <div
      role="region"
      aria-label={isEnglish ? 'Bot Protection Verification' : 'التحقق البشري من الروبوتات'}
      className="w-full my-3 p-3 sm:p-3.5 rounded-2xl bg-[#F4F7F2] dark:bg-[#122019] border border-[#DCE5D8] dark:border-emerald-500/25 flex items-center justify-between gap-3 shadow-xs transition-colors select-none"
    >
      {/* حقل الفخ الخفي غير المرئي للبشر لاصطياد الروبوتات البرمجية */}
      <input
        type="text"
        name="agri_website_hp"
        tabIndex={-1}
        autoComplete="off"
        value={honeypotValue}
        onChange={(e) => setHoneypotValue(e.target.value)}
        className="opacity-0 absolute -z-50 w-0 h-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* الجهة اليمنى: مربع الاختيار التفاعلي وحالات التحقق */}
      <div
        onClick={handleCheckboxClick}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <button
          type="button"
          role="checkbox"
          aria-checked={status === 'verified'}
          aria-label={isEnglish ? "I'm not a robot" : 'أنا لست برنامج روبوت'}
          className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
            status === 'verified'
              ? 'bg-[#31691D] border-[#31691D] text-white shadow-xs'
              : status === 'checking'
              ? 'bg-white dark:bg-[#1a2d24] border-[#31691D] text-[#31691D] dark:text-[#7BC662]'
              : status === 'failed'
              ? 'bg-red-50 dark:bg-red-950/30 border-red-500 text-red-500'
              : 'bg-white dark:bg-[#1a2d24] border-[#DCE5D8] dark:border-emerald-500/30 group-hover:border-[#31691D] dark:group-hover:border-[#7BC662]'
          }`}
        >
          {status === 'checking' && (
            <Loader2 className="w-4 h-4 animate-spin text-[#31691D] dark:text-[#7BC662]" />
          )}
          {status === 'verified' && (
            <Check className="w-4 h-4 text-white stroke-[3]" />
          )}
        </button>

        <span className="text-xs sm:text-sm font-bold text-[#1A2B15] dark:text-emerald-100">
          {isEnglish ? "I'm not a robot" : 'أنا لست برنامج روبوت'}
        </span>
      </div>

      {/* الجهة اليسرى: شارة الحماية الرسمية لمنصة AgriMarket */}
      <div className="flex flex-col items-end text-end shrink-0 pl-1 rtl:pr-1">
        <div className="flex items-center gap-1 text-[#31691D] dark:text-[#7BC662]">
          <ShieldCheck className="w-4 h-4" />
          <span className="font-black text-[11px] sm:text-xs tracking-tight">
            {SITE_CONFIG.brand.name}
          </span>
        </div>
        <span className="text-[9px] text-[#556650] dark:text-emerald-300/70 font-medium">
          {isEnglish ? 'Verified Protection' : 'حماية موثوقة'}
        </span>
      </div>
    </div>
  );
}
