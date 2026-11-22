import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlobalInteractiveBackground from './components/common/GlobalInteractiveBackground';
import FloatingActions from './components/common/FloatingActions';
import Navbar from './components/layout/Navbar';
import TabLoader from './components/layout/TabLoader';
import Footer from './components/layout/Footer';
import CartDrawer from './components/modals/CartDrawer';
import FlyToCartOverlay from './components/common/FlyToCartOverlay';
import SettingsDrawer from './components/modals/SettingsDrawer';
import AuthModal from './components/modals/AuthModal';
import FarmersModal from './components/modals/FarmersModal';
import HomePage from './pages/HomePage';
import BuyerDashboard from './pages/BuyerDashboard';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { SITE_CONFIG } from './config/siteConfig';
import { mockProducts } from './data/mockData';
import { openWhatsApp } from './services/whatsapp';
import {
  USE_MOCK_API,
  productsApi,
  ordersApi,
  formatApiProduct,
} from './services/api';

// خريطة مطابقة معرفات تبويبات شريط التنقل بفئات التصفية
const TAB_TO_CATEGORY_MAP = {
  home: 'all',
  crops: 'all',
  origins: 'all',
  'roasted-coffee': 'roasted',
  'green-coffee': 'green',
  'special-blends': 'blends',
  contact: 'all',
};

// خريطة عكسية لمطابقة الفئة بالتبويب في الشريط العلوي
const CATEGORY_TO_TAB_MAP = {
  all: 'home',
  roasted: 'crops',
  green: 'crops',
  blends: 'crops',
  haraz: 'crops',
  matari: 'crops',
};

// المكوّن الداخلي للتطبيق بعد تغليفه بمزودات السياق
function AppContent() {
  const { openSettings, isEnglish } = useSettings();

  // مزامنة عنوان المتصفح مع اسم المنصة والشعار الفرعي حسب اللغة النشطة
  useEffect(() => {
    const lang = isEnglish ? 'en' : 'ar';
    document.title = `${SITE_CONFIG.brand.name} | ${SITE_CONFIG.brand.subtitle[lang]}`;
  }, [isEnglish]);

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

  // قائمة المنتجات المعروضة في المتجر (محاكاة أو من خادم Laravel)
  const [products, setProducts] = useState(mockProducts);

  // جلب المنتجات من خادم الـ API الحقيقي عند تفعيل الوضع الحي
  useEffect(() => {
    if (USE_MOCK_API) return;

    let isMounted = true;
    productsApi
      .list({ per_page: 50 })
      .then((res) => {
        if (!isMounted) return;
        const apiList = res?.data;
        if (Array.isArray(apiList) && apiList.length > 0) {
          const formatted = apiList.map(formatApiProduct).filter(Boolean);
          setProducts(formatted);
        }
      })
      .catch((err) => {
        console.warn('تعذر جلب المنتجات من خادم Laravel، استخدام البيانات البديلة:', err?.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // دالة فتح نافذة خدمة المزارعين
  const handleOpenFarmersModal = () => {
    setIsFarmersModalOpen(true);
  };

  // دالة إغلاق نافذة خدمة المزارعين
  const handleCloseFarmersModal = () => {
    setIsFarmersModalOpen(false);
  };

  // دالة تغيير التبويب من الشريط العلوي مع تفعيل تأثير التحميل والتمرير السلس
  const handleTabChange = (newTab) => {
    // 1. التمرير إلى قسم تواصل معنا في الفوتر
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

    // 2. التمرير إلى قسم المتجر والمحاصيل
    if (newTab === 'crops') {
      if (currentView !== 'home') {
        setIsLoading(true);
        setTimeout(() => {
          setCurrentView('home');
          setActiveTab('crops');
          setIsLoading(false);
          setTimeout(() => {
            const cropsSection = document.getElementById('coffee-products');
            if (cropsSection) cropsSection.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }, 350);
      } else {
        setActiveTab('crops');
        const cropsSection = document.getElementById('coffee-products');
        if (cropsSection) cropsSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    // 3. التمرير إلى قسم المصادر والمزارعون
    if (newTab === 'origins') {
      if (currentView !== 'home') {
        setIsLoading(true);
        setTimeout(() => {
          setCurrentView('home');
          setActiveTab('origins');
          setIsLoading(false);
          setTimeout(() => {
            const originsSection = document.getElementById('platform-features');
            if (originsSection) originsSection.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }, 350);
      } else {
        setActiveTab('origins');
        const originsSection = document.getElementById('platform-features');
        if (originsSection) originsSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    // 4. التمرير إلى أعلى الصفحة للرئيسية
    if (newTab === 'home') {
      if (currentView !== 'home') {
        setIsLoading(true);
        setTimeout(() => {
          setCurrentView('home');
          setActiveTab('home');
          setIsLoading(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 350);
      } else {
        setActiveTab('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (newTab === activeTab && currentView === 'home') return;

    // إظهار TabLoader للتبويبات العامة
    setIsLoading(true);

    setTimeout(() => {
      setActiveTab(newTab);
      setCurrentView('home');
      const matchingCategory = TAB_TO_CATEGORY_MAP[newTab] || 'all';
      setSelectedCategory(matchingCategory);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 350);

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

  // دالة تصفح المحاصيل من أي مكان مع التبديل الفوري للصفحة الرئيسية والتمرير السلس لقسم المتجر
  const handleBrowseProducts = () => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setActiveTab('crops');
      setTimeout(() => {
        const cropsSection = document.getElementById('coffee-products');
        if (cropsSection) {
          cropsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 120);
    } else {
      setActiveTab('crops');
      const cropsSection = document.getElementById('coffee-products');
      if (cropsSection) {
        cropsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // دالة الطلب المباشر عبر واتساب لمحصول فردي
  const handleWhatsAppOrder = async (product) => {
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
          quantity: product.quantity || 1,
          price: product.price,
        },
      ],
    };

    // مزامنة الطلب مع خادم Laravel عند تفعيل الوضع الحي
    if (!USE_MOCK_API) {
      try {
        const res = await ordersApi.create({
          type: product.is_reservable ? 'reservation' : 'purchase',
          items: [{ product_id: product.id, quantity: product.quantity || 1 }],
        });

        // اعتماد رقم الطلب الحقيقي الصادر من خادم Laravel
        if (res?.data?.id) {
          singleOrder.id = `ORD-${res.data.id}`;
        } else if (res?.order_id) {
          singleOrder.id = `ORD-${res.order_id}`;
        }

        // إشعار باقي الواجهات لتحديث سجل الطلبات
        window.dispatchEvent(new CustomEvent('orders_updated'));
      } catch (err) {
        console.error('تعذر حفظ طلب الحجز في خادم Laravel:', err);
        // منع فتح واتساب في حال فشل الطلب من الخادم
        alert(
          err?.message ||
            (isEnglish
              ? 'Failed to submit reservation. Please check quantity and try again.'
              : 'تعذر إتمام طلب الحجز، يرجى التحقق من توفر الكمية المطلوبة والمحاولة مرة أخرى.')
        );
        return;
      }
    }

    openWhatsApp(singleOrder);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans transition-colors duration-200 relative overflow-x-hidden">
      {/* 0. الخلفية التفاعلية الشاملة لكامل المنصة */}
      <GlobalInteractiveBackground />

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
      <CartDrawer onBrowseProducts={handleBrowseProducts} />

      {/* طبقة تأثير طيران المنتج نحو السلة */}
      <FlyToCartOverlay />

      {/* 4. لوحة إعدادات المنصة والمظهر الجانبية */}
      <SettingsDrawer />

      {/* 5. نافذة تسجيل الدخول وإنشاء الحساب المنبثقة */}
      <AuthModal />

      {/* 6. نافذة خدمة المزارعين والتعاونيات الزراعية المنبثقة */}
      <FarmersModal
        isOpen={isFarmersModalOpen}
        onClose={handleCloseFarmersModal}
      />

      {/* 7. عرض الصفحة الرئيسية أو لوحة حساب المشتري مع انتقال حركي ناعم فوق الخلفية التفاعلية */}
      <main className="flex-1 pt-24 sm:pt-28 relative z-10">
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
                products={products}
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
                onWhatsAppOrder={handleWhatsAppOrder}
                onOpenFarmersModal={handleOpenFarmersModal}
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

      {/* 8. التذييل السفلي للمنصة فوق الخلفية التفاعلية */}
      <div className="relative z-10">
        <Footer
          onSelectTab={handleTabChange}
          onNavigateToDashboard={handleNavigateToDashboard}
          onOpenFarmersModal={handleOpenFarmersModal}
          onOpenSettings={openSettings}
        />
      </div>

      {/* 9. الأزرار العائمة الذكية (دعم واتساب الفوري والعودة للأعلى) */}
      <FloatingActions />
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
