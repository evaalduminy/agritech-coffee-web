import { useSettings } from '../../context/SettingsContext';

// مكوّن أزرار التصفية التفاعلية مع تمييز الفئة النشطة والترجمة
export default function CategoryFilters({
  selectedCategory = 'all',
  onSelectCategory = () => {},
}) {
  const { t } = useSettings();

  // خيارات التصفية مترجمة بحسب اللغة
  const filterOptions = [
    { id: 'all', label: t('filters.all') },
    { id: 'roasted', label: t('filters.roasted') },
    { id: 'green', label: t('filters.green') },
    { id: 'blends', label: t('filters.blends') },
    { id: 'haraz', label: t('filters.haraz') },
    { id: 'matari', label: t('filters.matari') },
  ];

  return (
    <div className="w-full pb-space-md border-b border-surface-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        
        {/* عنوان قسم المنتجات والوصف المترجم */}
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
            {t('filters.sectionTitle')}
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            {t('filters.sectionDesc')}
          </p>
        </div>

        {/* شريط أزرار الفلترة القابل للتمرير الأفقي */}
        <div className="flex items-center gap-space-xs overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {filterOptions.map((filter) => {
            const isSelected = selectedCategory === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => onSelectCategory(filter.id)}
                className={`flex-shrink-0 px-space-md py-2 rounded-full font-label-md text-label-md transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-primary-container text-on-primary shadow-sm font-bold scale-[1.02]'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-primary hover:bg-surface-container active:scale-95'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
