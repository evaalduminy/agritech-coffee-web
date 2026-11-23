import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Sparkles, HelpCircle, ChevronDown, ShieldCheck, Quote } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

// مكوّن قسم آراء العملاء وتجارب الشركاء بالإضافة إلى الأسئلة الشائعة بنمط الأكورديون
export default function TrustAndFaqSection() {
  const { t } = useSettings();

  // حالة العنصر المفتوح في قائمة الأسئلة الشائعة (الأول مفتوح افتراضياً)
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // مصفوفة آراء وتقييمات العملاء وشركاء التحميص
  const reviews = [
    {
      id: 1,
      name: t('trustAndFaq.r1Name'),
      role: t('trustAndFaq.r1Role'),
      comment: t('trustAndFaq.r1Comment'),
      initial: 'ع',
    },
    {
      id: 2,
      name: t('trustAndFaq.r2Name'),
      role: t('trustAndFaq.r2Role'),
      comment: t('trustAndFaq.r2Comment'),
      initial: 'س',
    },
    {
      id: 3,
      name: t('trustAndFaq.r3Name'),
      role: t('trustAndFaq.r3Role'),
      comment: t('trustAndFaq.r3Comment'),
      initial: 'خ',
    },
  ];

  // مصفوفة الأسئلة الأكثر شيوعاً
  const faqs = [
    {
      id: 1,
      q: t('trustAndFaq.q1'),
      a: t('trustAndFaq.a1'),
    },
    {
      id: 2,
      q: t('trustAndFaq.q2'),
      a: t('trustAndFaq.a2'),
    },
    {
      id: 3,
      q: t('trustAndFaq.q3'),
      a: t('trustAndFaq.a3'),
    },
    {
      id: 4,
      q: t('trustAndFaq.q4'),
      a: t('trustAndFaq.a4'),
    },
  ];

  // تبديل حالة فتح أو إغلاق السؤال
  const handleToggleFaq = (index) => {
    setOpenFaqIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  return (
    <section className="w-full py-16 sm:py-24 bg-transparent relative overflow-hidden" id="trust-and-faq">
      <div className="max-w-7xl mx-auto px-margin space-y-20">
        
        {/* ======================================================== */}
        {/* 1. قسم آراء العملاء وشركاء التحميص المختص */}
        {/* ======================================================== */}
        <div className="space-y-10 sm:space-y-12">
          {/* الترويسة المركزية لقسم التقييمات */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F2E4] dark:bg-[#31691D]/20 text-[#31691D] dark:text-[#7BC662] border border-[#31691D]/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#31691D] dark:text-[#7BC662]" />
              <span>{t('trustAndFaq.reviewsBadge')}</span>
            </div>
            <h2 className="font-headline-md text-2xl sm:text-3xl lg:text-4xl text-[#1A2B15] dark:text-white font-extrabold tracking-tight">
              {t('trustAndFaq.reviewsTitle')}
            </h2>
            <p className="font-body-md text-xs sm:text-sm text-[#556650] dark:text-gray-400 leading-relaxed">
              {t('trustAndFaq.reviewsDesc')}
            </p>
          </div>

          {/* شبكة بطاقات التقييم الزجاجية الثلاث */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="bg-white/75 dark:bg-[#122019]/75 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-[#DCE5D8] dark:border-emerald-400/15 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-start relative group"
              >
                {/* علامة اقتباس خافتة في الزاوية العلوية */}
                <div className="absolute top-5 end-5 text-primary/10 dark:text-emerald-400/10 group-hover:text-primary/20 transition-colors pointer-events-none">
                  <Quote className="w-10 h-10" />
                </div>

                <div className="space-y-4">
                  {/* صف النجوم الخمس وشارة التوثيق */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                      <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>{t('trustAndFaq.verifiedBuyer')}</span>
                    </span>
                  </div>

                  {/* نص التقييم الواقعي */}
                  <p className="text-xs sm:text-sm text-on-surface dark:text-gray-200 leading-relaxed font-medium">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                {/* بيانات العميل والمحمصة */}
                <div className="flex items-center gap-3 pt-6 mt-6 border-t border-emerald-900/10 dark:border-emerald-400/10">
                  <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-emerald-500/20 text-primary dark:text-emerald-300 font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                    {rev.initial}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-sm text-on-surface truncate">
                      {rev.name}
                    </span>
                    <span className="text-xs text-on-surface-variant dark:text-gray-400 truncate">
                      {rev.role}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. قسم الأسئلة الشائعة (FAQ Accordion) */}
        {/* ======================================================== */}
        <div className="space-y-8 sm:space-y-10">
          {/* الترويسة المركزية للأسئلة الشائعة بالخلفية الفاتحة المعتمدة */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F2E4] dark:bg-[#31691D]/20 text-[#31691D] dark:text-[#7BC662] border border-[#31691D]/20 dark:border-[#7BC662]/30 text-xs font-semibold">
              <HelpCircle className="w-3.5 h-3.5 text-[#31691D] dark:text-[#7BC662]" />
              <span>{t('trustAndFaq.faqBadge')}</span>
            </div>
            <h2 className="font-headline-md text-2xl sm:text-3xl text-[#1A2B15] dark:text-white font-extrabold tracking-tight">
              {t('trustAndFaq.faqTitle')}
            </h2>
            <p className="font-body-md text-xs sm:text-sm text-[#556650] dark:text-gray-400 leading-relaxed">
              {t('trustAndFaq.faqDesc')}
            </p>
          </div>

          {/* قائمة الأكورديون المتجاوبة مع الحدود الموحدة */}
          <div className="max-w-3xl mx-auto space-y-3.5">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.id}
                  className="bg-white/75 dark:bg-[#122019]/75 backdrop-blur-md rounded-2xl border border-[#DCE5D8] dark:border-emerald-400/15 overflow-hidden transition-colors shadow-xs"
                >
                  {/* زر فتح وإغلاق السؤال */}
                  <button
                    type="button"
                    onClick={() => handleToggleFaq(index)}
                    aria-expanded={isOpen}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-start cursor-pointer hover:bg-emerald-500/5 transition-colors select-none"
                  >
                    <span className="font-bold text-sm sm:text-base text-[#1A2B15] dark:text-white">
                      {faq.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="w-8 h-8 rounded-xl bg-surface-container-low dark:bg-[#162820] flex items-center justify-center text-[#31691D] dark:text-[#7BC662] shrink-0"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.span>
                  </button>

                  {/* نص الإجابة القابل للتمدد بسلاسة */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: 'easeInOut' }}
                      >
                        <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[#556650] dark:text-gray-300 leading-relaxed border-t border-[#DCE5D8] dark:border-emerald-400/10">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
