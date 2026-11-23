// ملف الإعدادات المركزي ومصدر الحقيقة الموحد لهوية المنصة وبيانات التواصل
export const SITE_CONFIG = {
  // 1. هوية العلامة التجارية والشعار
  brand: {
    name: 'AgriMarket',
    prefix: 'Agri',
    suffix: 'Market',
    subtitle: {
      ar: 'منصة التسويق الزراعي',
      en: 'Smart Agricultural Marketplace',
    },
    year: 2026,
  },

  // 2. بيانات التواصل الميداني والرقمي
  contact: {
    phone: '+967 781 516 579',
    whatsappNumber: '967781516579',
    phones: [
      '+967 781 516 579',
      '+967 770 656 889',
      '+967 780 312 527',
    ],
    email: 'evaalduminy@gmail.com',
    location: {
      ar: 'اليمن - إب',
      en: 'Ibb, Yemen',
    },
    workingHours: {
      ar: 'ساعات العمل: يومياً 08:00 ص - 10:00 م',
      en: 'Working Hours: Daily 08:00 AM - 10:00 PM',
    },
  },

  // 3. روابط شبكات التواصل الاجتماعي (قالب الإضافة لاحقاً: { id: 'whatsapp', label: 'واتساب', href: 'https://wa.me/...', platform: 'whatsapp' })
  socialLinks: [],

  // 4. روابط تحميل التطبيق الزراعي للهواتف الذكية
  appDownload: {
    apkUrl: import.meta.env.VITE_APK_DOWNLOAD_URL || '',
    playStoreUrl: import.meta.env.VITE_PLAY_STORE_URL || '',
  },
};

export default SITE_CONFIG;
