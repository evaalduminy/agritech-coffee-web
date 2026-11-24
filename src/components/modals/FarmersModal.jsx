import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sprout,
  ShieldCheck,
  Award,
  Mountain,
  MessageSquare,
  CheckCircle2,
  MapPin,
  User,
  Phone,
  FileText,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { SITE_CONFIG } from '../../config/siteConfig';
import { DEFAULT_WHATSAPP_PHONE } from '../../services/whatsapp';
import BotVerification from '../common/BotVerification';

// مكوّن نافذة خدمة المزارعين والتعاونيات الزراعية مع نموذج التوثيق والتحقق البشري
export default function FarmersModal({ isOpen = false, onClose = () => {} }) {
  const { isEnglish } = useSettings();

  // بيانات نموذج تسجيل وتوثيق المزارع
  const [farmerName, setFarmerName] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [cropNotes, setCropNotes] = useState('');

  // حالة التحقق البشري عبر مكوّن BotVerification
  const [isBotVerified, setIsBotVerified] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

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

  // إعادة ضبط النموذج والتحقق عند فتح أو إغلاق النافذة
  useEffect(() => {
    if (!isOpen) {
      setFarmerName('');
      setFarmLocation('');
      setFarmerPhone('');
      setCropNotes('');
      setIsBotVerified(false);
      setResetTrigger((prev) => prev + 1);
    }
  }, [isOpen]);

  // معالجة إرسال نموذج المزارع وتوجيهه إلى واتساب بعد إتمام التحقق البشري
  const handleFarmerSubmit = (e) => {
    e.preventDefault();
    if (!isBotVerified) return;

    const messageLines = [
      `*طلب انضمام وتوثيق مزارع - ${SITE_CONFIG.brand.name}*`,
      '---------------------------------------',
      `- اسم المزارع / التعاونية: ${farmerName.trim()}`,
      `- المنطقة والموقع: ${farmLocation.trim()}`,
      `- رقم الهاتف: ${farmerPhone.trim()}`,
      cropNotes.trim() ? `- تفاصيل المحصول: ${cropNotes.trim()}` : '',
      '---------------------------------------',
      `*حالة التحقق البشري:* تم التحقق بنجاح (Verified Human)`,
    ].filter(Boolean);

    const cleanPhone = String(DEFAULT_WHATSAPP_PHONE).replace(/[^0-9]/g, '');
    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageLines.join('\n'))}`,
      '_blank',
      'noopener,noreferrer'
    );

    // إعادة ضبط النموذج وإغلاق النافذة
    setFarmerName('');
    setFarmLocation('');
    setFarmerPhone('');
    setCropNotes('');
    setIsBotVerified(false);
    setResetTrigger((prev) => prev + 1);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6"
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

          {/* بطاقة النافذة المنبثقة المتجاوبة */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white dark:bg-[#0f1b15] rounded-3xl shadow-2xl border border-stone-200 dark:border-emerald-500/20 max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 text-start z-[111] transition-colors"
          >
            {/* زر إغلاق النافذة */}
            <button
              type="button"
              onClick={onClose}
              aria-label={isEnglish ? 'Close Farmer Portal' : 'إغلاق نافذة خدمة المزارعين'}
              className="absolute top-4 sm:top-5 rtl:left-4 rtl:sm:left-5 ltr:right-4 ltr:sm:right-5 w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container dark:bg-[#162820] dark:hover:bg-[#1f372c] text-on-surface-variant hover:text-on-surface dark:text-gray-300 dark:hover:text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* ترويسة الشعار والترحيب */}
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg mb-2.5">
                <Sprout className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <h2 className="font-headline-sm text-lg sm:text-[20px] text-primary dark:text-[#7BC662] font-bold">
                {isEnglish ? 'Farmer & Cooperative Service Portal' : 'بوابة خدمة المزارعين والتعاونيات'}
              </h2>
              <span className="font-label-sm text-xs text-secondary font-semibold mt-0.5">
                {isEnglish ? 'Direct Farm Support & Crop Documentation' : 'دعم ميداني مباشر وتوثيق زراعي للمحاصيل'}
              </span>
              <p className="font-body-sm text-xs sm:text-[13px] text-on-surface-variant dark:text-gray-300 mt-2 max-w-sm leading-relaxed">
                {isEnglish
                  ? 'Highland terrace growers: Register your harvest to cup, certify, and market directly without middlemen.'
                  : 'مزارعي المدرجات الجبلية: سجّل محصولك للفحص والتوثيق والتسويق المباشر لرواد القهوة دون وسطاء.'}
              </p>
            </div>

            {/* بطاقات ميزات خدمة المزارعين المختصرة */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="p-2 sm:p-2.5 rounded-xl bg-surface-container-low dark:bg-[#162820] border border-surface-container dark:border-emerald-500/20 text-center flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-primary dark:text-[#7BC662] mb-1" />
                <span className="text-[10px] sm:text-[11px] font-bold text-on-surface dark:text-white leading-tight">
                  {isEnglish ? 'Fair Pricing' : 'تسعير عادل'}
                </span>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-surface-container-low dark:bg-[#162820] border border-surface-container dark:border-emerald-500/20 text-center flex flex-col items-center">
                <Award className="w-4 h-4 text-primary dark:text-[#7BC662] mb-1" />
                <span className="text-[10px] sm:text-[11px] font-bold text-on-surface dark:text-white leading-tight">
                  {isEnglish ? 'SCAA Scoring' : 'تنقيط معتمد'}
                </span>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-surface-container-low dark:bg-[#162820] border border-surface-container dark:border-emerald-500/20 text-center flex flex-col items-center">
                <Mountain className="w-4 h-4 text-primary dark:text-[#7BC662] mb-1" />
                <span className="text-[10px] sm:text-[11px] font-bold text-on-surface dark:text-white leading-tight">
                  {isEnglish ? 'Field Guidance' : 'إرشاد ميداني'}
                </span>
              </div>
            </div>

            {/* نموذج تسجيل وتوثيق محصول المزارع مع التحقق البشري الإلزامي */}
            <form onSubmit={handleFarmerSubmit} className="space-y-3 mb-4 text-start">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface dark:text-gray-200 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span>{isEnglish ? 'Farmer / Cooperative Name' : 'اسم المزارع أو التعاونية'} *</span>
                </label>
                <input
                  type="text"
                  required
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder={isEnglish ? 'e.g. Al-Jabal Farm / Haraz' : 'مثال: مزرعة الجبل أو تعاونية حراز'}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-outline-variant dark:border-emerald-500/30 bg-surface dark:bg-[#162820] text-on-surface dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body-md"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-on-surface dark:text-gray-200 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>{isEnglish ? 'Terrace Region / Location' : 'المنطقة والموقع'} *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={farmLocation}
                    onChange={(e) => setFarmLocation(e.target.value)}
                    placeholder={isEnglish ? 'e.g. Haraz / Yafa / Ibb' : 'مثال: حراز، يافع، بني مطر، إب'}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-outline-variant dark:border-emerald-500/30 bg-surface dark:bg-[#162820] text-on-surface dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body-md"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-on-surface dark:text-gray-200 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    <span>{isEnglish ? 'WhatsApp Phone' : 'رقم الهاتف والواتساب'} *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={farmerPhone}
                    onChange={(e) => setFarmerPhone(e.target.value)}
                    placeholder="مثال: 770000000"
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-outline-variant dark:border-emerald-500/30 bg-surface dark:bg-[#162820] text-on-surface dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body-md text-start"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface dark:text-gray-200 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span>{isEnglish ? 'Crop Details (Optional)' : 'تفاصيل المحصول أو الكمية (اختياري)'}</span>
                </label>
                <input
                  type="text"
                  value={cropNotes}
                  onChange={(e) => setCropNotes(e.target.value)}
                  placeholder={isEnglish ? 'e.g. Natural dried coffee, 500kg' : 'مثال: بن مجفف طبيعي، 500 كجم متوفرة للقطاف'}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-outline-variant dark:border-emerald-500/30 bg-surface dark:bg-[#162820] text-on-surface dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body-md"
                />
              </div>

              {/* مكوّن التحقق البشري الإلزامي قبل الإرسال */}
              <BotVerification
                onVerify={setIsBotVerified}
                resetTrigger={resetTrigger}
              />

              {/* زر إرسال النموذج بعد إتمام التحقق */}
              <button
                type="submit"
                disabled={!isBotVerified}
                className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-[#204613] text-white font-label-md text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>
                  {isEnglish
                    ? 'Submit Farmer Application on WhatsApp'
                    : 'إرسال طلب الانضمام والتوثيق عبر واتساب'}
                </span>
              </button>
            </form>

            {/* خيار الاتصال المباشر البديل برقم المنصة الرسمي */}
            <div className="pt-3 border-t border-surface-container dark:border-emerald-500/20 flex items-center justify-between gap-2 text-xs text-on-surface-variant dark:text-gray-300">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>{isEnglish ? 'Field hotline support:' : 'خط الدعم الميداني المباشر:'}</span>
              </span>
              <a
                href={`tel:${SITE_CONFIG.contact.phone.replace(/\s+/g, '')}`}
                dir="ltr"
                className="font-bold text-primary dark:text-[#7BC662] hover:underline"
              >
                {SITE_CONFIG.contact.phone}
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
