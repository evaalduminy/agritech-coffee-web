import { motion } from 'framer-motion';
import { Sparkles, Search, X, ArrowUpDown, RotateCcw } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { CATEGORIES } from '../../data/mockData';

// مكوّن أزرار التصفية التحريري مع شريط البحث والترتيب والدوك الزجاجي
export default function CategoryFilters({
  selectedCategory = 'all',
  onSelectCategory = () => {},
  categories = CATEGORIES,
  productsCount = 0,
  searchQuery = '',
  onSearchChange = () => {},
  sortBy = 'featured',
  onSortChange = () => {},
  onResetFilters = () => {},
}) {
  const { t, isEnglish } = useSettings();

  // التحقق من تفعيل أي فلاتر لتحديد حالة زر إعادة الضبط
  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'all' || sortBy !== 'featured';

  return (
    <div className="w-full pb-4 space-y-6">
      {/* 1. الترويسة التحريرية لقسم المحاصيل مع الشارة والعنوان والوصف والعداد المباشر */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-2">
          {/* شارة تشكيلة الموسم العلوية */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 dark:border-emerald-400/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t('filters.seasonalBadge')}</span>
          </div>

          {/* العنوان الرئيسي مع عداد المحاصيل المباشر */}
          <div className="flex items-center flex-wrap gap-3">
            <h2 className="font-headline-md text-2xl sm:text-3xl text-on-surface font-extrabold tracking-tight">
              {t('filters.sectionTitle')}
            </h2>
            {productsCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 dark:bg-emerald-500/20 text-primary dark:text-emerald-300 border border-primary/20 dark:border-emerald-400/30">
                {productsCount} {t('filters.itemsCount')}
              </span>
            )}
          </div>

          {/* الوصف التحريري المعمم لكافة المحاصيل الزراعية */}
          <p className="text-sm text-on-surface-variant dark:text-gray-400 max-w-2xl leading-relaxed">
            {t('filters.sectionDesc')}
          </p>
        </div>

        {/* 2. شريط التصفية الزجاجي المجزأ (Segmented Glass Dock) */}
        <div className="w-full lg:w-auto overflow-x-auto scrollbar-none py-1">
          <div className="bg-white/70 dark:bg-[#122019]/70 backdrop-blur-md p-1.5 rounded-2xl border border-emerald-900/10 dark:border-emerald-400/15 shadow-sm inline-flex items-center gap-1.5 min-w-max">
            {categories.map((category) => {
              const isSelected = selectedCategory === category.id;
              const categoryLabel = isEnglish
                ? (category.name_en || category.name)
                : category.name;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onSelectCategory(category.id)}
                  className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer select-none ${
                    isSelected
                      ? 'text-primary dark:text-white font-bold'
                      : 'text-on-surface-variant dark:text-gray-300 hover:text-on-surface dark:hover:text-white'
                  }`}
                >
                  {/* خلفية التبويب النشط المنزلقة بنعومة */}
                  {isSelected && (
                    <motion.span
                      layoutId="activeCategoryTab"
                      className="absolute inset-0 bg-primary/10 dark:bg-emerald-500/20 rounded-xl border border-primary/20 dark:border-emerald-400/30 shadow-xs"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{categoryLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. شريط البحث الفوري وقائمة الترتيب الزجاجية المتجاوبة */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        {/* حقل البحث الفوري باسم المحصول أو المنطقة أو المواصفات */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-on-surface-variant dark:text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('filters.searchPlaceholder')}
            className="w-full ps-10 pe-9 py-2.5 rounded-xl bg-white/75 dark:bg-[#122019]/75 backdrop-blur-md border border-emerald-900/10 dark:border-emerald-400/15 focus:outline-none focus:border-primary/50 dark:focus:border-emerald-400/50 text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/60 dark:placeholder:text-gray-500 transition-colors shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="مسح البحث"
              className="absolute inset-y-0 end-0 flex items-center pe-3 text-on-surface-variant hover:text-on-surface dark:text-gray-400 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* قائمة ترتيب المنتجات وزر إعادة الضبط السريع */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/75 dark:bg-[#122019]/75 backdrop-blur-md border border-emerald-900/10 dark:border-emerald-400/15 shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-primary dark:text-emerald-300" />
            <label htmlFor="products-sort-select" className="text-xs text-on-surface-variant dark:text-gray-400 font-medium hidden md:inline">
              {t('filters.sortByLabel')}
            </label>
            <select
              id="products-sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-semibold text-on-surface dark:text-gray-200 focus:outline-none cursor-pointer pe-2"
            >
              <option value="featured" className="bg-surface text-on-surface dark:bg-[#0d1812] dark:text-white">
                {t('filters.sortFeatured')}
              </option>
              <option value="price-asc" className="bg-surface text-on-surface dark:bg-[#0d1812] dark:text-white">
                {t('filters.sortPriceAsc')}
              </option>
              <option value="price-desc" className="bg-surface text-on-surface dark:bg-[#0d1812] dark:text-white">
                {t('filters.sortPriceDesc')}
              </option>
            </select>
          </div>

          {/* زر إعادة ضبط الفلاتر السريع عند تفعيل بحث أو فئة محددة */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              title={t('filters.resetFilters')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-high/70 hover:bg-surface-container-high dark:bg-[#1f372c] dark:hover:bg-emerald-900/60 text-primary dark:text-emerald-300 text-xs font-semibold transition-colors cursor-pointer border border-emerald-900/10 dark:border-emerald-400/15"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('filters.resetFilters')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
