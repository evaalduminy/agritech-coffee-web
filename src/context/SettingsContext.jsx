import { createContext, useContext, useState, useEffect } from 'react';
import translations from '../data/translations';
import { USE_MOCK_API, settingsApi } from '../services/api';

// مفتاح حفظ الإعدادات في التخزين المحلي
const STORAGE_KEY = 'agritech_settings';

// القيم الافتراضية المطابقة تماماً لتصميم المنصة الحالي
const DEFAULT_SETTINGS = {
  themeMode: 'light', // 'light' | 'dark'
  language: 'ar', // 'ar' | 'en'
  colorTheme: 'agritech', // 'agritech' | 'roasted' | 'obsidian'
  heroBackground: 'ambient', // 'ambient' | 'particles' | 'minimal'
  buttonStyle: 'soft', // 'soft' | 'pill' | 'sharp'
  loaderStyle: 'logo', // 'logo' | 'bar' | 'none'
  enableFlyToCart: true, // تأثير الطيران للسلة
  enableCard3DTilt: true, // ميلان ثلاثي الأبعاد وتوهج للبطاقات
};

// إنشاء سياق الإعدادات
const SettingsContext = createContext(null);

// مزود سياق الإعدادات لكافة أجزاء التطبيق
export function SettingsProvider({ children }) {
  // قراءة الإعدادات المحفوظة مسبقاً أو اعتماد القيم الافتراضية
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // في حال تعذر القراءة يتم الاعتماد على القيم الافتراضية
    }
    return DEFAULT_SETTINGS;
  });

  // حالة ظهور نافذة الإعدادات الجانبية
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // استرجاع الإعدادات العامة من خادم Laravel عند تفعيل الوضع الحي
  useEffect(() => {
    if (USE_MOCK_API) return;

    let isMounted = true;
    settingsApi
      .getPublic()
      .then((res) => {
        if (!isMounted) return;
        const apiData = res?.data;
        if (apiData && typeof apiData === 'object') {
          setSettings((prev) => ({
            ...prev,
            platform_name: apiData.platform_name || prev.platform_name,
            themeMode: apiData.theme === 'dark' ? 'dark' : (apiData.theme === 'light' ? 'light' : prev.themeMode),
            primaryColor: apiData.primary_color || prev.primaryColor,
          }));
        }
      })
      .catch((err) => {
        console.warn('تعذر استرجاع إعدادات المنصة من خادم Laravel:', err?.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // تطبيق التغييرات على عنصر الجذر document.documentElement وحفظها
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // تجاهل أخطاء مساحة التخزين
    }

    const root = document.documentElement;

    // تطبيق الوضع الليلي أو النهاري
    if (settings.themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // تطبيق لغة واتجاه الصفحة
    root.setAttribute('lang', settings.language);
    root.setAttribute('dir', settings.language === 'ar' ? 'rtl' : 'ltr');

    // تطبيق نسق الألوان
    root.setAttribute('data-theme', settings.colorTheme);

    // تطبيق نمط انحناء الأزرار
    root.setAttribute('data-btn-style', settings.buttonStyle);
  }, [settings]);

  // تحديث إعداد فردي محدد
  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // استعادة جميع الإعدادات لقيمها الافتراضية
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  // دوال التحكم في فتح وإغلاق درج الإعدادات
  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);
  const toggleSettings = () => setIsSettingsOpen((prev) => !prev);

  // متغير مساعد لمعرفة ما إذا كانت اللغة الحالية هي الإنجليزية
  const isEnglish = settings.language === 'en';

  // دالة الترجمة واستخراج النصوص بحسب المفتاح واللغة الحالية
  const t = (path) => {
    if (!path) return '';
    const lang = settings.language === 'en' ? 'en' : 'ar';
    const keys = path.split('.');

    // البحث في كائن لغة العرض الحالية
    let current = translations[lang];
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // بديل احتياطي إلى العربية في حال تعذر العثور على المفتاح
        let fallback = translations['ar'];
        for (const fbKey of keys) {
          if (fallback && fallback[fbKey] !== undefined) {
            fallback = fallback[fbKey];
          } else {
            return path;
          }
        }
        return fallback;
      }
    }
    return current;
  };

  // تحديث إعدادات المنصة وإرسالها لخادم Laravel عند توافر صلاحية المشرف
  const updateAdminSettings = async (customPayload) => {
    const payload = customPayload || {
      theme: settings.themeMode,
      platform_name: settings.platform_name || 'سوق البن الفاخر',
    };

    if (!USE_MOCK_API) {
      try {
        await settingsApi.updateAdmin(payload);
      } catch (err) {
        console.warn('تعذر حفظ الإعدادات في خادم Laravel:', err?.message);
      }
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        updateAdminSettings,
        resetSettings,
        isSettingsOpen,
        openSettings,
        closeSettings,
        toggleSettings,
        t,
        isEnglish,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

// خطاف مخصص للوصول إلى إعدادات المنصة ودالة الترجمة
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings يجب استخدامه داخل SettingsProvider');
  }
  return context;
}
