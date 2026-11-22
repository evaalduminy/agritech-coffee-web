import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';

// مكوّن العنصر الفردي الطائر بمسار ناعم نحو أيقونة السلة في الشريط العلوي
function FlyingItem({ item, onComplete }) {
  // احتساب نقطتي الانطلاق والوصول بدقة بالاعتماد على إحداثيات الشاشة
  const startX = item.startRect.left + item.startRect.width / 2 - 24;
  const startY = item.startRect.top + item.startRect.height / 2 - 24;
  const targetX = item.targetRect.left + item.targetRect.width / 2 - 24;
  const targetY = item.targetRect.top + item.targetRect.height / 2 - 24;

  // تفاعل خفيف على أيقونة السلة فور وصول المنتج
  const handleComplete = () => {
    onComplete(item.id);
    const cartButton = document.getElementById('navbar-cart-icon');
    if (cartButton) {
      cartButton.classList.add('scale-110');
      setTimeout(() => {
        cartButton.classList.remove('scale-110');
      }, 200);
    }
  };

  return (
    <motion.div
      initial={{
        x: startX,
        y: startY,
        scale: 1,
        opacity: 0.95,
      }}
      animate={{
        x: targetX,
        y: targetY,
        scale: 0.2,
        opacity: 0.25,
      }}
      transition={{
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
      onAnimationComplete={handleComplete}
      className="fixed top-0 left-0 w-12 h-12 rounded-full overflow-hidden shadow-2xl border-2 border-emerald-400 bg-surface z-[100] pointer-events-none"
    >
      <img
        src={item.imageUrl}
        alt="flying product"
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
}

// مكوّن الطبقة العائمة لتأثير الطيران نحو السلة (Fly-to-Cart Overlay)
export default function FlyToCartOverlay() {
  const { flyingItems, removeFlyingItem } = useCart();

  if (!flyingItems || flyingItems.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <AnimatePresence>
        {flyingItems.map((item) => (
          <FlyingItem
            key={item.id}
            item={item}
            onComplete={removeFlyingItem}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
