import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  Package,
  Calendar,
  Clock,
  CheckCircle2,
  LogOut,
  Phone,
  MapPin,
  ShoppingBag,
  Receipt,
  Headphones,
  MessageSquare,
  Edit3,
  Sprout,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { SITE_CONFIG } from '../config/siteConfig';
import { mockOrders, mockProducts } from '../data/mockData';
import { openWhatsApp } from '../services/whatsapp';
import {
  USE_MOCK_API,
  ordersApi,
  formatApiOrder,
} from '../services/api';

// صفحة حساب المشتري التفاعلية (Buyer Dashboard) مع دعم كامل للغتين
export default function BuyerDashboard({ onReturnToStore = () => {} }) {
  const { user, logout } = useAuth();
  const { t, isEnglish } = useSettings();

  // خريطة مطابقة حالات المعاملات مع الشارات النصية واللونية
  const statusConfig = {
    pending: {
      label: t('dashboard.statusPending'),
      badgeClass: 'bg-secondary-fixed text-on-secondary-fixed dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30 border border-transparent',
      dotClass: 'bg-secondary dark:bg-amber-400 animate-ping',
    },
    confirmed: {
      label: t('dashboard.statusConfirmed'),
      badgeClass: 'bg-primary-fixed text-on-primary-fixed dark:bg-white/10 dark:text-neutral-200 dark:border-white/15 border border-transparent',
      dotClass: 'bg-primary dark:bg-white',
    },
    completed: {
      label: t('dashboard.statusCompleted'),
      badgeClass: 'bg-surface-container-high text-primary dark:bg-white/10 dark:text-neutral-200 dark:border-white/15 border border-transparent',
      dotClass: 'bg-primary dark:bg-white',
    },
  };

  // خريطة مطابقة أنواع المعاملات
  const typeConfig = {
    order: {
      label: t('dashboard.typeOrder'),
      badgeClass: 'bg-surface-container-low text-on-surface-variant dark:bg-white/10 dark:text-neutral-200 dark:border-white/15 border border-transparent',
    },
    reservation: {
      label: t('dashboard.typeReservation'),
      badgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed font-bold dark:bg-white/10 dark:text-neutral-200 dark:border-white/15 border border-transparent',
    },
  };

  // خريطة أسماء تبويبات التصفية السريعة
  const filterTabs = [
    { id: 'all', label: t('dashboard.filterAll') },
    { id: 'orders', label: t('dashboard.filterOrders') },
    { id: 'reservations', label: t('dashboard.filterReservations') },
    { id: 'pending', label: t('dashboard.filterPending') },
    { id: 'confirmed', label: t('dashboard.filterConfirmed') },
    { id: 'completed', label: t('dashboard.filterCompleted') },
  ];

  // حالة التبويب النشط الرئيسي (all | orders | reservations | address)
  const [activeTab, setActiveTab] = useState('all');

  // حالة فلترة المعاملات السريعة
  const [activeFilter, setActiveFilter] = useState('all');

  // حالة فتح نافذة تأكيد تسجيل الخروج
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // حالة نمط تعديل بيانات التوصيل
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // بيانات التوصيل والتواصل المحفوظة للمشتري وفق المعايير الرسمية
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: user?.name || (isEnglish ? 'Website Guest' : 'زائر عبر الموقع'),
    phone: user?.phone || user?.emailOrPhone || (isEnglish ? 'To be confirmed' : 'يُحدَّد عند التواصل'),
    address: user?.address || user?.city || (isEnglish ? 'To be confirmed' : 'يُحدَّد عند التواصل'),
  });

  // استخراج الاسم ورقم الهاتف بوضوح من بيانات الجلسة الحالية
  const buyerName = user?.name || deliveryDetails.name;
  const buyerPhone = user?.phone || user?.emailOrPhone || deliveryDetails.phone;

  // التحقق من أن أول محرف هو حرف أبجدي وليس رقماً لعرضه في الأفاتار
  const firstLetter = buyerName.trim().charAt(0);
  const isRealName = !/^\d/.test(firstLetter) && firstLetter !== '+';

  // نموذج تعديل البيانات المؤقت
  const [tempDetails, setTempDetails] = useState({ ...deliveryDetails });

  // قائمة المعاملات الكاملة (في الوضع الحي تبدأ فارغة وتُجلب فقط من الخادم دون دمج)
  const [orders, setOrders] = useState(() => {
    // في الوضع الحي: منع قراءة mockOrders أو localStorage نهائياً
    if (!USE_MOCK_API) {
      return [];
    }
    try {
      const saved = localStorage.getItem('agritech_coffee_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // الاعتماد على البيانات التجريبية الافتراضية
    }
    return mockOrders;
  });

  // جلب سجل طلبات المشتري من خادم Laravel عند تفعيل الوضع الحي
  useEffect(() => {
    if (USE_MOCK_API) return;

    if (!user) {
      setOrders([]);
      return;
    }

    let isMounted = true;
    ordersApi
      .listOwn({ per_page: 50 })
      .then((res) => {
        if (!isMounted) return;
        const apiOrders = res?.data;
        if (Array.isArray(apiOrders)) {
          const formatted = apiOrders.map(formatApiOrder).filter(Boolean);
          setOrders(formatted);
        } else {
          setOrders([]);
        }
      })
      .catch((err) => {
        console.warn('تعذر جلب سجل الطلبات من خادم Laravel:', err?.message);
        if (isMounted) setOrders([]);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  // الاستماع لتحديثات الطلبات الجديدة فور تسجيلها عبر السلة
  useEffect(() => {
    const handleOrdersUpdated = () => {
      // في الوضع الحي: إعادة جلب الطلبات من خادم Laravel فقط دون قراءة أي تخزين محلي
      if (!USE_MOCK_API) {
        if (user) {
          ordersApi
            .listOwn({ per_page: 50 })
            .then((res) => {
              const apiOrders = res?.data;
              if (Array.isArray(apiOrders)) {
                setOrders(apiOrders.map(formatApiOrder).filter(Boolean));
              }
            })
            .catch(() => {});
        }
        return;
      }

      // في الوضع التجريبي فقط: قراءة الطلبات من localStorage أو mockOrders
      try {
        const saved = localStorage.getItem('agritech_coffee_orders');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setOrders(parsed);
        }
      } catch {
        // تجاهل الأخطاء
      }
    };

    window.addEventListener('orders_updated', handleOrdersUpdated);
    return () => window.removeEventListener('orders_updated', handleOrdersUpdated);
  }, [user]);

  // إجمالي الإحصائيات المحسوبة
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const activeReservationsCount = orders.filter((o) => o.type === 'reservation').length;
  const totalSpentUsd = orders.reduce((sum, o) => sum + Number(o.total_price || 0), 0).toFixed(2);

  // تصفية المعاملات ديناميكياً بحسب التبويب والفلتر
  const filteredOrders = orders.filter((order) => {
    // تصفية التبويب الجانبي
    if (activeTab === 'orders' && order.type !== 'order') return false;
    if (activeTab === 'reservations' && order.type !== 'reservation') return false;

    // تصفية الأزرار العلوية
    if (activeFilter === 'orders' && order.type !== 'order') return false;
    if (activeFilter === 'reservations' && order.type !== 'reservation') return false;
    if (activeFilter === 'pending' && order.status !== 'pending') return false;
    if (activeFilter === 'confirmed' && order.status !== 'confirmed') return false;
    if (activeFilter === 'completed' && order.status !== 'completed') return false;

    return true;
  });

  // دالة المتابعة الفورية عبر واتساب لمعاملة معينة
  const handleWhatsAppInquiry = (order) => {
    openWhatsApp(order, {
      name: deliveryDetails.name,
      phone: deliveryDetails.phone,
      city: deliveryDetails.address,
      isEnglish,
    });
  };

  // دالة حفظ بيانات التوصيل المعدلة
  const handleSaveDeliveryDetails = (e) => {
    e.preventDefault();
    setDeliveryDetails({ ...tempDetails });
    setIsEditingAddress(false);
  };

  // دالة تأكيد تسجيل الخروج
  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
    onReturnToStore();
  };

  const NavArrow = isEnglish ? ChevronRight : ChevronLeft;

  return (
    <div className="w-full bg-surface min-h-screen text-start">
      <div className="max-w-7xl mx-auto px-margin py-space-lg flex flex-col gap-space-lg">
        
        {/* 1. شريط المسار والعودة السريعة إلى المتجر */}
        <nav className="flex items-center justify-between text-on-surface-variant font-label-md text-label-md">
          <div className="flex items-center gap-space-xs">
            <button
              type="button"
              onClick={onReturnToStore}
              className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>{t('dashboard.breadcrumbHome')}</span>
            </button>
            <NavArrow className="w-4 h-4 text-outline-variant" />
            <button
              type="button"
              onClick={onReturnToStore}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              {t('dashboard.breadcrumbStore')}
            </button>
            <NavArrow className="w-4 h-4 text-outline-variant" />
            <span className="text-primary font-bold">{t('dashboard.breadcrumbCurrent')}</span>
          </div>

          <button
            type="button"
            onClick={onReturnToStore}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t('dashboard.returnToStore')}</span>
          </button>
        </nav>

        {/* 2. بطاقة الترحيب العلوية وشريط الإحصائيات الفورية */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-[0_8px_30px_rgba(24,80,4,0.05)] p-space-lg md:p-space-xl border border-surface-container">
          {/* تدرجات عضوية ناعمة */}
          <div className="absolute -top-24 -left-20 w-80 h-80 rounded-full bg-gradient-to-br from-primary-fixed/25 to-tertiary-fixed/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 right-1/4 w-96 h-60 rounded-full bg-secondary-fixed/25 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
            {/* معلومات المشتري والشعار */}
            <div className="flex items-center gap-space-md">
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-on-primary shadow-md overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={buyerName} className="w-full h-full object-cover" />
                  ) : isRealName ? (
                    <span className="font-headline-md text-headline-md font-bold">
                      {firstLetter}
                    </span>
                  ) : (
                    <User className="w-7 h-7" />
                  )}
                </div>
                <div
                  className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow"
                  title={t('dashboard.verifiedBuyer')}
                >
                  <BadgeCheck className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex flex-col text-start">
                <div className="flex items-center gap-space-xs flex-wrap">
                  <h1 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                    {t('dashboard.welcome')} {buyerName}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    {t('dashboard.verifiedBuyer')}
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1 flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-primary" />
                  <span>
                    {t('dashboard.eliteMember')}{' '}
                    <span className="font-bold text-on-surface" dir="ltr">
                      #{user?.id || 'BYN-8840'}
                    </span>
                  </span>
                </p>
              </div>
            </div>

            {/* بطاقات الإحصائيات الأربع */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
              <div className="p-space-sm px-space-md rounded-xl bg-surface-container-low flex flex-col text-start hover:bg-surface-container transition-colors">
                <span className="font-label-sm text-label-sm text-on-surface-variant">{t('dashboard.totalOrders')}</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    {totalOrdersCount}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{t('dashboard.transactionsUnit')}</span>
                </div>
              </div>

              <div className="p-space-sm px-space-md rounded-xl bg-secondary-fixed/40 flex flex-col text-start">
                <span className="font-label-sm text-label-sm text-on-secondary-fixed-variant">{t('dashboard.underReview')}</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-headline-sm text-headline-sm text-secondary font-bold">
                    {pendingOrdersCount}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-secondary-fixed-variant">{t('dashboard.ordersUnit')}</span>
                </div>
              </div>

              <div className="p-space-sm px-space-md rounded-xl bg-tertiary-fixed/50 flex flex-col text-start">
                <span className="font-label-sm text-label-sm text-on-tertiary-fixed-variant">{t('dashboard.activeReservations')}</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-headline-sm text-headline-sm text-tertiary font-bold">
                    {activeReservationsCount}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-tertiary-fixed-variant">{t('dashboard.cropsUnit')}</span>
                </div>
              </div>

              <div className="p-space-sm px-space-md rounded-xl bg-primary-fixed/40 flex flex-col text-start">
                <span className="font-label-sm text-label-sm text-on-primary-fixed-variant">{t('dashboard.totalPurchases')}</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-headline-sm text-headline-sm text-primary font-bold" dir="ltr">
                    ${totalSpentUsd}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. شبكة مساحة العمل الرئيسية */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          
          {/* العمود الجانبي (4 من 12) */}
          <aside className="lg:col-span-4 flex flex-col gap-space-lg">
            
            {/* بطاقة هوية المشتري المعتمد */}
            <div className="rounded-2xl bg-surface-container-lowest p-space-lg shadow-[0_4px_20px_rgba(24,80,4,0.04)] border border-surface-container flex flex-col gap-space-md">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                    <BadgeCheck className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col text-start">
                    <span className="font-label-lg text-label-lg text-on-surface font-bold">
                      {buyerName}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {t('dashboard.verifiedImporter')}
                    </span>
                  </div>
                </div>
                <ShieldCheck className="w-5 h-5 text-primary" title={t('dashboard.verifiedBuyer')} />
              </div>

              <div className="flex flex-col gap-space-xs pt-space-xs text-on-surface-variant font-body-sm text-body-sm">
                <div className="flex items-center justify-between py-1.5 bg-surface-container-low px-space-sm rounded-lg">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>{t('dashboard.directPhone')}</span>
                  </span>
                  <span className="font-bold text-on-surface" dir="ltr">
                    {buyerPhone}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 bg-surface-container-low px-space-sm rounded-lg">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{t('dashboard.mainLocation')}</span>
                  </span>
                  <span className="font-medium text-on-surface truncate max-w-[150px]">
                    {deliveryDetails.address.split('،')[0] || deliveryDetails.address.split(',')[0]}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 bg-surface-container-low px-space-sm rounded-lg">
                  <span className="flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-primary" />
                    <span>{t('dashboard.preferredRoast')}</span>
                  </span>
                  <span className="font-medium text-on-surface">{t('dashboard.preferredRoastVal')}</span>
                </div>
              </div>
            </div>

            {/* قائمة التبويبات الجانبية */}
            <nav className="rounded-2xl bg-surface-container-lowest p-space-sm shadow-[0_4px_20px_rgba(24,80,4,0.04)] border border-surface-container flex flex-col gap-space-xs">
              {/* تبويب: طلباتي */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('orders');
                  setActiveFilter('all');
                }}
                className={`flex items-center justify-between px-space-md py-3 rounded-xl font-label-lg text-label-lg transition-all cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-primary-fixed/40 text-primary font-bold shadow-xs'
                    : 'hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-space-sm">
                  <Receipt className="w-5 h-5" />
                  <span>{t('dashboard.tabOrders')}</span>
                </div>
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-label-sm text-label-sm flex items-center justify-center font-bold">
                  {orders.filter((o) => o.type === 'order').length}
                </span>
              </button>

              {/* تبويب: حجوزاتي */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('reservations');
                  setActiveFilter('all');
                }}
                className={`flex items-center justify-between px-space-md py-3 rounded-xl font-label-lg text-label-lg transition-all cursor-pointer ${
                  activeTab === 'reservations'
                    ? 'bg-primary-fixed/40 text-primary font-bold shadow-xs'
                    : 'hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-space-sm">
                  <Calendar className="w-5 h-5" />
                  <span>{t('dashboard.tabReservations')}</span>
                </div>
                <span className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center font-bold">
                  {activeReservationsCount}
                </span>
              </button>

              {/* تبويب: بياناتي وعناوين التوصيل */}
              <button
                type="button"
                onClick={() => setActiveTab('address')}
                className={`flex items-center justify-between px-space-md py-3 rounded-xl font-label-lg text-label-lg transition-all cursor-pointer ${
                  activeTab === 'address'
                    ? 'bg-primary-fixed/40 text-primary font-bold shadow-xs'
                    : 'hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-space-sm">
                  <MapPin className="w-5 h-5" />
                  <span>{t('dashboard.tabAddress')}</span>
                </div>
                <NavArrow className="w-4 h-4 text-outline-variant" />
              </button>

              <div className="my-space-xs h-px bg-surface-container-high" />

              {/* زر تسجيل الخروج مع تأكيد مسبق */}
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(true)}
                className="w-full flex items-center justify-between px-space-md py-3 rounded-xl text-error hover:bg-error-container/40 transition-colors font-label-lg text-label-lg cursor-pointer"
              >
                <div className="flex items-center gap-space-sm">
                  <LogOut className="w-5 h-5" />
                  <span>{t('dashboard.logout')}</span>
                </div>
                <NavArrow className="w-4 h-4 text-error" />
              </button>
            </nav>

            {/* صندوق استشارة المهندس الزراعي الميداني */}
            <div className="rounded-2xl bg-gradient-to-br from-surface-container-low to-secondary-fixed/20 dark:from-transparent dark:to-transparent dark:bg-[#191d1a] p-space-lg flex flex-col gap-space-sm border border-surface-container dark:border-white/10 text-start">
              <div className="flex items-center gap-space-xs">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-on-secondary shadow-xs">
                  <Headphones className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-start">
                  <span className="font-label-md text-label-md text-on-surface dark:text-white font-bold">
                    {t('dashboard.advisorTitle')}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant dark:text-neutral-300">
                    {t('dashboard.advisorSubtitle')}
                  </span>
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-neutral-300 leading-relaxed">
                {t('dashboard.advisorDesc')}
              </p>
              <a
                href={`https://wa.me/${SITE_CONFIG.contact.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-space-xs w-full py-2.5 px-space-md bg-primary hover:bg-[#204613] text-on-primary font-label-md text-label-md rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t('dashboard.advisorWhatsApp')}</span>
              </a>
            </div>

          </aside>

          {/* العمود الرئيسي لعرض المحتوى والمعاملات (8 من 12) */}
          <main className="lg:col-span-8 flex flex-col gap-space-lg">
            
            {/* شريط رأس المحتوى وأزرار التصفية السريعة */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md text-start">
              <div className="flex flex-col">
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {t('dashboard.historyTitle')}
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {t('dashboard.historyDesc')}
                </p>
              </div>

              {/* أزرار التصفية السريعة */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {filterTabs.map((tab) => {
                  const isSelected = activeFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveFilter(tab.id);
                        if (tab.id === 'orders' || tab.id === 'reservations') {
                          setActiveTab(tab.id);
                        } else {
                          setActiveTab('all');
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary text-on-primary shadow-xs font-bold'
                          : 'bg-surface-container-high hover:bg-surface-variant text-on-surface-variant'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* قائمة بطاقات الطلبات والحجوزات */}
            <div className="flex flex-col gap-space-md">
              <AnimatePresence mode="popLayout">
                {filteredOrders.map((order) => {
                  const statusInfo = statusConfig[order.status] || statusConfig.pending;
                  const typeInfo = typeConfig[order.type] || typeConfig.order;
                  const firstItem = order.items && order.items[0];
                  
                  const matchedProduct = mockProducts.find(
                    (p) => p.id === (firstItem?.product_id || 1)
                  ) || mockProducts[0];

                  const matchedName = isEnglish ? (matchedProduct.name_en || matchedProduct.name) : (firstItem?.name || matchedProduct.name);
                  const matchedWeight = isEnglish ? (matchedProduct.weight_en || matchedProduct.weight) : matchedProduct.weight;
                  const matchedRoast = isEnglish ? (matchedProduct.roast_level_en || matchedProduct.roast_level) : matchedProduct.roast_level;
                  const matchedOrigin = isEnglish ? (matchedProduct.origin_en || matchedProduct.origin) : matchedProduct.origin;

                  const totalYer = Math.round(order.total_price * 250).toLocaleString();

                  return (
                    <motion.div
                      key={order.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.25 }}
                      className="rounded-2xl bg-surface-container-lowest p-space-md md:p-space-lg shadow-[0_6px_24px_rgba(24,80,4,0.04)] border border-surface-container flex flex-col gap-space-md hover:shadow-md transition-all text-start"
                    >
                      {/* الشريط العلوي لبيانات المعاملة */}
                      <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-sm border-b border-surface-container">
                        <div className="flex items-center gap-space-sm flex-wrap">
                          <span className="font-label-lg text-label-lg text-primary font-bold" dir="ltr">
                            #{order.id}
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{order.created_at}</span>
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${typeInfo.badgeClass}`}>
                            {typeInfo.label}
                          </span>
                        </div>

                        {/* شارة حالة المعاملة */}
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-label-sm text-label-sm font-bold shadow-2xs ${statusInfo.badgeClass}`}>
                          <span className={`w-2 h-2 rounded-full ${statusInfo.dotClass}`} />
                          <span>{statusInfo.label}</span>
                        </div>
                      </div>

                      {/* قسم تفاصيل المنتج والكمية */}
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-space-md">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-low border border-surface-container">
                          <img
                            src={matchedProduct.image_url}
                            alt={matchedName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 flex flex-col text-start w-full">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                            <div>
                              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                                {matchedName}
                              </h3>
                              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                                {matchedWeight} - {matchedRoast} • {matchedOrigin}
                              </p>
                            </div>

                            <div className="text-start sm:text-end mt-2 sm:mt-0">
                              <span className="font-headline-sm text-headline-sm text-primary font-bold" dir="ltr">
                                ${order.total_price.toFixed(2)}
                              </span>
                              <p className="font-body-sm text-body-sm text-on-surface-variant" dir="ltr">
                                (~ {totalYer} {t('product.yerUnit')})
                              </p>
                            </div>
                          </div>

                          <div className="mt-space-sm pt-space-xs flex flex-wrap items-center gap-x-6 gap-y-2 text-on-surface-variant font-body-sm text-body-sm bg-surface-container-low p-space-sm rounded-xl">
                            <div className="flex items-center gap-1.5">
                              <Package className="w-4 h-4 text-primary" />
                              <span>
                                {t('dashboard.quantityLabel')}{' '}
                                <strong className="text-on-surface font-bold">
                                  {firstItem?.quantity || 1} {t('dashboard.quantityUnit')}
                                </strong>
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-primary" />
                              <span>
                                {t('dashboard.deliveryAddressLabel')}{' '}
                                <span className="text-on-surface font-medium truncate max-w-[280px]">
                                  {deliveryDetails.address}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* شريط الإجراءات والربط مع واتساب */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-space-xs border-t border-surface-container/60">
                        <div className="flex items-center gap-1.5 text-primary font-label-md text-xs">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t('dashboard.directTraceBadge')}</span>
                        </div>

                        <div className="flex items-center gap-space-sm w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => handleWhatsAppInquiry(order)}
                            className="w-full sm:w-auto px-space-md py-2.5 rounded-xl bg-primary hover:bg-[#204613] text-on-primary font-label-md text-label-md flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>{t('dashboard.followUpWhatsApp')}</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* حالة عدم وجود معاملات مطابقة */}
              {filteredOrders.length === 0 && (
                <div className="py-14 text-center flex flex-col items-center justify-center space-y-3 bg-surface-container-lowest rounded-2xl border border-surface-container p-6">
                  <Package className="w-12 h-12 text-outline" />
                  <p className="font-headline-sm text-on-surface font-semibold">
                    {t('dashboard.noHistoryTitle')}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveFilter('all');
                      setActiveTab('all');
                    }}
                    className="text-primary font-bold hover:underline cursor-pointer text-sm"
                  >
                    {t('dashboard.viewAllTransactions')}
                  </button>
                </div>
              )}
            </div>

            {/* 4. قسم بيانات التوصيل والتواصل المحفوظة */}
            <div
              id="shipping-section"
              className="rounded-2xl bg-surface-container-lowest p-space-lg shadow-[0_6px_24px_rgba(24,80,4,0.04)] border border-surface-container flex flex-col gap-space-md mt-2 text-start"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border-b border-surface-container pb-space-sm">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col text-start">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      {t('dashboard.savedDetailsTitle')}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {t('dashboard.savedDetailsDesc')}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="px-space-md py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{isEditingAddress ? t('dashboard.cancelEditBtn') : t('dashboard.editBtn')}</span>
                </button>
              </div>

              {isEditingAddress ? (
                /* نموذج تعديل البيانات */
                <form onSubmit={handleSaveDeliveryDetails} className="grid grid-cols-1 md:grid-cols-3 gap-space-md pt-space-xs">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1" htmlFor="edit-name">
                      {t('dashboard.buyerNameField')}
                    </label>
                    <input
                      id="edit-name"
                      type="text"
                      required
                      value={tempDetails.name}
                      onChange={(e) => setTempDetails({ ...tempDetails, name: e.target.value })}
                      className="w-full text-sm px-3 py-2 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1" htmlFor="edit-phone">
                      {t('dashboard.whatsappPhoneField')}
                    </label>
                    <input
                      id="edit-phone"
                      type="text"
                      required
                      value={tempDetails.phone}
                      onChange={(e) => setTempDetails({ ...tempDetails, phone: e.target.value })}
                      className="w-full text-sm px-3 py-2 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1" htmlFor="edit-address">
                      {t('dashboard.addressField')}
                    </label>
                    <input
                      id="edit-address"
                      type="text"
                      required
                      value={tempDetails.address}
                      onChange={(e) => setTempDetails({ ...tempDetails, address: e.target.value })}
                      className="w-full text-sm px-3 py-2 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="md:col-span-3 flex justify-end gap-2 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:bg-[#204613] transition-all cursor-pointer shadow-xs"
                    >
                      {t('dashboard.saveChangesBtn')}
                    </button>
                  </div>
                </form>
              ) : (
                /* عرض البطاقات الثلاث المحفوظة */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md pt-space-xs">
                  <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col text-start gap-1 border border-surface-container/60">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {t('dashboard.buyerCardName')}
                    </span>
                    <span className="font-label-lg text-label-lg text-on-surface font-bold">
                      {deliveryDetails.name}
                    </span>
                    <span className="font-body-sm text-xs text-primary flex items-center gap-1 mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t('dashboard.idMatchDesc')}</span>
                    </span>
                  </div>

                  <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col text-start gap-1 border border-surface-container/60">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {t('dashboard.whatsappCardTitle')}
                    </span>
                    <span className="font-label-lg text-label-lg text-on-surface font-bold" dir="ltr">
                      {deliveryDetails.phone}
                    </span>
                    <span className="font-body-sm text-xs text-primary flex items-center gap-1 mt-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{t('dashboard.autoNotifyDesc')}</span>
                    </span>
                  </div>

                  <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col text-start gap-1 border border-surface-container/60">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {t('dashboard.defaultAddressTitle')}
                    </span>
                    <span className="font-label-lg text-label-lg text-on-surface font-bold leading-snug">
                      {deliveryDetails.address}
                    </span>
                    <span className="font-body-sm text-xs text-on-surface-variant mt-1">
                      {t('dashboard.locationCode')}
                    </span>
                  </div>
                </div>
              )}
            </div>

          </main>

        </div>

      </div>

      {/* 5. نافذة تأكيد تسجيل الخروج المنبثقة */}
      <AnimatePresence>
        {isLogoutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogoutModalOpen(false)}
              className="fixed inset-0 bg-black/45 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-md rounded-2xl bg-surface-container-lowest p-space-lg shadow-2xl flex flex-col gap-space-md text-start border border-surface-container z-10"
            >
              <div className="w-12 h-12 rounded-xl bg-error-container text-error flex items-center justify-center shadow-xs">
                <LogOut className="w-6 h-6" />
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {t('dashboard.logoutModalTitle')}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {t('dashboard.logoutModalDesc')}
                </p>
              </div>

              <div className="flex items-center justify-end gap-space-sm mt-space-xs pt-2 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="px-space-md py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors cursor-pointer"
                >
                  {t('dashboard.cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLogout}
                  className="px-space-md py-2.5 rounded-xl bg-error text-on-error font-label-md text-label-md hover:opacity-90 shadow-sm transition-opacity cursor-pointer font-bold"
                >
                  {t('dashboard.confirmLogout')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
