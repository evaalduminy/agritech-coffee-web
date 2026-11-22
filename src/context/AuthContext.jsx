import { createContext, useContext, useState, useEffect } from 'react';
import {
  isFirebaseConfigured,
  auth,
  googleProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from '../config/firebase';
import {
  USE_MOCK_API,
  authApi,
  tokenStorage,
} from '../services/api';

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

  // رسالة إرشادية توضيحية لسبب طلب تسجيل الدخول إن وجدت
  const [authPromptMessage, setAuthPromptMessage] = useState('');

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

  // استرجاع المستخدم الموثق تلقائياً من خادم Laravel عند بدء التطبيق في الوضع الحقيقي
  useEffect(() => {
    if (USE_MOCK_API) return;

    const token = tokenStorage.getToken();
    if (!token) return;

    let isMounted = true;
    authApi
      .getCurrentUser()
      .then((res) => {
        if (!isMounted) return;
        const apiUser = res?.data || res?.user || res;
        if (apiUser) {
          const fullName = [apiUser.first_name, apiUser.last_name].filter(Boolean).join(' ') || apiUser.name || 'عميل سوق البن';
          setUser({
            ...apiUser,
            name: fullName,
            phone: apiUser.phone || '',
            emailOrPhone: apiUser.phone || apiUser.email || '',
            role: apiUser.role || 'buyer',
          });
        }
      })
      .catch((err) => {
        console.warn('تعذر استرجاع جلسة المستخدم من الخادم:', err?.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // الاستماع لحدث انتهاء صلاحية الجلسة لتسجيل الخروج تلقائياً
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleUnauthorized = () => {
      setUser(null);
      setAuthPromptMessage('');
    };

    window.addEventListener('agritech:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('agritech:unauthorized', handleUnauthorized);
    };
  }, []);

  // دالة تسجيل الدخول مع دعم التبديل السلس بين المحاكاة وخادم Laravel
  const login = async (credentials = {}) => {
    const rawIdentifier = String(credentials.phone || credentials.identifier || '');
    const cleanIdentifier = sanitizePhone(rawIdentifier);

    // 1. في حال تفعيل وضع الـ API الحقيقي
    if (!USE_MOCK_API) {
      try {
        const res = await authApi.login({
          phone: cleanIdentifier,
          password: credentials.password,
        });

        const token = res?.token || res?.data?.token || res?.access_token;
        if (token) {
          tokenStorage.setToken(token);
        }

        const apiUser = res?.data?.user || res?.user || res?.data || {};
        const fullName = [apiUser.first_name, apiUser.last_name].filter(Boolean).join(' ') || apiUser.name || 'عميل سوق البن';

        const loggedUser = {
          ...apiUser,
          name: fullName,
          phone: apiUser.phone || cleanIdentifier,
          emailOrPhone: apiUser.phone || apiUser.email || cleanIdentifier,
          role: apiUser.role || 'buyer',
        };

        setUser(loggedUser);
        setAuthPromptMessage('');
        setIsAuthModalOpen(false);
        return { success: true, user: loggedUser };
      } catch (err) {
        const errorMsg = err?.message || 'فشل تسجيل الدخول. يرجى التحقق من صحة البيانات.';
        return { success: false, error: errorMsg, errors: err?.errors };
      }
    }

    // 2. في حال وضع المحاكاة المحلية
    const hasExplicitName = Boolean(credentials.name && credentials.name.trim());
    const isAdminUser = checkIsAdminPhone(cleanIdentifier);
    const userRole = isAdminUser ? 'admin' : 'buyer';

    let displayName = 'عميل سوق البن';
    if (hasExplicitName) {
      displayName = credentials.name.trim();
    } else if (isAdminUser) {
      displayName = 'مدير المنصة';
    }

    const nameParts = displayName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const loggedUser = {
      id: userRole === 'admin' ? 'USR-ADMIN-01' : 'USR-2026-101',
      name: displayName,
      first_name: firstName,
      last_name: lastName,
      phone: cleanIdentifier || '771234567',
      emailOrPhone: rawIdentifier.trim() || cleanIdentifier || '771234567',
      role: userRole,
      isFarmerPartner: false,
    };

    setUser(loggedUser);
    setAuthPromptMessage('');
    setIsAuthModalOpen(false);
    return { success: true, user: loggedUser };
  };

  // دالة إنشاء حساب جديد متوافقة تماماً مع حقول جدول users في Laravel
  const register = async (userData = {}) => {
    const firstName = String(userData.first_name || '').trim();
    const lastName = String(userData.last_name || '').trim();
    const username = String(userData.username || '').replace(/\s+/g, '').trim();
    const email = String(userData.email || '').trim().toLowerCase();
    const rawPhone = String(userData.phone || userData.identifier || '');
    const cleanPhone = sanitizePhone(rawPhone);

    // 1. في حال تفعيل وضع الـ API الحقيقي
    if (!USE_MOCK_API) {
      try {
        const res = await authApi.register({
          first_name: firstName,
          last_name: lastName,
          username: username,
          email: email,
          phone: cleanPhone,
          password: userData.password,
        });

        const token = res?.token || res?.data?.token || res?.access_token;
        if (token) {
          tokenStorage.setToken(token);
        }

        const apiUser = res?.data?.user || res?.user || res?.data || {};
        const fullName = [apiUser.first_name, apiUser.last_name].filter(Boolean).join(' ') || apiUser.name || `${firstName} ${lastName}`.trim();

        const registeredUser = {
          ...apiUser,
          first_name: firstName,
          last_name: lastName,
          name: fullName,
          username: username,
          email: email,
          phone: cleanPhone,
          emailOrPhone: cleanPhone || email,
          role: apiUser.role || 'buyer',
        };

        setUser(registeredUser);
        setAuthPromptMessage('');
        setIsAuthModalOpen(false);
        return { success: true, user: registeredUser };
      } catch (err) {
        const errorMsg = err?.message || 'فشل إنشاء الحساب. يرجى التحقق من صحة البيانات.';
        return { success: false, error: errorMsg, errors: err?.errors };
      }
    }

    // 2. في حال وضع المحاكاة المحلية
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || userData.name || 'عميل سوق البن';
    const isAdminUser = checkIsAdminPhone(cleanPhone);
    const assignedRole = isAdminUser ? 'admin' : 'buyer';

    const newUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      first_name: firstName,
      last_name: lastName,
      name: fullName,
      username: username || `user_${Date.now().toString().slice(-4)}`,
      email: email,
      phone: cleanPhone || '770000000',
      emailOrPhone: cleanPhone || email || '770000000',
      role: assignedRole,
      isFarmerPartner: false,
      provider: 'local',
    };

    setUser(newUser);
    setAuthPromptMessage('');
    setIsAuthModalOpen(false);
    return { success: true, user: newUser };
  };

  // دالة تسجيل الدخول عبر Google باستخدام Firebase Authentication
  const loginWithGoogle = async (isEnglish = false) => {
    // التحقق من اكتمال إعدادات Firebase لتفادي تعطل التطبيق
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      const errorMsg = isEnglish
        ? 'Firebase is not configured in .env. Please configure your project keys.'
        : 'إعدادات Firebase غير مكتملة في ملف .env. يرجى إضافة مفاتيح المشروع.';
      return { success: false, error: errorMsg };
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result?.user;

      if (!fbUser) {
        throw new Error(isEnglish ? 'No user data received from Google.' : 'لم يتم استرجاع بيانات المستخدم من Google.');
      }

      // استخراج الاسم وتجزئته إلى الاسم الأول واسم العائلة
      const fullDisplayName = fbUser.displayName || (isEnglish ? 'Google User' : 'مستخدم جوجل');
      const nameParts = fullDisplayName.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const googleUser = {
        id: fbUser.uid || `USR-GGL-${Date.now().toString().slice(-4)}`,
        uid: fbUser.uid,
        name: fullDisplayName,
        first_name: firstName,
        last_name: lastName,
        email: fbUser.email || '',
        emailOrPhone: fbUser.email || fbUser.phoneNumber || '',
        phone: fbUser.phoneNumber || '',
        avatar: fbUser.photoURL || '',
        photoURL: fbUser.photoURL || '',
        role: 'buyer',
        isFarmerPartner: false,
        provider: 'google',
      };

      setUser(googleUser);
      setAuthPromptMessage('');
      setIsAuthModalOpen(false);

      return { success: true, user: googleUser };
    } catch (err) {
      console.warn('Firebase Google Auth error:', err?.code, err?.message);

      let friendlyMessage = isEnglish
        ? 'An unexpected error occurred during Google sign-in.'
        : 'حدث خطأ غير متوقع أثناء تسجيل الدخول عبر Google.';

      if (err?.code === 'auth/popup-closed-by-user') {
        friendlyMessage = isEnglish
          ? 'Sign-in window was closed before completion.'
          : 'تم إغلاق نافذة تسجيل الدخول قبل إكمال العملية.';
      } else if (err?.code === 'auth/cancelled-popup-request') {
        friendlyMessage = isEnglish
          ? 'Sign-in request was cancelled.'
          : 'تم إلغاء طلب تسجيل الدخول.';
      } else if (err?.code === 'auth/popup-blocked') {
        friendlyMessage = isEnglish
          ? 'Pop-up window was blocked by your browser. Please allow pop-ups.'
          : 'تم حظر النافذة المنبثقة من قِبل المتصفح. يرجى السماح بالنوافذ المنبثقة.';
      } else if (err?.code === 'auth/unauthorized-domain') {
        friendlyMessage = isEnglish
          ? 'This domain is not authorized in Firebase Console settings.'
          : 'نطاق الموقع غير مصرح به في إعدادات Firebase Console (تأكد من إضافة localhost).';
      } else if (err?.code === 'auth/network-request-failed') {
        friendlyMessage = isEnglish
          ? 'Network error. Please check your internet connection.'
          : 'تعذر الاتصال بخوادم Google، يرجى التحقق من اتصال الإنترنت.';
      } else if (err?.message && !err?.code) {
        friendlyMessage = err.message;
      }

      return { success: false, error: friendlyMessage, code: err?.code };
    }
  };

  // دالة تسجيل الخروج ومسح الجلسة مع إنهاء جلسة الخادم وFirebase بأمان
  const logout = async () => {
    // 1. إنهاء جلسة خادم Laravel وإزالة التوكن عند تفعيل الـ API الحقيقي
    if (!USE_MOCK_API) {
      try {
        await authApi.logout();
      } catch (error) {
        console.warn('تعذر تسجيل الخروج من خادم الـ API:', error);
      } finally {
        tokenStorage.removeToken();
      }
    }

    // 2. تسجيل الخروج من Firebase إن كان مفعلاً
    try {
      if (isFirebaseConfigured && auth) {
        await firebaseSignOut(auth);
      }
    } catch (error) {
      console.warn('تعذر تسجيل الخروج من Firebase:', error);
    } finally {
      setUser(null);
      setAuthPromptMessage('');
    }
  };

  // دالة التحقق من المصادقة: تنفذ الإجراء إذا كان مسجلاً أو تفتح النافذة مع رسالة تنبيه
  const requireAuth = (callback, promptMessage = '') => {
    if (user) {
      if (typeof callback === 'function') {
        callback(user);
      }
    } else {
      if (promptMessage) {
        setAuthPromptMessage(promptMessage);
      }
      setIsAuthModalOpen(true);
    }
  };

  // فتح نافذة المصادقة مع إمكانية تمرير رسالة إرشادية للمستخدم
  const openAuthModal = (message = '') => {
    setAuthPromptMessage(message);
    setIsAuthModalOpen(true);
  };

  // إغلاق نافذة المصادقة ومسح أي رسالة إرشادية
  const closeAuthModal = () => {
    setAuthPromptMessage('');
    setIsAuthModalOpen(false);
  };

  // متغير مساعد للتحقق من امتلاك المستخدم صلاحية المالك (Admin)
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isAdmin,
    isAuthModalOpen,
    authPromptMessage,
    isMockMode: USE_MOCK_API,
    login,
    register,
    loginWithGoogle,
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

export default AuthContext;
