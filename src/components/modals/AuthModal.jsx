import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sprout,
  BadgeCheck,
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
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

// مكوّن نافذة تسجيل الدخول وإنشاء الحساب المنبثقة (AuthModal) مع دعم اللغتين
export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const { t } = useSettings();

  // التبويب النشط: تسجيل الدخول أو حساب جديد
  const [activeTab, setActiveTab] = useState('login');

  // حقول نموذج تسجيل الدخول
  const [loginId, setLoginId] = useState('771234567');
  const [loginPass, setLoginPass] = useState('coffeelover2025');

  // حقول نموذج إنشاء الحساب
  const [regName, setRegName] = useState('عبد الرحمن اليافعي');
  const [regId, setRegId] = useState('770000000');
  const [regPass, setRegPass] = useState('secret2026');

  // حالة إظهار/إخفاء كلمة المرور
  const [showPassword, setShowPassword] = useState(false);

  // إغلاق النافذة عند الضغط على زر Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  // إرسال نموذج تسجيل الدخول
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginId || !loginPass) return;
    login({ identifier: loginId, password: loginPass });
  };

  // إرسال نموذج إنشاء الحساب الجديد
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName || !regId || !regPass) return;
    register({ name: regName, identifier: regId, password: regPass });
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* الخلفية الضبابية المعتمة القابلة للنقر للإغلاق */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeAuthModal}
            className="fixed inset-0 bg-black/55 backdrop-blur-md"
          />

          {/* بطاقة النافذة المنبثقة بتصميم Stitch Terrace Earth */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-md w-full p-6 sm:p-8 text-start overflow-hidden z-10"
          >
            {/* زر إغلاق النافذة */}
            <button
              type="button"
              onClick={closeAuthModal}
              aria-label="إغلاق نافذة تسجيل الدخول"
              className="absolute top-5 rtl:left-5 ltr:right-5 w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* ترويسة الشعار والترحيب */}
            <div className="flex flex-col items-center text-center mb-5">
              <div className="relative mb-3">
                <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg">
                  <Sprout className="w-8 h-8" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center border-2 border-white shadow-xs">
                  <BadgeCheck className="w-4 h-4 text-secondary font-bold" />
                </div>
              </div>

              <div className="flex items-center gap-1.5 justify-center">
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                  {t('auth.title')}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-primary-container/15 text-primary text-[11px] font-bold">
                  {t('auth.badge')}
                </span>
              </div>

              <h2 className="font-headline-sm text-[18px] text-on-surface font-bold mt-1.5" id="auth-modal-title">
                {t('auth.loginHeading')}
              </h2>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 max-w-xs leading-relaxed">
                {t('auth.loginSubtitle')}
              </p>
            </div>

            {/* أزرار التبديل بين التبويبين */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-surface-container-low rounded-xl mb-5 border border-surface-container" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'login'}
                onClick={() => setActiveTab('login')}
                className={`py-2.5 rounded-lg font-label-md text-label-md transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'login'
                    ? 'font-bold bg-primary text-white shadow-sm'
                    : 'font-semibold text-on-surface-variant hover:text-on-surface'
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
                    : 'font-semibold text-on-surface-variant hover:text-on-surface'
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
                  <label className="block font-label-md text-[13px] text-on-surface font-bold" htmlFor="modal-login-id">
                    {t('auth.identifierLabel')} <span className="text-error">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-on-surface-variant absolute rtl:right-3.5 ltr:left-3.5 pointer-events-none" />
                    <input
                      id="modal-login-id"
                      type="text"
                      required
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      placeholder={t('auth.identifierPlaceholder')}
                      className="w-full text-sm rtl:pr-11 rtl:pl-3.5 ltr:pl-11 ltr:pr-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-label-md text-[13px] text-on-surface font-bold" htmlFor="modal-login-pass">
                    {t('auth.passwordLabel')} <span className="text-error">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-on-surface-variant absolute rtl:right-3.5 ltr:left-3.5 pointer-events-none" />
                    <input
                      id="modal-login-pass"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      placeholder={t('auth.passwordPlaceholder')}
                      className="w-full text-sm rtl:pr-11 rtl:pl-11 ltr:pl-11 ltr:pr-11 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md transition-all"
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
                  <label className="flex items-center gap-1.5 cursor-pointer text-on-surface-variant hover:text-on-surface">
                    <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary border-outline-variant" />
                    <span>{t('auth.rememberMe')}</span>
                  </label>
                  <button type="button" className="font-label-sm text-primary hover:underline font-bold cursor-pointer">
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

            {/* 2. نموذج إنشاء حساب جديد */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="block font-label-md text-[13px] text-on-surface font-bold" htmlFor="modal-reg-name">
                    {t('auth.nameLabel')} <span className="text-error">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-on-surface-variant absolute rtl:right-3.5 ltr:left-3.5 pointer-events-none" />
                    <input
                      id="modal-reg-name"
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder={t('auth.namePlaceholder')}
                      className="w-full text-sm rtl:pr-11 rtl:pl-3.5 ltr:pl-11 ltr:pr-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-label-md text-[13px] text-on-surface font-bold" htmlFor="modal-reg-id">
                    {t('auth.identifierLabel')} <span className="text-error">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-on-surface-variant absolute rtl:right-3.5 ltr:left-3.5 pointer-events-none" />
                    <input
                      id="modal-reg-id"
                      type="text"
                      required
                      value={regId}
                      onChange={(e) => setRegId(e.target.value)}
                      placeholder={t('auth.identifierPlaceholder')}
                      className="w-full text-sm rtl:pr-11 rtl:pl-3.5 ltr:pl-11 ltr:pr-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-label-md text-[13px] text-on-surface font-bold" htmlFor="modal-reg-pass">
                    {t('auth.newPasswordLabel')} <span className="text-error">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-on-surface-variant absolute rtl:right-3.5 ltr:left-3.5 pointer-events-none" />
                    <input
                      id="modal-reg-pass"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={regPass}
                      onChange={(e) => setRegPass(e.target.value)}
                      placeholder={t('auth.newPasswordPlaceholder')}
                      className="w-full text-sm rtl:pr-11 rtl:pl-11 ltr:pl-11 ltr:pr-11 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md transition-all"
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

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-[#204613] text-white hover:shadow-lg active:scale-[0.98] transform transition-all duration-200 font-label-lg text-label-lg font-bold shadow-md flex items-center justify-center gap-2 mt-2 cursor-pointer"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>{t('auth.registerBtn')}</span>
                </button>
              </form>
            )}

            {/* فاصل المتابعة السريعة */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-container" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2.5 bg-white text-on-surface-variant font-medium">
                  {t('auth.orQuick')}
                </span>
              </div>
            </div>

            {/* أزرار الدخول السريع التجريبية */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => login({ identifier: 'user@google.com' })}
                className="py-2 px-3 rounded-xl border border-outline-variant hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 text-xs font-bold text-on-surface cursor-pointer"
              >
                <span>{t('auth.viaGoogle')}</span>
              </button>

              <button
                type="button"
                onClick={() => login({ identifier: '771234567' })}
                className="py-2 px-3 rounded-xl border border-primary-container/30 bg-primary-container/10 hover:bg-primary-container/20 text-primary transition-colors flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t('auth.viaWhatsApp')}</span>
              </button>
            </div>

            {/* إشعار الأمان والحماية */}
            <div className="mt-4 pt-3 border-t border-surface-container text-center flex items-center justify-center gap-1.5 text-on-surface-variant font-label-sm text-[11px]">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>{t('auth.securityNotice')}</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
