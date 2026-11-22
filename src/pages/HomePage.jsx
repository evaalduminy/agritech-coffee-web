import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PackageSearch, RotateCcw } from 'lucide-react';
import Hero from '../components/home/Hero';
import CategoryFilters from '../components/home/CategoryFilters';
import ProductCard from '../components/home/ProductCard';
import ProductModal from '../components/modals/ProductModal';
import PlatformFeaturesSection from '../components/home/PlatformFeaturesSection';
import TrustAndFaqSection from '../components/home/TrustAndFaqSection';
import AppDownloadBanner from '../components/home/AppDownloadBanner';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';

// الصفحة الرئيسية الشاملة لقسم الترحيب والفلاتر وشبكة المحاصيل والآراء والأسئلة الشائعة
export default function HomePage({
  products = [],
  selectedCategory = 'all',
  onSelectCategory = () => {},
  onWhatsAppOrder = () => {},
  onOpenFarmersModal = () => {},
}) {
  const { addToCart } = useCart();
  const { t } = useSettings();

  // حالة المحصول المحدد لفتح تفاصيله في النافذة المنبثقة
  const [selectedProduct, setSelectedProduct] = useState(null);

  // حالات البحث الفوري والترتيب
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // تصفية المحاصيل وفقاً للفئة المحددة وكلمة البحث والترتيب
  const filteredProducts = useMemo(() => {
    let result = products;

    // 1. التصفية حسب الفئة
    if (selectedCategory !== 'all') {
      result = result.filter((product) => product.category === selectedCategory);
    }

    // 2. التصفية المباشرة بكلمة البحث (الاسم، المنطقة، المواصفات، المزارع، الشارات)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((p) => {
        const nameMatch = (p.name && p.name.toLowerCase().includes(q)) || (p.name_en && p.name_en.toLowerCase().includes(q));
        const originMatch = (p.origin && p.origin.toLowerCase().includes(q)) || (p.origin_en && p.origin_en.toLowerCase().includes(q));
        const descMatch = (p.description && p.description.toLowerCase().includes(q)) || (p.description_en && p.description_en.toLowerCase().includes(q));
        const roastMatch = (p.roast_level && p.roast_level.toLowerCase().includes(q)) || (p.roast_level_en && p.roast_level_en.toLowerCase().includes(q));
        const farmerMatch = (p.farmer_name && p.farmer_name.toLowerCase().includes(q)) || (p.farmer_name_en && p.farmer_name_en.toLowerCase().includes(q));
        const badgeMatch = (p.badge && p.badge.toLowerCase().includes(q)) || (p.badge_en && p.badge_en.toLowerCase().includes(q));
        const subtitleMatch = (p.subtitle && p.subtitle.toLowerCase().includes(q)) || (p.subtitle_en && p.subtitle_en.toLowerCase().includes(q));
        return nameMatch || originMatch || descMatch || roastMatch || farmerMatch || badgeMatch || subtitleMatch;
      });
    }

    // 3. ترتيب المنتجات حسب الخيار المختار
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  // دالة إعادة ضبط جميع الفلاتر والبحث والترتيب
  const handleResetFilters = () => {
    onSelectCategory('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  // دالة الإضافة للطلب من داخل النافذة المنبثقة مع تسجيل كامل الخيارات المحددة
  const handleModalAddToCart = (product, quantity, options = {}) => {
    addToCart(product, quantity, options);
    setSelectedProduct(null);
  };

  // دالة طلب حجز المحصول من داخل النافذة المنبثقة مع تسجيل الخيارات المحددة
  const handleModalReserve = (product, quantity = 1, options = {}) => {
    const unitPrice = options.unitPrice || options.selectedVariant?.price || product.price;
    const variantText = options.selectedVariant ? ` (${options.selectedVariant.label})` : '';
    const optionText = options.selectedOption ? ` - ${options.selectedOption.label}` : '';
    const subText = options.isSubscription ? ' [اشتراك شهري]' : '';
    const customName = `${product.name}${variantText}${optionText}${subText}`;

    onWhatsAppOrder({
      ...product,
      name: customName,
      price: unitPrice,
      quantity,
    });
    setSelectedProduct(null);
  };

  return (
    <div className="w-full flex flex-col bg-transparent">
      {/* 1. القسم الترحيبي وبطاقات الإحصائيات بتخطيط شبكة بينتو */}
      <Hero
        onSelectProduct={setSelectedProduct}
        onOpenFarmersModal={onOpenFarmersModal}
      />

      {/* 2. قسم شبكة المنتجات والفلاتر مع البحث والترتيب */}
      <motion.section
        id="coffee-products"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full py-space-lg bg-transparent"
      >
        <div className="max-w-7xl mx-auto px-margin space-y-space-lg">
          
          {/* شريط الفلاتر والبحث والترتيب التفاعلي */}
          <CategoryFilters
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
            productsCount={filteredProducts.length}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onResetFilters={handleResetFilters}
          />

          {/* شبكة المنتجات المتجاوبة مع حركة ظهور تسلسلية ناعمة في الاتجاهين */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 28, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{
                    duration: 0.55,
                    delay: (index % 4) * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <ProductCard
                    product={product}
                    index={index}
                    onClick={() => setSelectedProduct(product)}
                    onAddToCart={(p) => addToCart(p, 1)}
                    onWhatsAppOrder={onWhatsAppOrder}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* رسالة توضيحية في حال عدم وجود منتجات مطابقة مع زر إعادة الضبط */}
          {filteredProducts.length === 0 && (
            <div className="py-14 px-6 text-center flex flex-col items-center justify-center space-y-4 bg-white/75 dark:bg-[#122019]/75 backdrop-blur-md rounded-2xl border border-emerald-900/10 dark:border-emerald-400/15">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 dark:bg-emerald-500/15 flex items-center justify-center text-primary dark:text-emerald-300">
                <PackageSearch className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="font-headline-sm text-lg text-on-surface font-bold">
                  {t('filters.noMatchingResults')}
                </p>
                <p className="text-xs sm:text-sm text-on-surface-variant dark:text-gray-400 max-w-md">
                  {t('filters.tryResetting')}
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 dark:bg-emerald-600 dark:hover:bg-emerald-500 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t('filters.resetFilters')}</span>
              </button>
            </div>
          )}

        </div>
      </motion.section>

      {/* 3. قسم مميزات المنظومة الزراعية الرقمية مع حركة تمرير تسلسلية */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <PlatformFeaturesSection />
      </motion.div>

      {/* 4. قسم آراء العملاء والشركاء بالإضافة إلى الأسئلة الشائعة مع حركة تمرير تسلسلية */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <TrustAndFaqSection />
      </motion.div>

      {/* 5. بانر تحميل التطبيق الزراعي للهواتف الذكية مع حركة تمرير تسلسلية */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <AppDownloadBanner />
      </motion.div>

      {/* 6. نافذة تفاصيل المنتج المنبثقة والحجز المباشر */}
      <ProductModal
        isOpen={Boolean(selectedProduct)}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleModalAddToCart}
        onReserve={handleModalReserve}
      />
    </div>
  );
}
