import { BadgeCheck, ArrowDown, Mountain, Award, Sparkles } from 'lucide-react';
import HeroAmbientBackground from './HeroAmbientBackground';
import { useSettings } from '../../context/SettingsContext';

// مكوّن القسم الترحيبي (Hero) مع بطاقات الإحصائيات المختصرة ودعم اللغتين
export default function Hero() {
  const { t } = useSettings();

  // دالة التمرير السلس إلى شبكة محاصيل المتجر
  const handleScrollToProducts = () => {
    const productsSection = document.getElementById('coffee-products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-surface-container-low via-surface to-background dark:bg-[#0B1410] dark:from-[#0B1410] dark:via-[#0F1C16] dark:to-[#0B1410] pb-space-lg pt-28 md:pt-space-lg">
      {/* خلفية التوهج العضوي العائم وشبكة النقاط وإضاءة تتبع المؤشر */}
      <HeroAmbientBackground />

      <div className="max-w-7xl mx-auto px-margin relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-space-md">
          
          {/* الشارة التوثيقية العلوية */}
          <div className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-surface-container-high/80 text-primary shadow-xs backdrop-blur-sm dark:bg-emerald-950/80 dark:text-emerald-300 dark:border dark:border-emerald-800/50">
            <BadgeCheck className="w-4 h-4 text-primary dark:text-emerald-300" />
            <span className="font-label-md text-label-md tracking-wide">
              {t('hero.badge')}
            </span>
          </div>

          {/* العنوان الرئيسي للواجهة */}
          <h1 className="font-headline-lg text-headline-lg text-primary dark:text-white md:text-[34px] md:leading-[46px] tracking-tight font-bold">
            {t('hero.title')}
          </h1>

          {/* الوصف الإرشادي المختصر للمنصة */}
          <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-gray-300 max-w-2xl leading-relaxed">
            {t('hero.description')}
          </p>

          {/* زر الانتقال المباشر للمنتجات */}
          <div className="pt-space-xs">
            <button
              type="button"
              onClick={handleScrollToProducts}
              className="inline-flex items-center justify-center gap-space-sm px-space-xl py-3.5 rounded-xl bg-primary-container dark:bg-emerald-700 dark:hover:bg-emerald-600 text-on-primary hover:bg-[#204613] hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transform transition-all duration-300 shadow-md group cursor-pointer"
            >
              <span className="font-label-lg text-label-lg font-bold">{t('hero.browseProducts')}</span>
              <ArrowDown className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>
          </div>

          {/* بطاقات الإحصائيات السريعة بتأثير زجاجي ناعم */}
          <div className="w-full pt-space-md">
            <div className="grid grid-cols-3 gap-2 md:gap-space-md bg-white/75 backdrop-blur-md border border-emerald-900/10 p-2 sm:p-space-md rounded-2xl shadow-xs dark:bg-[#122019]/80 dark:border-emerald-800/40">
              
              {/* إحصائية عدد المزارع المعتمدة */}
              <div className="flex flex-col items-center justify-center py-1.5 md:py-space-xs px-1">
                <div className="flex items-center gap-1 sm:gap-1.5 text-primary dark:text-emerald-300">
                  <Mountain className="w-4 h-4 md:w-5 md:h-5 text-primary dark:text-emerald-300" />
                  <span className="text-base sm:text-headline-md font-bold">{t('hero.statsFarms')}</span>
                </div>
                <span className="text-[10px] sm:text-label-sm text-on-surface-variant dark:text-gray-400 mt-1 text-center line-clamp-1 sm:line-clamp-none">
                  {t('hero.statsFarmsLabel')}
                </span>
              </div>

              {/* إحصائية تقييم الجودة التخصصية */}
              <div className="flex flex-col items-center justify-center py-1.5 md:py-space-xs px-1 bg-emerald-900/[0.04] dark:bg-emerald-900/20 rounded-xl">
                <div className="flex items-center gap-1 sm:gap-1.5 text-primary dark:text-emerald-300">
                  <Award className="w-4 h-4 md:w-5 md:h-5 text-primary dark:text-emerald-300" />
                  <span className="text-base sm:text-headline-md font-bold">{t('hero.statsScoring')}</span>
                </div>
                <span className="text-[10px] sm:text-label-sm text-on-surface-variant dark:text-gray-400 mt-1 text-center line-clamp-1 sm:line-clamp-none">
                  {t('hero.statsScoringLabel')}
                </span>
              </div>

              {/* إحصائية الأصالة والنقاء */}
              <div className="flex flex-col items-center justify-center py-1.5 md:py-space-xs px-1">
                <div className="flex items-center gap-1 sm:gap-1.5 text-primary dark:text-emerald-300">
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary dark:text-emerald-300" />
                  <span className="text-base sm:text-headline-md font-bold">{t('hero.statsExperience')}</span>
                </div>
                <span className="text-[10px] sm:text-label-sm text-on-surface-variant dark:text-gray-400 mt-1 text-center line-clamp-1 sm:line-clamp-none">
                  {t('hero.statsExperienceLabel')}
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
