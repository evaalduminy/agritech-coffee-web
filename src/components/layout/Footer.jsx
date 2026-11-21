import {
  Sprout,
  ShieldCheck,
  PhoneCall,
  User,
  Sliders,
  MapPin,
  Phone,
  Clock,
  MessageSquare,
  ArrowUp,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { DEFAULT_WHATSAPP_PHONE } from '../../services/whatsapp';

// مكوّن التذييل السفلي المتجاوب للمنصة (Footer) مع دعم كامل للترجمة
export default function Footer({
  onSelectTab = () => {},
  onNavigateToDashboard = () => {},
  onOpenFarmersModal = () => {},
  onOpenSettings,
}) {
  const { requireAuth } = useAuth();
  const { openSettings, t, isEnglish } = useSettings();

  // معالجة فتح الإعدادات إما عبر الخاصية الممررة أو سياق الإعدادات المباشر
  const handleOpenSettings = onOpenSettings || openSettings;

  // الصعود السلس إلى أعلى الصفحة
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // معالجة اختيار أحد تصنيفات البن من روابط الفوتر
  const handleQuickCategory = (tabId) => {
    onSelectTab(tabId);
    scrollToTop();
  };

  // فتح صفحة الحساب بعد التحقق من المصادقة
  const handleAccountClick = () => {
    requireAuth(() => {
      onNavigateToDashboard();
      scrollToTop();
    });
  };

  // رابط واتساب المباشر للاستفسار العام
  const whatsappUrl = `https://wa.me/${DEFAULT_WHATSAPP_PHONE}?text=${encodeURIComponent(
    isEnglish
      ? 'Hello, I would like to inquire about authentic Yemeni specialty coffee lots and AgriTech platform services.'
      : 'السلام عليكم، أود الاستفسار عن محاصيل البن اليمني الفاخر وخدمات منصة سوق البن.'
  )}`;

  return (
    <footer
      id="contact-footer"
      className="w-full bg-surface-container-low border-t border-surface-container mt-space-xl text-start transition-colors"
    >
      <div className="max-w-7xl mx-auto px-margin py-space-xl">
        
        {/* شبكة الأعمدة الأربعة الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-xl pb-space-lg">
          
          {/* العمود الأول: هوية المنصة والرؤية الزراعية */}
          <div className="flex flex-col gap-space-sm text-start">
            <div className="flex items-center gap-space-xs">
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-xs">
                <Sprout className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-primary font-bold leading-tight">
                  {t('footer.brand')}
                </span>
                <span className="font-label-sm text-label-sm text-secondary tracking-wide">
                  {t('footer.brandSubtitle')}
                </span>
              </div>
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {t('footer.vision')}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-on-surface-variant font-label-sm text-xs">
              <span className="inline-flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-lg text-primary font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                <span>{t('footer.certifiedFarm')}</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-lg text-secondary font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
                <span>{t('footer.farmShipping')}</span>
              </span>
            </div>
          </div>

          {/* العمود الثاني: الروابط السريعة وتصنيفات المحاصيل */}
          <div className="flex flex-col gap-space-sm text-start">
            <h3 className="font-headline-sm text-[16px] text-on-surface font-bold border-b border-surface-container pb-2">
              {t('footer.cropsTitle')}
            </h3>
            <nav className="flex flex-col gap-space-xs font-body-md text-body-md">
              <button
                type="button"
                onClick={() => handleQuickCategory('home')}
                className="text-start text-on-surface-variant hover:text-primary transition-colors py-1 cursor-pointer"
              >
                {t('footer.linkAll')}
              </button>
              <button
                type="button"
                onClick={() => handleQuickCategory('roasted-coffee')}
                className="text-start text-on-surface-variant hover:text-primary transition-colors py-1 cursor-pointer"
              >
                {t('footer.linkRoasted')}
              </button>
              <button
                type="button"
                onClick={() => handleQuickCategory('green-coffee')}
                className="text-start text-on-surface-variant hover:text-primary transition-colors py-1 cursor-pointer"
              >
                {t('footer.linkGreen')}
              </button>
              <button
                type="button"
                onClick={() => handleQuickCategory('special-blends')}
                className="text-start text-on-surface-variant hover:text-primary transition-colors py-1 cursor-pointer"
              >
                {t('footer.linkBlends')}
              </button>
            </nav>
          </div>

          {/* العمود الثالث: خدمات المنصة وإدارة الحساب */}
          <div className="flex flex-col gap-space-sm text-start">
            <h3 className="font-headline-sm text-[16px] text-on-surface font-bold border-b border-surface-container pb-2">
              {t('footer.servicesTitle')}
            </h3>
            <nav className="flex flex-col gap-space-xs font-body-md text-body-md">
              <button
                type="button"
                onClick={onOpenFarmersModal}
                className="text-start text-on-surface-variant hover:text-primary transition-colors py-1 flex items-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-primary" />
                <span>{t('footer.linkFarmersPortal')}</span>
              </button>
              <button
                type="button"
                onClick={handleAccountClick}
                className="text-start text-on-surface-variant hover:text-primary transition-colors py-1 flex items-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4 text-primary" />
                <span>{t('footer.linkAccount')}</span>
              </button>
              <button
                type="button"
                onClick={handleOpenSettings}
                className="text-start text-on-surface-variant hover:text-primary transition-colors py-1 flex items-center gap-2 cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-primary" />
                <span>{t('footer.linkSettings')}</span>
              </button>
              <a
                href="#contact-footer"
                className="text-start text-on-surface-variant hover:text-primary transition-colors py-1 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>{t('footer.linkGuarantee')}</span>
              </a>
            </nav>
          </div>

          {/* العمود الرابع: معلومات التواصل المباشر */}
          <div className="flex flex-col gap-space-sm text-start">
            <h3 className="font-headline-sm text-[16px] text-on-surface font-bold border-b border-surface-container pb-2">
              {t('footer.contactTitle')}
            </h3>

            <div className="flex flex-col gap-2.5 text-on-surface-variant font-body-sm text-body-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>{t('footer.location')}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span dir="ltr" className="font-bold text-on-surface">+967 770 000 000</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span>{t('footer.workHours')}</span>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-[#204613] text-on-primary font-label-md text-label-md font-bold transition-all shadow-sm active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t('footer.whatsappSupport')}</span>
            </a>
          </div>

        </div>

        {/* الشريط السفلي الأخير: حقوق الملكية وضمان المعاملات */}
        <div className="pt-space-md border-t border-surface-container flex flex-col md:flex-row items-center justify-between gap-space-md bg-surface-container-lowest/60 p-space-md rounded-2xl">
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center md:text-start">
            {t('footer.copyright')}
          </p>

          <p className="font-label-sm text-xs text-secondary font-medium text-center md:text-start">
            {t('footer.noGatewayNotice')}
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label={t('footer.backToTop')}
            className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
}
