import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhoneCall,
  ShoppingBag,
  User,
  Sliders,
  Menu,
  X,
  Home,
  Sprout,
  Compass,
  Phone,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import BrandLogo from '../common/BrandLogo';

// مكوّن شريط التنقل الزجاجي العائم مع الشعار والتبويبات الشاملة وأزرار الإجراءات
export default function Navbar({
  activeTab = 'home',
  onTabChange = () => {},
  cartCount,
  onCartClick,
  onProfileClick,
  onOpenFarmersModal = () => {},
}) {
  // حالة فتح وإغلاق قائمة الجوال المنسدلة
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // سياق السلة للحصول على العداد ودالة الفتح
  const { totalCount, openCart } = useCart();

  // سياق المصادقة للحصول على حالة المستخدم وطلب تسجيل الدخول
  const { user, requireAuth } = useAuth();

  // سياق الإعدادات والترجمة
  const { openSettings, t } = useSettings();

  // تبويبات التنقل العامة القابلة للتوسع لأي محاصيل زراعية
  const navTabs = [
    { id: 'home', label: t('navbar.home') },
    { id: 'crops', label: t('navbar.crops') },
    { id: 'origins', label: t('navbar.origins') },
    { id: 'contact', label: t('navbar.contactUs') },
  ];

  const displayCartCount = cartCount !== undefined ? cartCount : totalCount;
  const handleCartClick = onCartClick || openCart;

  // معالجة النقر على أيقونة البروفايل
  const handleProfileClick = () => {
    setIsMobileMenuOpen(false);
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

  // معالجة النقر على التبويبات مع التمرير السلس للقسم المقابل وإغلاق قائمة الجوال
  const handleTabClick = (tabId) => {
    setIsMobileMenuOpen(false);
    if (tabId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tabId === 'crops') {
      const cropsSection = document.getElementById('coffee-products');
      if (cropsSection) cropsSection.scrollIntoView({ behavior: 'smooth' });
    } else if (tabId === 'origins') {
      const originsSection = document.getElementById('platform-features');
      if (originsSection) originsSection.scrollIntoView({ behavior: 'smooth' });
    } else if (tabId === 'contact') {
      const footerElement = document.getElementById('contact-footer');
      if (footerElement) footerElement.scrollIntoView({ behavior: 'smooth' });
    }
    onTabChange(tabId);
  };

  return (
    <header className="fixed top-2.5 sm:top-3 inset-x-0 z-40 px-2.5 sm:px-4 pointer-events-none">
      <div className="max-w-7xl mx-auto rounded-2xl bg-white/80 dark:bg-[#0d1812]/80 backdrop-blur-xl border border-[#DCE5D8] dark:border-[#7BC662]/15 shadow-lg shadow-[#142610]/5 pointer-events-auto transition-all">
        
        {/* الصف العلوي بارتفاع ثابت 64px على الجوال لضمان تناسق الشعار والأزرار */}
        <div className="h-16 sm:h-[72px] px-2.5 sm:px-6 flex items-center justify-between gap-2 sm:gap-6">
          
          {/* قسم الشعار واسم المنصة الموحّد بأبعاد مقيدة تمنع تمدد الأيقونة */}
          <BrandLogo
            size="md"
            showSubtitle={true}
            logoContainerClassName="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full"
            onClick={() => handleTabClick('home')}
          />

          {/* تبويبات التصفح الرئيسية للشاشات الكبيرة مع المؤشر المنزلق */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-xl bg-surface-container-low/60 dark:bg-[#122019]/60 border border-[#DCE5D8] dark:border-[#7BC662]/15" aria-label="التنقل الرئيسي">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  className={`relative px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer select-none ${
                    isActive
                      ? 'text-[#31691D] dark:text-white font-bold'
                      : 'text-on-surface-variant dark:text-gray-300 hover:text-on-surface dark:hover:text-white'
                  }`}
                >
                  {/* كبسولة التبويب النشط المنزلقة بنعومة باللون المعتمد */}
                  {isActive && (
                    <motion.span
                      layoutId="navActivePill"
                      className="absolute inset-0 bg-[#E9F2E4] dark:bg-[#31691D]/30 rounded-lg border border-[#31691D]/20 dark:border-[#7BC662]/30 shadow-xs"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* قسم الإجراءات السريعة بأزرار ثابتة الحجم تمنع الانضغاط على شاشة 360px */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            {/* زر فتح إعدادات المظهر والمنصة */}
            <button
              type="button"
              onClick={openSettings}
              aria-label={t('navbar.settingsLabel')}
              title={t('navbar.settingsLabel')}
              className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-surface-container-low/80 hover:bg-surface-container-high dark:bg-[#162820] dark:hover:bg-[#1f372c] border border-[#DCE5D8] dark:border-[#7BC662]/15 transition-colors flex items-center justify-center text-on-surface cursor-pointer"
            >
              <Sliders className="w-4 h-4 sm:w-5 sm:h-5 text-[#31691D] dark:text-[#7BC662]" />
            </button>

            {/* زر بوابة المزارعين لسطح المكتب باللون الدافئ الموحد */}
            <button
              type="button"
              onClick={onOpenFarmersModal}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FEF3C7] hover:bg-[#fde68a] border border-[#D97706]/30 transition-colors text-[#D97706] cursor-pointer text-xs font-bold shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{t('navbar.farmerService')}</span>
            </button>

            {/* زر سلة المشتريات مع عداد العناصر ومعرّف هدف الطيران الإلزامي */}
            <button
              type="button"
              id="navbar-cart-icon"
              onClick={handleCartClick}
              aria-label={t('navbar.cartLabel')}
              className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-surface-container-low/80 hover:bg-surface-container-high dark:bg-[#162820] dark:hover:bg-[#1f372c] border border-[#DCE5D8] dark:border-[#7BC662]/15 transition-colors flex items-center justify-center text-on-surface cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#31691D] dark:text-[#7BC662]" />
              {displayCartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#31691D] text-white dark:bg-[#7BC662] dark:text-black text-[11px] font-bold flex items-center justify-center shadow-sm">
                  {displayCartCount}
                </span>
              )}
            </button>

            {/* زر الحساب الشخصي بالأخضر الزراعي المعتمد مع حالة التمرير */}
            <button
              type="button"
              onClick={handleProfileClick}
              aria-label={t('navbar.profileTitle')}
              title={user ? user.name : t('navbar.login')}
              className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full bg-[#31691D] hover:bg-[#255215] dark:bg-[#31691D] dark:hover:bg-[#255215] flex items-center justify-center cursor-pointer active:scale-95 transition-all text-white shadow-xs"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
              {/* نقطة حالة خضراء صغيرة تظهر عند تسجيل الدخول */}
              {user && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-[#7BC662] border-2 border-white dark:border-[#0d1812]" />
              )}
            </button>

            {/* زر فتح وإغلاق قائمة الجوال المنبثقة */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={isMobileMenuOpen}
              className="flex lg:hidden w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-surface-container-low/80 hover:bg-surface-container-high dark:bg-[#162820] dark:hover:bg-[#1f372c] border border-[#DCE5D8] dark:border-[#7BC662]/15 transition-colors items-center justify-center text-on-surface cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#31691D] dark:text-[#7BC662]" />
              ) : (
                <Menu className="w-5 h-5 text-[#31691D] dark:text-[#7BC662]" />
              )}
            </button>
          </div>
        </div>

        {/* قائمة الجوال المنبثقة المرتبة والقابلة للفتح والطي */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="lg:hidden border-t border-[#DCE5D8] dark:border-[#7BC662]/15 px-3.5 py-3 flex flex-col gap-2 overflow-hidden bg-white/95 dark:bg-[#0d1812]/95 rounded-b-2xl"
              aria-label="قائمة الجوال"
            >
              <div className="grid grid-cols-2 gap-2">
                {navTabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleTabClick(tab.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-start ${
                        isActive
                          ? 'bg-[#E9F2E4] text-[#31691D] dark:bg-[#31691D]/30 dark:text-[#7BC662] font-bold border border-[#31691D]/20 dark:border-[#7BC662]/30 shadow-xs'
                          : 'bg-surface-container-low/70 text-on-surface-variant hover:text-on-surface hover:bg-surface-container dark:bg-[#162820] dark:text-gray-300 dark:hover:text-white'
                      }`}
                    >
                      {tab.id === 'home' && <Home className="w-3.5 h-3.5 text-[#31691D] dark:text-[#7BC662]" />}
                      {tab.id === 'crops' && <Sprout className="w-3.5 h-3.5 text-[#31691D] dark:text-[#7BC662]" />}
                      {tab.id === 'origins' && <Compass className="w-3.5 h-3.5 text-[#31691D] dark:text-[#7BC662]" />}
                      {tab.id === 'contact' && <Phone className="w-3.5 h-3.5 text-[#31691D] dark:text-[#7BC662]" />}
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* زر خدمة المزارعين للشاشات الصغيرة بعرض كامل */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenFarmersModal();
                }}
                className="w-full mt-0.5 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#FEF3C7] hover:bg-[#fde68a] border border-[#D97706]/30 text-[#D97706] transition-colors text-xs font-bold cursor-pointer shadow-xs active:scale-98"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#D97706]" />
                <span>{t('navbar.farmerService')}</span>
              </button>
            </motion.nav>
          )}
        </AnimatePresence>

      </div>
    </header>
  );
}
