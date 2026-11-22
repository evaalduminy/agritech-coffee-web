import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sprout,
  PhoneCall,
  ShieldCheck,
  Award,
  Mountain,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { DEFAULT_WHATSAPP_PHONE } from '../../services/whatsapp';

// مكوّن نافذة خدمة المزارعين والتعاونيات الزراعية المنبثقة
export default function FarmersModal({ isOpen = false, onClose = () => {} }) {
  const { isEnglish } = useSettings();

  // إغلاق النافذة عند الضغط على زر Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // رابط واتساب المباشر لمكتب خدمة المزارعين
  const whatsappUrl = `https://wa.me/${DEFAULT_WHATSAPP_PHONE}?text=${encodeURIComponent(
    isEnglish
      ? 'Hello, I am a coffee farmer / cooperative representative and would like to register our harvest lots on the AgriTech platform.'
      : 'السلام عليكم، أنا مزارع بن / ممثل تعاونية زراعية وأود تسجيل محصولنا الزراعي في منصة سوق البن الفاخر.'
  )}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6"
        >
          {/* الخلفية المعتمة القابلة للنقر للإغلاق مع z-[110] */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-black/55 backdrop-blur-md"
          />

          {/* بطاقة النافذة المنبثقة */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-lg w-full p-6 sm:p-8 text-start overflow-hidden z-[111]"
          >
            {/* زر إغلاق النافذة */}
            <button
              type="button"
              onClick={onClose}
              aria-label={isEnglish ? 'Close Farmer Portal' : 'إغلاق نافذة خدمة المزارعين'}
              className="absolute top-5 rtl:left-5 ltr:right-5 w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* ترويسة الشعار والترحيب */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg mb-3">
                <Sprout className="w-8 h-8" />
              </div>
              <h2 className="font-headline-sm text-[20px] text-primary font-bold">
                {isEnglish ? 'Farmer & Cooperative Service Portal' : 'بوابة خدمة المزارعين والتعاونيات'}
              </h2>
              <span className="font-label-sm text-xs text-secondary font-semibold mt-0.5">
                {isEnglish ? 'Direct Farm Support & Crop Documentation' : 'دعم ميداني مباشر وتوثيق زراعي للمحاصيل'}
              </span>
              <p className="font-body-sm text-[13px] text-on-surface-variant mt-2 max-w-sm leading-relaxed">
                {isEnglish
                  ? 'We partner with highland terrace growers in Haraz, Yafa, and Bani Matar to cup, certify, and market genuine microlots directly to specialty buyers.'
                  : 'نعمل يداً بيد مع مزارعي مدرجات البن العالية في حراز ويافع وبني مطر لفحص وتوثيق وتسويق محاصيلهم الفاخرة مباشرة لرواد القهوة المختصة بدون وسطاء.'}
              </p>
            </div>

            {/* بطاقات ميزات خدمة المزارعين */}
            <div className="space-y-2.5 mb-6">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-start">
                  <h4 className="font-label-md text-xs font-bold text-on-surface">
                    {isEnglish ? 'Direct Fair Pricing & Zero Brokerage' : 'تسعير عادل وتوريد مباشر بدون سماسرة'}
                  </h4>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    {isEnglish
                      ? 'Farmers receive full value for their harvest with upfront agreements and guaranteed purchase.'
                      : 'يحصل المزارع على العائد المستحق لمحصوله كاملاً مع اتفاقيات مسبقة وشراء مضمون.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <Award className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-start">
                  <h4 className="font-label-md text-xs font-bold text-on-surface">
                    {isEnglish ? 'SCAA Cupping & Quality Certification' : 'تقييم جودة وتنقيط معتمد وفق معايير SCAA'}
                  </h4>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    {isEnglish
                      ? 'Free laboratory scoring and defect analysis to elevate lot value in global specialty markets.'
                      : 'فحص مختبري مجاني وتصنيف دقيق لرفع القيمة السوقية للمحصول عالمياً ومحلياً.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <Mountain className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-start">
                  <h4 className="font-label-md text-xs font-bold text-on-surface">
                    {isEnglish ? 'Field Agronomist Guidance' : 'إرشاد زراعي ميداني متخصص'}
                  </h4>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    {isEnglish
                      ? 'Advisory on anaerobic fermentation, selective picking, and raised-bed drying.'
                      : 'متابعة ميدانية لطرق المعالجة الحديثة والتجفيف السليم لضمان أعلى درجات النقاء.'}
                  </p>
                </div>
              </div>
            </div>

            {/* أزرار الاتصال المباشر للمزارعين */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-[#204613] text-on-primary font-label-md text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{isEnglish ? 'Farmer Desk WhatsApp' : 'تواصل مع مكتب المزارعين'}</span>
              </a>

              <a
                href="tel:+9671000000"
                className="py-3 px-4 rounded-xl border border-surface-container bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <PhoneCall className="w-4 h-4 text-primary" />
                <span>{isEnglish ? 'Call Hotline' : 'الاتصال المباشر'}</span>
              </a>
            </div>

            {/* شارة التوثيق */}
            <div className="mt-4 pt-3 border-t border-surface-container text-center flex items-center justify-center gap-1.5 text-on-surface-variant font-label-sm text-[11px]">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>
                {isEnglish
                  ? 'Certified platform initiative supporting Yemeni coffee farmers'
                  : 'مبادرة رقمية معتمدة لدعم وتمكين مزارعي البن اليمني الأصيل'}
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
