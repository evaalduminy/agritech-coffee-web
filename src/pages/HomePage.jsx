import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PackageSearch } from 'lucide-react';
import Hero from '../components/home/Hero';
import CategoryFilters from '../components/home/CategoryFilters';
import ProductCard from '../components/home/ProductCard';
import ProductModal from '../components/modals/ProductModal';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';

// الصفحة الرئيسية الشاملة لقسم الترحيب والفلاتر وشبكة المحاصيل والنافذة المنبثقة
export default function HomePage({
  products = [],
  selectedCategory = 'all',
  onSelectCategory = () => {},
  onWhatsAppOrder = () => {},
}) {
  const { addToCart } = useCart();
  const { t } = useSettings();

  // حالة المحصول المحدد لفتح تفاصيله في النافذة المنبثقة
  const [selectedProduct, setSelectedProduct] = useState(null);

  // تصفية المحاصيل وفقاً للفئة المحددة
  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((product) => product.category === selectedCategory);

  // دالة الإضافة للطلب من داخل النافذة المنبثقة مع تسجيل البيانات
  const handleModalAddToCart = (product, quantity) => {
    addToCart(product, quantity);
    setSelectedProduct(null);
  };

  // دالة طلب حجز المحصول من داخل النافذة المنبثقة مع تسجيل البيانات
  const handleModalReserve = (product) => {
    onWhatsAppOrder(product);
    setSelectedProduct(null);
  };

  return (
    <div className="w-full flex flex-col">
      {/* 1. القسم الترحيبي وبطاقات الإحصائيات */}
      <Hero />

      {/* 2. قسم شبكة المنتجات والفلاتر */}
      <section className="w-full py-space-lg bg-surface" id="coffee-products">
        <div className="max-w-7xl mx-auto px-margin space-y-space-lg">
          
          {/* شريط الفلاتر التفاعلي */}
          <CategoryFilters
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
          />

          {/* شبكة المنتجات المتجاوبة (4 أعمدة في الشاشات الكبيرة) */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.25 }}
                >
                  <ProductCard
                    product={product}
                    onClick={() => setSelectedProduct(product)}
                    onAddToCart={(p) => addToCart(p, 1)}
                    onWhatsAppOrder={onWhatsAppOrder}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* رسالة توضيحية في حال عدم وجود منتجات مطابقة */}
          {filteredProducts.length === 0 && (
            <div className="py-16 text-center flex flex-col items-center justify-center space-y-3 bg-surface-container-low rounded-2xl border border-surface-container">
              <PackageSearch className="w-12 h-12 text-outline" />
              <p className="font-headline-sm text-on-surface font-semibold">
                {t('filters.noProductsTitle')}
              </p>
              <button
                type="button"
                onClick={() => onSelectCategory('all')}
                className="text-primary font-bold hover:underline cursor-pointer text-sm"
              >
                {t('filters.noProductsAction')}
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 3. نافذة تفاصيل المنتج المنبثقة والحجز المباشر */}
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
