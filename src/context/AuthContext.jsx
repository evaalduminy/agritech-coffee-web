import { createContext, useContext, useState, useEffect, useRef } from 'react';

// إنشاء سياق إدارة حالة المصادقة وحسابات المستخدمين
const AuthContext = createContext(null);

// المفتاح المخصص لحفظ جلسة المستخدم في التخزين المحلي
const AUTH_STORAGE_KEY = 'agritech_coffee_user';

// دالة مساعدة لتنظيف رقم الهاتف أو المعرف من أي مسافات أو رموز
const sanitizePhone = (val) => {
  return String(val || '').replace(/[\s\-_]/g, '').trim();
};

// فحص ما إذا كان الرقم يطابق رقم الأدمن
const checkIsAdminPhone = (val) => {
  const clean = sanitizePhone(val);
  return clean === '777000000' || clean.endsWith('777000000');
};

// مزود سياق المصادقة لكافة أنحاء التطبيق
export function AuthProvider({ children }) {
  // حالة المستخدم الحالي مع استرجاع الصلاحية دور المشتري أو المالك
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const isPhoneAdmin = checkIsAdminPhone(parsed.phone) || checkIsAdminPhone(parsed.emailOrPhone);
        if (isPhoneAdmin) {
          parsed.role = 'admin';
          if (!parsed.name || parsed.name === 'عميل سوق البن' || parsed.name === 'إدارة المنصة (المالك)') {
            parsed.name = 'مدير المنصة';
          }
        } else if (!parsed.role) {
          parsed.role = 'buyer';
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  // حالة فتح وإغلاق نافذة تسجيل الدخول المنبثقة
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // مرجع لتخزين الإجراء المعلق المطلوب تنفيذه تلقائياً بعد نجاح الدخول
  const pendingCallbackRef = useRef(null);

  // حفظ بيانات المستخدم في التخزين المحلي عند تسجيل الدخول أو تحديثه
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (error) {
      console.error('فشل في حفظ بيانات الجلسة محلياً:', error);
    }
  }, [user]);

  // دالة تسجيل الدخول مع تنظيف رقم الهاتف وتعيين صلاحية الأدمن بدقة
  const login = (credentials = {}) => {
    const rawIdentifier = String(credentials.identifier || '');
    const cleanIdentifier = sanitizePhone(rawIdentifier);
    const hasExplicitName = Boolean(credentials.name && credentials.name.trim());

    // فحص رقم الهاتف المنظف لتحديد صلاحية المالك بدقة
    const isAdminUser = checkIsAdminPhone(cleanIdentifier);
    const userRole = isAdminUser ? 'admin' : 'buyer';

    // تعيين الاسم المناسب: إذا كان مالكاً ولم يُدخل اسماً يظهر "مدير المنصة"
    let displayName = 'عميل سوق البن';
    if (hasExplicitName) {
      displayName = credentials.name.trim();
    } else if (isAdminUser) {
      displayName = 'مدير المنصة';
    }

    const loggedUser = {
      id: userRole === 'admin' ? 'USR-ADMIN-01' : 'USR-2026-101',
      name: displayName,
      phone: cleanIdentifier || '771234567',
      emailOrPhone: rawIdentifier.trim() || '771234567',
      role: userRole,
      isFarmerPartner: false,
    };

    setUser(loggedUser);
    setIsAuthModalOpen(false);

    // تنفيذ الإجراء المعلق فوراً بعد تسجيل الدخول إن وجد
    if (typeof pendingCallbackRef.current === 'function') {
      const callback = pendingCallbackRef.current;
      pendingCallbackRef.current = null;
      setTimeout(() => {
        callback(loggedUser);
      }, 100);
    }
  };

  // دالة إنشاء حساب جديد مع تنظيف الرقم والتحقق
  const register = (userData = {}) => {
    const rawIdentifier = String(userData.identifier || '');
    const cleanIdentifier = sanitizePhone(rawIdentifier);
    const hasExplicitName = Boolean(userData.name && userData.name.trim());

    const isAdminUser = checkIsAdminPhone(cleanIdentifier);
    const userRole = isAdminUser ? 'admin' : 'buyer';

    let displayName = 'عميل سوق البن';
    if (hasExplicitName) {
      displayName = userData.name.trim();
    } else if (isAdminUser) {
      displayName = 'مدير المنصة';
    }

    const newUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: displayName,
      phone: cleanIdentifier || '770000000',
      emailOrPhone: rawIdentifier.trim() || '770000000',
      role: userRole,
      isFarmerPartner: false,
    };

    setUser(newUser);
    setIsAuthModalOpen(false);

    // تنفيذ الإجراء المعلق فوراً بعد إنشاء الحساب إن وجد
    if (typeof pendingCallbackRef.current === 'function') {
      const callback = pendingCallbackRef.current;
      pendingCallbackRef.current = null;
      setTimeout(() => {
        callback(newUser);
      }, 100);
    }
  };

  // دالة تسجيل الخروج ومسح الجلسة
  const logout = () => {
    setUser(null);
    pendingCallbackRef.current = null;
  };

  // دالة التحقق الإلزامي من المصادقة (requireAuth)
  const requireAuth = (callback) => {
    if (user) {
      if (typeof callback === 'function') {
        callback(user);
      }
    } else {
      pendingCallbackRef.current = callback;
      setIsAuthModalOpen(true);
    }
  };

  // فتح نافذة المصادقة مباشرة بدون إجراء معلق
  const openAuthModal = () => {
    pendingCallbackRef.current = null;
    setIsAuthModalOpen(true);
  };

  // إغلاق نافذة المصادقة وإلغاء أي إجراء معلق
  const closeAuthModal = () => {
    pendingCallbackRef.current = null;
    setIsAuthModalOpen(false);
  };

  // متغير مساعد للتحقق من امتلاك المستخدم صلاحية المالك (Admin)
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isAdmin,
    isAuthModalOpen,
    login,
    register,
    logout,
    requireAuth,
    openAuthModal,
    closeAuthModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// دالة مخصصة لسهولة الوصول إلى سياق المصادقة
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
