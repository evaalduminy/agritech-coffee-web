import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Loader2,
  AtSign,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { USE_MOCK_API } from '../../services/api';
import BrandLogo from '../common/BrandLogo';

// مكوّن نافذة تسجيل الدخول وإنشاء الحساب المنبثقة (AuthModal) مع دعم اللغتين
export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register, loginWithGoogle, authPromptMessage } = useAuth();
  const { t, isEnglish } = useSettings();

  // التبويب النشط: تسجيل الدخول أو حساب جديد
  const [activeTab, setActiveTab] = useState('login');
  const [prevTab, setPrevTab] = useState('login');
  const [prevOpen, setPrevOpen] = useState(isAuthModalOpen);

  // حالة رسالة الخطأ لتسجيل الدخول أو العمليات
  const [errorMessage, setErrorMessage] = useState('');

  // حقول نموذج تسجيل الدخول (الهاتف وكلمة المرور فقط كما في العقد)
  const [loginPhone, setLoginPhone] = useState('771234567');
  const [loginPass, setLoginPass] = useState('coffeelover2025');

  // حقول نموذج إنشاء الحساب الجديد المتطابقة مع جدول users
  const [regFirstName, setRegFirstName] = useState('عبد الرحمن');
  const [regLastName, setRegLastName] = useState('اليافعي');
  const [regUsername, setRegUsername] = useState('abdulrahman_y');
  const [regEmail, setRegEmail] = useState('abdulrahman@example.com');
  const [regPhone, setRegPhone] = useState('770000000');
  const [regPass, setRegPass] = useState('secret2026');

  // حالة إظهار/إخفاء كلمة المرور
  const [showPassword, setShowPassword] = useState(false);

  // حالة تحميل تسجيل الدخول عبر Google
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // مسح رسالة الخطأ عند تغيير التبويب أو إغلاق النافذة أثناء التصيير
  if (activeTab !== prevTab || isAuthModalOpen !== prevOpen) {
    setPrevTab(activeTab);
    setPrevOpen(isAuthModalOpen);
    if (errorMessage) {
      setErrorMessage('');
    }
  }

  // قفل تمرير الصفحة الخلفية عند فتح نافذة تسجيل الدخول
  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAuthModalOpen]);

  // إغلاق النافذة عند الضغط على زر الهروب
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  // إرسال نموذج تسجيل الدخول برقم الهاتف وكلمة المرور
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!loginPhone.trim()) {
      setErrorMessage(t('auth.valPhoneRequired'));
      return;
    }
    if (!loginPass) {
      setErrorMessage(t('auth.valPasswordRequired'));
      return;
    }
    const res = await login({ phone: loginPhone.trim(), password: loginPass });
    if (res && res.success === false) {
      setErrorMessage(res.error || (isEnglish ? 'Login failed.' : 'فشل تسجيل الدخول.'));
    }
  };

  // إرسال نموذج إنشاء الحساب الجديد مع التحقق الدقيق دون إرسال حقل role
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regFirstName.trim()) {
      setErrorMessage(t('auth.valFirstNameRequired'));
      return;
    }

    if (!regLastName.trim()) {
      setErrorMessage(t('auth.valLastNameRequired'));
      return;
    }

    const cleanUsername = regUsername.trim();
    if (!cleanUsername) {
      setErrorMessage(t('auth.valUsernameRequired'));
      return;
    }
    if (/\s/.test(cleanUsername)) {
      setErrorMessage(t('auth.valUsernameNoSpaces'));
      return;
    }

    const cleanEmail = regEmail.trim();
    if (!cleanEmail) {
      setErrorMessage(t('auth.valEmailRequired'));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage(t('auth.valEmailInvalid'));
      return;
    }

    if (!regPhone.trim()) {
      setErrorMessage(t('auth.valPhoneRequired'));
      return;
    }

    if (!regPass || regPass.length < 6) {
      setErrorMessage(t('auth.valPasswordMinLength'));
      return;
    }

    const res = await register({
      first_name: regFirstName.trim(),
      last_name: regLastName.trim(),
      username: cleanUsername,
      email: cleanEmail,
      phone: regPhone.trim(),
      password: regPass,
    });
    if (res && res.success === false) {
      setErrorMessage(res.error || (isEnglish ? 'Registration failed.' : 'فشل إنشاء الحساب.'));
    }
  };

  // معالجة تسجيل الدخول الحقيقي بحساب Google عبر Firebase مع مؤشر التحميل وإظهار رسائل الخطأ
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setErrorMessage('');
    try {
      const res = await loginWithGoogle(isEnglish);
      if (res && !res.success) {
        setErrorMessage(res.error || (isEnglish ? 'Google sign-in failed.' : 'فشل تسجيل الدخول عبر Google.'));
      } else {
        closeAuthModal();
      }
    } catch (error) {
      console.error('خطأ أثناء تسجيل الدخول عبر Google:', error);
      setErrorMessage(
        error?.message || (isEnglish ? 'An error occurred during Google sign-in.' : 'حدث خطأ أثناء تسجيل الدخول عبر Google.')
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isAuthModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-y-auto"
        >
          {/* الخلفية الضبابية المعتمة القابلة للنقر للإغلاق مع z-[120] */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeAuthModal}
            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md"
          />

          {/* بطاقة النافذة المنبثقة بتصميم Stitch Terrace Earth */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white dark:bg-[#122019] rounded-3xl shadow-2xl border border-stone-200 dark:border-emerald-800/50 max-w-md w-full p-5 sm:p-7 text-start overflow-y-auto z-[121] my-auto max-h-[90vh]"
          >
            {/* زر إغلاق النافذة */}
            <button
              type="button"
              onClick={closeAuthModal}
              aria-label="إغلاق نافذة تسجيل الدخول"
              className="absolute top-5 rtl:left-5 ltr:right-5 w-9 h-9 rounded-full bg-surface-container-low dark:bg-emerald-950/80 hover:bg-surface-container dark:hover:bg-emerald-900 text-on-surface-variant dark:text-emerald-300 hover:text-on-surface flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* ترويسة الشعار والترحيب الموحّد */}
            <div className="flex flex-col items-center text-center mb-5">
              <div className="mb-3">
                <BrandLogo size="lg" showSubtitle={false} />
              </div>

              <div className="flex items-center gap-1.5 justify-center">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-400/20 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold border border-emerald-500/20">
                  {t('auth.badge')}
                </span>
              </div>

              <h2 className="font-headline-sm text-[18px] text-on-surface dark:text-white font-bold mt-1.5" id="auth-modal-title">
                {t('auth.loginHeading')}
              </h2>
              <p className="font-body-sm text-[12px] text-on-surface-variant dark:text-gray-300 mt-1 max-w-xs leading-relaxed">
                {t('auth.loginSubtitle')}
              </p>

              {/* رسالة توضيحية لسبب طلب تسجيل الدخول عند تأكيد الطلب */}
              {authPromptMessage && (
                <div className="mt-3.5 w-full p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs font-semibold flex items-start gap-2 text-start">
                  <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span>{authPromptMessage}</span>
                </div>
              )}

              {/* رسالة تنبيه الخطأ عند تعذر إتمام تسجيل الدخول */}
              {errorMessage && (
                <div className="mt-3.5 w-full p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-200 text-xs font-semibold flex items-start gap-2 text-start">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* أزرار التبديل بين التبويبين */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-surface-container-low dark:bg-emerald-950/40 rounded-xl mb-5 border border-surface-container dark:border-emerald-900/30" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'login'}
                onClick={() => setActiveTab('login')}
                className={`py-2.5 rounded-lg font-label-md text-label-md transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'login'
                    ? 'font-bold bg-primary text-white shadow-sm'
                    : 'font-semibold text-on-surface-variant dark:text-gray-400 hover:text-on-surface dark:hover:text-white'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>{t('auth.loginTab')}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'register'}
                onClick={() => setActiveTab('register')}
                className={`py-2.5 rounded-lg font-label-md text-label-md transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'register'
                    ? 'font-bold bg-primary text-white shadow-sm'
                    : 'font-semibold text-on-surface-variant dark:text-gray-400 hover:text-on-surface dark:hover:text-white'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>{t('auth.registerTab')}</span>
              </button>
            </div>

            {/* 1. نموذج تسجيل الدخول */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="block font-label-md text-[13px] text-on-surface dark:text-gray-200 font-bold" htmlFor="modal-login-phone">
                    {t('auth.loginPhoneLabel')} <span className="text-error text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-on-surface-variant dark:text-gray-400 absolute rtl:right-3.5 ltr:left-3.5 pointer-events-none" />
                    <input
                      id="modal-login-phone"
                      type="tel"
                      required
                      dir="ltr"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      placeholder={t('auth.loginPhonePlaceholder')}
                      className="w-full text-sm rtl:pr-11 rtl:pl-3.5 ltr:pl-11 ltr:pr-3.5 py-2.5 rounded-xl border border-outline-variant dark:border-emerald-900/50 bg-surface-container-lowest dark:bg-emerald-950/20 text-on-surface dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md transition-all text-start"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-label-md text-[13px] text-on-surface dark:text-gray-200 font-bold" htmlFor="modal-login-pass">
                    {t('auth.passwordLabel')} <span className="text-error text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-on-surface-variant dark:text-gray-400 absolute rtl:right-3.5 ltr:left-3.5 pointer-events-none" />
                    <input
                      id="modal-login-pass"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      placeholder={t('auth.passwordPlaceholder')}
                      className="w-full text-sm rtl:pr-11 rtl:pl-11 ltr:pl-11 ltr:pr-11 py-2.5 rounded-xl border border-outline-variant dark:border-emerald-900/50 bg-surface-container-lowest dark:bg-emerald-950/20 text-on-surface dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md transition-all"
                    />
                    <button
                      type="button"
                      aria-label="إظهار أو إخفاء كلمة المرور"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute rtl:left-3.5 ltr:right-3.5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-body-sm text-[12px] pt-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer text-on-surface-variant dark:text-gray-400 hover:text-on-surface dark:hover:text-white">
                    <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary border-outline-variant" />
                    <span>{t('auth.rememberMe')}</span>
                  </label>
                  <button type="button" className="font-label-sm text-primary dark:text-emerald-400 hover:underline font-bold cursor-pointer">
                    {t('auth.forgotPassword')}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-[#204613] text-white hover:shadow-lg active:scale-[0.98] transform transition-all duration-200 font-label-lg text-label-lg font-bold shadow-md flex items-center justify-center gap-2 mt-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{t('auth.loginBtn')}</span>
                </button>
              </form>
            )}

            {/* 2. نموذج إنشاء حساب جديد المتطابق مع جدول users في Laravel */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                {/* صف الاسم الأول والاسم الأخير في عمودين متجاورين */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="block font-label-md text-[12px] text-on-surface dark:text-gray-200 font-bold" htmlFor="modal-reg-firstname">
                      {t('auth.firstNameLabel')} <span className="text-error text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-3.5 h-3.5 text-on-surface-variant dark:text-gray-400 absolute rtl:right-3 ltr:left-3 pointer-events-none" />
                      <input
                        id="modal-reg-firstname"
                        type="text"
                        required
                        value={regFirstName}
                        onChange={(e) => setRegFirstName(e.target.value)}
                        placeholder={t('auth.firstNamePlaceholder')}
                        className="w-full text-xs rtl:pr-9 rtl:pl-2.5 ltr:pl-9 ltr:pr-2.5 py-2 rounded-xl border border-outline-variant dark:border-emerald-900/50 bg-surface-container-lowest dark:bg-emerald-950/20 text-on-surface dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-label-md text-[12px] text-on-surface dark:text-gray-200 font-bold" htmlFor="modal-reg-lastname">
                      {t('auth.lastNameLabel')} <span className="text-error text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-3.5 h-3.5 text-on-surface-variant dark:text-gray-400 absolute rtl:right-3 ltr:left-3 pointer-events-none" />
                      <input
                        id="modal-reg-lastname"
                        type="text"
                        required
                        value={regLastName}
                        onChange={(e) => setRegLastName(e.target.value)}
                        placeholder={t('auth.lastNamePlaceholder')}
                        className="w-full text-xs rtl:pr-9 rtl:pl-2.5 ltr:pl-9 ltr:pr-2.5 py-2 rounded-xl border border-outline-variant dark:border-emerald-900/50 bg-surface-container-lowest dark:bg-emerald-950/20 text-on-surface dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* اسم المستخدم (بدون مسافات) */}
                <div className="space-y-1">
                  <label className="block font-label-md text-[12px] text-on-surface dark:text-gray-200 font-bold" htmlFor="modal-reg-username">
                    {t('auth.usernameLabel')} <span className="text-error text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <AtSign className="w-3.5 h-3.5 text-on-surface-variant dark:text-gray-400 absolute rtl:right-3 ltr:left-3 pointer-events-none" />
                    <input
                      id="modal-reg-username"
                      type="text"
                      required
                      dir="ltr"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value.replace(/\s+/g, ''))}
                      placeholder={t('auth.usernamePlaceholder')}
                      className="w-full text-xs rtl:pr-9 rtl:pl-2.5 ltr:pl-9 ltr:pr-2.5 py-2 rounded-xl border border-outline-variant dark:border-emerald-900/50 bg-surface-container-lowest dark:bg-emerald-950/20 text-on-surface dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md transition-all text-start"
                    />
                  </div>
                </div>

                {/* البريد الإلكتروني */}
                <div className="space-y-1">
                  <label className="block font-label-md text-[12px] text-on-surface dark:text-gray-200 font-bold" htmlFor="modal-reg-email">
                    {t('auth.emailLabel')} <span className="text-error text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-3.5 h-3.5 text-on-surface-variant dark:text-gray-400 absolute rtl:right-3 ltr:left-3 pointer-events-none" />
                    <input
                      id="modal-reg-email"
                      type="email"
                      required
                      dir="ltr"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value.trim())}
                      placeholder={t('auth.emailPlaceholder')}
                      className="w-full text-xs rtl:pr-9 rtl:pl-2.5 ltr:pl-9 ltr:pr-2.5 py-2 rounded-xl border border-outline-variant dark:border-emerald-900/50 bg-surface-container-lowest dark:bg-emerald-950/20 text-on-surface dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md transition-all text-start"
                    />
                  </div>
                </div>

                {/* رقم الهاتف */}
                <div className="space-y-1">
                  <label className="block font-label-md text-[12px] text-on-surface dark:text-gray-200 font-bold" htmlFor="modal-reg-phone">
                    {t('auth.phoneLabel')} <span className="text-error text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-3.5 h-3.5 text-on-surface-variant dark:text-gray-400 absolute rtl:right-3 ltr:left-3 pointer-events-none" />
                    <input
                      id="modal-reg-phone"
                      type="tel"
                      required
                      dir="ltr"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder={t('auth.phonePlaceholder')}
                      className="w-full text-xs rtl:pr-9 rtl:pl-2.5 ltr:pl-9 ltr:pr-2.5 py-2 rounded-xl border border-outline-variant dark:border-emerald-900/50 bg-surface-container-lowest dark:bg-emerald-950/20 text-on-surface dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md transition-all text-start"
                    />
                  </div>
                </div>

                {/* كلمة المرور الجديدة */}
                <div className="space-y-1">
                  <label className="block font-label-md text-[12px] text-on-surface dark:text-gray-200 font-bold" htmlFor="modal-reg-pass">
                    {t('auth.newPasswordLabel')} <span className="text-error text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-3.5 h-3.5 text-on-surface-variant dark:text-gray-400 absolute rtl:right-3 ltr:left-3 pointer-events-none" />
                    <input
                      id="modal-reg-pass"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={regPass}
                      onChange={(e) => setRegPass(e.target.value)}
                      placeholder={t('auth.newPasswordPlaceholder')}
                      className="w-full text-xs rtl:pr-9 rtl:pl-9 ltr:pl-9 ltr:pr-9 py-2 rounded-xl border border-outline-variant dark:border-emerald-900/50 bg-surface-container-lowest dark:bg-emerald-950/20 text-on-surface dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md transition-all"
                    />
                    <button
                      type="button"
                      aria-label="إظهار أو إخفاء كلمة المرور"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute rtl:left-3 ltr:right-3 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-[#204613] text-white hover:shadow-lg active:scale-[0.98] transform transition-all duration-200 font-label-lg text-label-md font-bold shadow-md flex items-center justify-center gap-2 mt-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{t('auth.registerBtn')}</span>
                </button>
              </form>
            )}

            {/* قسم المتابعة السريعة (يظهر في الوضع التجريبي فقط لتفادي تضارب الجلسة في الوضع الحي) */}
            {USE_MOCK_API && (
              <>
                {/* فاصل المتابعة السريعة */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-surface-container dark:border-emerald-900/30" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2.5 bg-white dark:bg-[#122019] text-on-surface-variant dark:text-gray-400 font-medium">
                      {t('auth.orQuick')}
                    </span>
                  </div>
                </div>

                {/* أزرار الدخول السريع */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    disabled={isGoogleLoading}
                    onClick={handleGoogleLogin}
                    className="py-2.5 px-3 rounded-xl border border-outline-variant dark:border-emerald-900/50 hover:bg-surface-container-low dark:hover:bg-emerald-950/40 transition-colors flex items-center justify-center gap-2 text-xs font-bold text-on-surface dark:text-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isGoogleLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-primary dark:text-emerald-400" />
                    ) : (
                      <LogIn className="w-4 h-4 text-primary dark:text-emerald-300" />
                    )}
                    <span>{isGoogleLoading ? (isEnglish ? 'Connecting...' : 'جاري الاتصال...') : t('auth.viaGoogle')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      login({ identifier: '771234567', name: 'عبد الرحمن اليافعي' });
                      closeAuthModal();
                    }}
                    className="py-2.5 px-3 rounded-xl border border-primary-container/30 bg-primary-container/10 hover:bg-primary-container/20 text-primary dark:text-emerald-300 transition-colors flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    <span>{t('auth.viaWhatsApp')}</span>
                  </button>
                </div>
              </>
            )}

            {/* إشعار الأمان والحماية */}
            <div className="mt-4 pt-3 border-t border-surface-container dark:border-emerald-900/30 text-center flex items-center justify-center gap-1.5 text-on-surface-variant dark:text-gray-400 font-label-sm text-[11px]">
              <ShieldCheck className="w-4 h-4 text-primary dark:text-emerald-400" />
              <span>{t('auth.securityNotice')}</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
