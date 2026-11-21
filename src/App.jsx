import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import TabLoader from './components/layout/TabLoader';
import Footer from './components/layout/Footer';
import CartDrawer from './components/modals/CartDrawer';
import SettingsDrawer from './components/modals/SettingsDrawer';
import AuthModal from './components/modals/AuthModal';
import FarmersModal from './components/modals/FarmersModal';
import HomePage from './pages/HomePage';
import BuyerDashboard from './pages/BuyerDashboard';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { mockProducts } from './data/mockData';
import { openWhatsApp } from './services/whatsapp';

// خريطة مطابقة معرفات تبويبات شريط التنقل بفئات التصفية
const TAB_TO_CATEGORY_MAP = {
  home: 'all',
  'roasted-coffee': 'roasted',
  'green-coffee': 'green',
  'special-blends': 'blends',
  contact: 'all',
};

// خريطة عكسية لمطابقة الفئة بالتبويب في الشريط العلوي
const CATEGORY_TO_TAB_MAP = {
  all: 'home',
  roasted: 'roasted-coffee',
  green: 'green-coffee',
  blends: 'special-blends',
  haraz: 'home',
  matari: 'home',
};

// المكوّن الداخلي للتطبيق بعد تغليفه بمزودات السياق
function AppContent() {
  const { openSettings } = useSettings();

  // حالة العرض الحالي: المتجر الرئيسي أو لوحة حساب المشتري
  const [currentView, setCurrentView] = useState('home');

  // حالة التبويب النشط في شريط التنقل
  const [activeTab, setActiveTab] = useState('home');

  // حالة فئة التصفية المحددة في المتجر
  const [selectedCategory, setSelectedCategory] = useState('all');

  // حالة مؤشر التحميل والانتقال
  const [isLoading, setIsLoading] = useState(false);

  // حالة نافذة خدمة المزارعين والتعاونيات المنبثقة
  const [isFarmersModalOpen, setIsFarmersModalOpen] = useState(false);

  // دالة فتح نافذة خدمة المزارعين
  const handleOpenFarmersModal = () => {
    setIsFarmersModalOpen(true);
  };

  // دالة إغلاق نافذة خدمة المزارعين
  const handleCloseFarmersModal = () => {
    setIsFarmersModalOpen(false);
  };

  // دالة تغيير التبويب من الشريط العلوي مع تفعيل تأثير التحميل المتدرج
  const handleTabChange = (newTab) => {
    // إذا كان التبويب هو 'تواصل معنا' نقوم بالتمرير السلس إلى الفوتر
    if (newTab === 'contact') {
      if (currentView !== 'home') {
        setIsLoading(true);
        setTimeout(() => {
          setCurrentView('home');
          setActiveTab('contact');
          setIsLoading(false);
          setTimeout(() => {
            const footer = document.getElementById('contact-footer');
            if (footer) footer.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }, 350);
      } else {
        setActiveTab('contact');
        const footer = document.getElementById('contact-footer');
        if (footer) footer.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (newTab === activeTab && currentView === 'home') return;

    // 1. إظهار TabLoader فوراً
    setIsLoading(true);

    // 2. بعد 350ms والشاشة مغطاة بالكامل يتم تبديل الصفحة ونقل التمرير لأعلى فورا
    setTimeout(() => {
      setActiveTab(newTab);
      setCurrentView('home');
      const matchingCategory = TAB_TO_CATEGORY_MAP[newTab] || 'all';
      setSelectedCategory(matchingCategory);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 350);

    // 3. بعد 850ms من البداية يتم إخفاء TabLoader بنعومة
    setTimeout(() => {
      setIsLoading(false);
    }, 850);
  };

  // دالة الانتقال إلى لوحة حساب المشتري مع مؤشر التحميل المتدرج
  const handleNavigateToDashboard = () => {
    if (currentView === 'dashboard') return;

    // 1. إظهار TabLoader فوراً
    setIsLoading(true);

    // 2. بعد 350ms يتم التبديل للوحة الحساب ونقل التمرير للأعلى
    setTimeout(() => {
      setCurrentView('dashboard');
      setActiveTab('dashboard');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 350);

    // 3. بعد 850ms يتم إخفاء مؤشر التحميل بنعومة
    setTimeout(() => {
      setIsLoading(false);
    }, 850);
  };

  // دالة العودة من حساب المشتري إلى واجهة المتجر الرئيسية بتوقيت متدرج
  const handleReturnToStore = () => {
    // 1. إظهار TabLoader فوراً
    setIsLoading(true);

    // 2. بعد 350ms يتم التبديل للمتجر ونقل التمرير للأعلى
    setTimeout(() => {
      setCurrentView('home');
      setActiveTab('home');
      setSelectedCategory('all');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 350);

    // 3. بعد 850ms يتم إخفاء مؤشر التحميل بنعومة
    setTimeout(() => {
      setIsLoading(false);
    }, 850);
  };

  // دالة تغيير الفئة من أزرار الفلترة المباشرة داخل الصفحة الرئيسية
  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    // مزامنة التبويب في الشريط العلوي
    const matchingTab = CATEGORY_TO_TAB_MAP[categoryId] || 'home';
    setActiveTab(matchingTab);
  };

  // دالة الطلب المباشر عبر واتساب لمحصول فردي
  const handleWhatsAppOrder = (product) => {
    const singleOrder = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      type: product.is_reservable ? 'reservation' : 'order',
      status: 'pending',
      total_price: product.price,
      created_at: new Date().toISOString().split('T')[0],
      items: [
        {
          product_id: product.id,
          name: product.name,
          quantity: 1,
          price: product.price,
        },
      ],
    };
    openWhatsApp(singleOrder);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans transition-colors duration-200">
      {/* 1. الشريط العلوي الثابت */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onProfileClick={handleNavigateToDashboard}
        onOpenFarmersModal={handleOpenFarmersModal}
      />

      {/* 2. شاشة مؤشر التحميل والانتقال */}
      <TabLoader isLoading={isLoading} />

      {/* 3. نافذة السلة الجانبية المنزلقة */}
      <CartDrawer />

      {/* 4. لوحة إعدادات المنصة والمظهر الجانبية */}
      <SettingsDrawer />

      {/* 5. نافذة تسجيل الدخول وإنشاء الحساب المنبثقة */}
      <AuthModal />

      {/* 6. نافذة خدمة المزارعين والتعاونيات الزراعية المنبثقة */}
      <FarmersModal
        isOpen={isFarmersModalOpen}
        onClose={handleCloseFarmersModal}
      />

      {/* 7. عرض الصفحة الرئيسية أو لوحة حساب المشتري مع انتقال حركي ناعم */}
      <main className="flex-1 pt-20">
        <AnimatePresence mode="wait">
          {currentView === 'home' ? (
            <motion.div
              key="home-page-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <HomePage
                products={mockProducts}
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
                onWhatsAppOrder={handleWhatsAppOrder}
              />
            </motion.div>
          ) : (
            <motion.div
              key="buyer-dashboard-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <BuyerDashboard onReturnToStore={handleReturnToStore} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 8. التذييل السفلي للمنصة */}
      <Footer
        onSelectTab={handleTabChange}
        onNavigateToDashboard={handleNavigateToDashboard}
        onOpenFarmersModal={handleOpenFarmersModal}
        onOpenSettings={openSettings}
      />
    </div>
  );
}

// المكوّن الجذري للتطبيق مغلّف بمزودي الإعدادات والمصادقة وسلة الطلبات
export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
