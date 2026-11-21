import { Sprout, PhoneCall, ShoppingBag, User, Sliders } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

// مكوّن الشريط العلوي الثابت مع الشعار والتبويبات وأزرار الإجراءات
export default function Navbar({
  activeTab = 'home',
  onTabChange = () => {},
  cartCount,
  onCartClick,
  onProfileClick,
  onOpenFarmersModal = () => {},
}) {
  // سياق السلة للحصول على العداد ودالة الفتح
  const { totalCount, openCart } = useCart();

  // سياق المصادقة للحصول على حالة المستخدم وطلب تسجيل الدخول
  const { user, requireAuth } = useAuth();

  // سياق الإعدادات والترجمة
  const { openSettings, t } = useSettings();

  // تبويبات التنقل مترجمة بحسب اللغة المختارة
  const navTabs = [
    { id: 'home', label: t('navbar.home') },
    { id: 'roasted-coffee', label: t('navbar.roastedCoffee') },
    { id: 'green-coffee', label: t('navbar.greenCoffee') },
    { id: 'special-blends', label: t('navbar.specialBlends') },
    { id: 'contact', label: t('navbar.contactUs') },
  ];

  const displayCartCount = cartCount !== undefined ? cartCount : totalCount;
  const handleCartClick = onCartClick || openCart;

  // معالجة النقر على أيقونة البروفايل
  const handleProfileClick = () => {
    if (!user) {
      requireAuth((loggedInUser) => {
        if (onProfileClick) {
          onProfileClick(loggedInUser);
        }
      });
    } else {
      if (onProfileClick) {
        onProfileClick(user);
      }
    }
  };

  // معالجة النقر على التبويبات مع التمرير الناعم للفوتر عند اختيار تواصل معنا
  const handleTabClick = (tabId) => {
    if (tabId === 'contact') {
      const footerElement = document.getElementById('contact-footer');
      if (footerElement) {
        footerElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
    onTabChange(tabId);
  };

  return (
    <header className="fixed top-0 w-full z-40 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(49,105,29,0.04)] border-b border-surface-container dark:border-emerald-950/60">
      <div className="h-20 max-w-7xl mx-auto px-margin flex items-center justify-between gap-space-lg">
        
        {/* قسم الشعار والتبويبات الرئيسية */}
        <div className="flex items-center gap-space-xl">
          {/* شعار المنصة واسمها */}
          <button
            type="button"
            onClick={() => onTabChange('home')}
            className="flex items-center gap-space-sm group text-start cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-container dark:bg-emerald-900 flex items-center justify-center text-on-primary shadow-sm group-hover:bg-primary transition-colors">
              <Sprout className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-primary dark:text-white leading-tight tracking-tight">
                {t('navbar.brand')}
              </span>
              <span className="font-label-sm text-label-sm text-secondary dark:text-emerald-400 tracking-wide">
                {t('navbar.brandSubtitle')}
              </span>
            </div>
          </button>

          {/* تبويبات التصفح الرئيسية للشاشات الكبيرة */}
          <nav className="hidden lg:flex items-center gap-space-lg" aria-label="التنقل الرئيسي">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  className={`transition-colors py-1 cursor-pointer font-label-lg text-label-lg ${
                    isActive
                      ? 'text-primary dark:text-emerald-300 font-bold border-b-2 border-primary dark:border-emerald-400 pb-1'
                      : 'text-on-surface-variant hover:text-on-surface dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* قسم الإجراءات السريعة (خدمة المزارعين، السلة، الحساب، الإعدادات) */}
        <div className="flex items-center gap-space-sm sm:gap-space-md">
          {/* زر فتح إعدادات المظهر والمنصة */}
          <button
            type="button"
            onClick={openSettings}
            aria-label={t('navbar.settingsLabel')}
            title={t('navbar.settingsLabel')}
            className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container-high dark:bg-[#162820] dark:hover:bg-[#1f372c] dark:text-gray-200 transition-colors flex items-center justify-center text-on-surface cursor-pointer"
          >
            <Sliders className="w-5 h-5 text-primary dark:text-emerald-300" />
          </button>

          {/* زر خدمة المزارعين للموبايل يفتح نافذة المزارعين */}
          <button
            type="button"
            onClick={onOpenFarmersModal}
            aria-label={t('navbar.farmerService')}
            title={t('navbar.farmerService')}
            className="flex md:hidden p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container-high dark:bg-[#162820] dark:hover:bg-[#1f372c] transition-colors text-primary dark:text-emerald-300 items-center justify-center cursor-pointer"
          >
            <PhoneCall className="w-5 h-5" />
          </button>

          {/* زر خدمة المزارعين لسطح المكتب يفتح نافذة المزارعين */}
          <button
            type="button"
            onClick={onOpenFarmersModal}
            className="hidden md:flex items-center gap-space-xs px-space-md py-space-xs rounded-xl bg-surface-container-low hover:bg-surface-container-high dark:bg-[#162820] dark:hover:bg-[#1f372c] transition-colors text-on-surface-variant dark:text-gray-200 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-primary dark:text-emerald-300" />
            <span className="font-label-md text-label-md text-on-surface dark:text-gray-200">{t('navbar.farmerService')}</span>
          </button>

          {/* زر سلة المشتريات مع عداد العناصر */}
          <button
            type="button"
            onClick={handleCartClick}
            aria-label={t('navbar.cartLabel')}
            className="relative p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container-high dark:bg-[#162820] dark:hover:bg-[#1f372c] dark:text-gray-200 transition-colors flex items-center justify-center text-on-surface cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 text-primary dark:text-emerald-300" />
            {displayCartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-on-primary dark:bg-emerald-500 dark:text-black font-label-sm text-label-sm flex items-center justify-center shadow-sm">
                {displayCartCount}
              </span>
            )}
          </button>

          {/* زر الحساب الشخصي وتسجيل الدخول الدائري الأنيق المطابق لـ Stitch */}
          <button
            type="button"
            onClick={handleProfileClick}
            aria-label={t('navbar.profileTitle')}
            title={user ? user.name : t('navbar.login')}
            className="relative w-9 h-9 rounded-full bg-primary dark:bg-emerald-700 flex items-center justify-center cursor-pointer hover:opacity-90 active:scale-95 transition-all text-on-primary shadow-sm"
          >
            <User className="w-4 h-4" />
            {/* نقطة حالة خضراء صغيرة تظهر عند تسجيل الدخول */}
            {user && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-primary-fixed dark:bg-emerald-300 border-2 border-surface dark:border-[#0B1410]" />
            )}
          </button>
        </div>
      </div>

      {/* شريط تبويبات أفقي مخصص للشاشات الصغيرة والمتوسطة بتمرير سلس */}
      <nav className="flex lg:hidden px-4 py-2 border-t border-surface-container dark:border-emerald-950/60 overflow-x-auto whitespace-nowrap gap-2 scrollbar-none scroll-smooth items-center">
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary text-white dark:bg-emerald-600 dark:text-white shadow-xs'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface dark:bg-[#162820] dark:text-gray-300 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}

        {/* زر خدمة المزارعين ضمن شريط التبويبات للشاشات الصغيرة يفتح نافذة المزارعين */}
        <button
          type="button"
          onClick={onOpenFarmersModal}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-primary hover:bg-primary hover:text-white dark:bg-[#1f372c] dark:text-emerald-300 dark:hover:bg-emerald-700 dark:hover:text-white transition-colors text-xs font-bold cursor-pointer"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>{t('navbar.farmerService')}</span>
        </button>
      </nav>
    </header>
  );
}
