import { ShoppingBag, MessageSquare } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';

// مكوّن بطاقة المحصول الواحد بتصميم متطابق مع هوية Terrace Earth مع دعم اللغتين
export default function ProductCard({
  product,
  onClick = () => {},
  onAddToCart,
  onWhatsAppOrder = () => {},
}) {
  const { addToCart } = useCart();
  const { t, isEnglish } = useSettings();

  // اختيار الحقول المناسبة بحسب اللغة الحالية
  const displayName = isEnglish ? (product.name_en || product.name) : product.name;
  const displayWeight = isEnglish ? (product.weight_en || product.weight) : product.weight;
  const displayRoast = isEnglish ? (product.roast_level_en || product.roast_level) : product.roast_level;
  const displayBadge = isEnglish ? (product.badge_en || product.badge) : product.badge;
  const displayDesc = isEnglish ? (product.description_en || product.description) : product.description;

  // احتساب السعر التقديري بالريال اليمني كإشارة مرجعية
  const approximateYer = Math.round(product.price * 250).toLocaleString();

  // معالجة النقر على زر الإضافة للسلة
  const handleAddClick = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addToCart(product, 1);
    }
  };

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer flex flex-col justify-between bg-surface-container-lowest rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out border border-transparent hover:border-primary/20 text-start"
    >
      <div>
        {/* حاوية صورة المنتج مع الشارة التعريفية */}
        <div className="relative w-full aspect-square bg-surface-container-low overflow-hidden">
          <img
            src={product.image_url}
            alt={displayName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {displayBadge && (
            <div className="absolute top-space-xs right-space-xs bg-primary text-on-primary px-space-sm py-1 rounded-lg font-label-sm text-label-sm shadow-sm font-semibold">
              {displayBadge}
            </div>
          )}
        </div>

        {/* تفاصيل المحصول، الاسم والوزن والسعر */}
        <div className="p-space-md space-y-space-xs">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold line-clamp-1 group-hover:text-primary transition-colors duration-200">
            {displayName}
          </h3>

          <p className="font-body-sm text-body-sm text-secondary font-medium">
            {displayWeight} - {displayRoast}
          </p>

          <div className="pt-space-xs flex items-baseline gap-1">
            <span className="font-headline-md text-headline-md text-primary font-bold">
              ${Number(product.price).toFixed(2)}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">
              ({approximateYer} {t('product.yerUnit')})
            </span>
          </div>

          <p className="font-body-sm text-xs text-on-surface-variant line-clamp-2 pt-1 leading-relaxed">
            {displayDesc}
          </p>
        </div>
      </div>

      {/* زرا الإجراءات: الإضافة للسلة والطلب الفوري عبر واتساب */}
      <div className="p-space-md pt-0 grid grid-cols-2 gap-space-xs">
        {/* زر الإضافة إلى سلة المحاصيل */}
        <button
          type="button"
          onClick={handleAddClick}
          className="flex items-center justify-center gap-1.5 py-2 px-space-xs rounded-xl bg-surface-container text-on-surface hover:bg-primary-container/15 hover:text-primary active:scale-95 transition-all text-center font-label-sm text-label-sm font-semibold cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-primary" />
          <span>{t('product.addToCart')}</span>
        </button>

        {/* زر الطلب أو الحجز المباشر عبر واتساب */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onWhatsAppOrder(product);
          }}
          className="flex items-center justify-center gap-1.5 py-2 px-space-xs rounded-xl bg-primary text-on-primary hover:bg-[#204613] hover:shadow-md active:scale-95 transition-all text-center font-label-sm text-label-sm font-semibold cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t('product.whatsapp')}</span>
        </button>
      </div>
    </div>
  );
}
