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
    phone: '+967 770 000 000',
    whatsappNumber: '967770000000',
    email: 'support@agrimarket.ye',
    location: {
      ar: 'صنعاء - اليمن • مزارع حراز ويافع وبني مطر',
      en: 'Sanaa, Yemen • Mountain Terraces of Haraz, Yafa & Bani Matar',
    },
    workingHours: {
      ar: 'ساعات العمل: يومياً 08:00 ص - 10:00 م',
      en: 'Working Hours: Daily 08:00 AM - 10:00 PM',
    },
  },

  // 3. روابط شبكات التواصل الاجتماعي
  socialLinks: [
    {
      id: 'whatsapp',
      label: 'واتساب | WhatsApp',
      href: 'https://wa.me/967770000000',
      platform: 'whatsapp',
    },
    {
      id: 'facebook',
      label: 'فيسبوك | Facebook',
      href: 'https://facebook.com',
      platform: 'facebook',
    },
    {
      id: 'instagram',
      label: 'إنستغرام | Instagram',
      href: 'https://instagram.com',
      platform: 'instagram',
    },
    {
      id: 'x',
      label: 'إكس | X (Twitter)',
      href: 'https://x.com',
      platform: 'x',
    },
    {
      id: 'telegram',
      label: 'تيليجرام | Telegram',
      href: 'https://t.me',
      platform: 'telegram',
    },
    {
      id: 'youtube',
      label: 'يوتيوب | YouTube',
      href: 'https://youtube.com',
      platform: 'youtube',
    },
  ],

  // 4. روابط تحميل التطبيق الزراعي للهواتف الذكية
  appDownload: {
    apkUrl: import.meta.env.VITE_APK_DOWNLOAD_URL || '',
    playStoreUrl: import.meta.env.VITE_PLAY_STORE_URL || '',
  },
};

export default SITE_CONFIG;
