import {
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
import { SITE_CONFIG } from '../../config/siteConfig';
import BrandLogo from '../common/BrandLogo';

// أيقونة منصة فيسبوك (Facebook)
function FacebookIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

// أيقونة منصة إنستغرام (Instagram)
function InstagramIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

// أيقونة منصة إكس الرسمية (X / Twitter)
function XIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// أيقونة تطبيق واتساب (WhatsApp)
function WhatsAppIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.886-9.89 9.886m8.813-18.693A11.83 11.83 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

// أيقونة تطبيق تيليجرام (Telegram)
function TelegramIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.672c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.421z" />
    </svg>
  );
}

// أيقونة منصة يوتيوب (YouTube)
function YoutubeIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

// خريطة أيقونات منصات التواصل
const SOCIAL_ICONS = {
  whatsapp: WhatsAppIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  x: XIcon,
  telegram: TelegramIcon,
  youtube: YoutubeIcon,
};

// خريطة أنماط التمرير لأزرار التواصل
const SOCIAL_HOVER_STYLES = {
  whatsapp: 'hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400',
  facebook: 'hover:bg-blue-600/10 hover:border-blue-600/40 hover:text-blue-600 dark:hover:text-blue-400',
  instagram: 'hover:bg-pink-600/10 hover:border-pink-600/40 hover:text-pink-600 dark:hover:text-pink-400',
  x: 'hover:bg-zinc-800/10 hover:border-zinc-800/40 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:border-white/40 dark:hover:text-white',
  telegram: 'hover:bg-sky-500/10 hover:border-sky-500/40 hover:text-sky-500 dark:hover:text-sky-400',
  youtube: 'hover:bg-red-600/10 hover:border-red-600/40 hover:text-red-600 dark:hover:text-red-400',
};

// مكوّن التذييل السفلي المتجاوب للمنصة (Footer) مع شريط شبكات التواصل ودعم كامل للترجمة
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
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.contact.whatsappNumber}?text=${encodeURIComponent(
    isEnglish
      ? `Hello, I would like to inquire about authentic Yemeni specialty coffee lots and ${SITE_CONFIG.brand.name} platform services.`
      : `السلام عليكم، أود الاستفسار عن محاصيل البن اليمني الفاخر وخدمات منصة ${SITE_CONFIG.brand.name}.`
  )}`;

  return (
    <footer
      id="contact-footer"
      className="w-full bg-surface-container-low border-t border-surface-container mt-space-xl text-start transition-colors"
    >
      <div className="max-w-7xl mx-auto px-margin py-space-xl">
        
        {/* شبكة الأعمدة الأربعة الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-xl pb-space-lg">
          
          {/* العمود الأول: هوية المنصة والرؤية وشبكات التواصل */}
          <div className="flex flex-col gap-space-sm text-start">
            <BrandLogo size="md" showSubtitle={true} />

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

            {/* شريط شبكات التواصل الاجتماعي أسفل معلومات المنصة */}
            <div className="pt-3 flex flex-col gap-2.5">
              <span className="font-label-sm text-xs font-bold text-on-surface dark:text-gray-200">
                {t('footer.followUs')}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {SITE_CONFIG.socialLinks.map((item) => {
                  const Icon = SOCIAL_ICONS[item.platform] || SOCIAL_ICONS[item.id] || MessageSquare;
                  const hoverBg = SOCIAL_HOVER_STYLES[item.platform] || SOCIAL_HOVER_STYLES[item.id] || '';
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      title={item.label}
                      className={`w-10 h-10 rounded-xl bg-emerald-950/5 dark:bg-white/5 border border-emerald-900/10 dark:border-emerald-400/15 text-on-surface-variant dark:text-gray-300 flex items-center justify-center transition-all duration-200 hover:-translate-y-1 shadow-xs ${hoverBg}`}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
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
                <span dir="ltr" className="font-bold text-on-surface">{SITE_CONFIG.contact.phone}</span>
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
