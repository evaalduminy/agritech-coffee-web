import { motion } from 'framer-motion';
import {
  Activity,
  ScanLine,
  Store,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

// مكوّن قسم مميزات المنظومة الرقمية للبن الأصيل
export default function PlatformFeaturesSection() {
  const { t } = useSettings();

  // مصفوفة البطاقات الأربع للمنظومة مع الأيقونات والأرقام المميزة
  const features = [
    {
      number: t('features.f1Number'),
      icon: Activity,
      title: t('features.f1Title'),
      desc: t('features.f1Desc'),
    },
    {
      number: t('features.f2Number'),
      icon: ScanLine,
      title: t('features.f2Title'),
      desc: t('features.f2Desc'),
    },
    {
      number: t('features.f3Number'),
      icon: Store,
      title: t('features.f3Title'),
      desc: t('features.f3Desc'),
    },
    {
      number: t('features.f4Number'),
      icon: ShieldCheck,
      title: t('features.f4Title'),
      desc: t('features.f4Desc'),
    },
  ];

  // حركات الدخول المتتالية للبطاقات
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  };

  return (
    <section id="platform-features" className="w-full py-14 sm:py-20 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-margin">
        
        {/* الترويسة المركزية مع الشارة التوضيحية */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 dark:bg-emerald-950/60 text-primary dark:text-emerald-300 text-xs font-bold border border-primary/15 dark:border-emerald-800/40 mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('features.badge')}</span>
          </div>
          <h2 className="font-headline-lg text-2xl sm:text-3xl font-extrabold text-on-surface dark:text-white tracking-tight leading-snug">
            {t('features.title')}
          </h2>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant dark:text-gray-300 mt-2.5 leading-relaxed">
            {t('features.desc')}
          </p>
        </div>

        {/* شبكة البطاقات الأربع بتصميم زجاجي متجاوب */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.number}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="relative overflow-hidden bg-white/40 dark:bg-[#122019]/40 backdrop-blur-md border border-emerald-900/10 dark:border-emerald-400/15 rounded-3xl p-6 text-start shadow-xs hover:border-emerald-600/30 dark:hover:border-emerald-400/30 hover:shadow-md transition-all duration-300 group flex flex-col justify-between min-h-[220px]"
              >
                {/* الرقم الخافت الكبير في الزاوية العلوية */}
                <span className="absolute top-3.5 rtl:left-4 ltr:right-4 text-4xl sm:text-5xl font-black text-emerald-950/5 dark:text-emerald-300/10 select-none group-hover:scale-105 transition-transform duration-300 pointer-events-none">
                  {feat.number}
                </span>

                <div>
                  {/* مربع الأيقونة البارز بلون تمييز دافئ */}
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 flex items-center justify-center shadow-xs mb-4 group-hover:scale-105 transition-transform duration-300">
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* عنوان الخاصية */}
                  <h3 className="font-bold text-base sm:text-lg text-on-surface dark:text-white leading-tight mb-2 group-hover:text-primary dark:group-hover:text-emerald-300 transition-colors">
                    {feat.title}
                  </h3>

                  {/* الوصف المختصر للخاصية */}
                  <p className="text-xs sm:text-sm text-on-surface-variant dark:text-gray-300 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
