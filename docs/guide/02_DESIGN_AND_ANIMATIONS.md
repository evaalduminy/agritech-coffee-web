# دليل التصميم والأنيميشن ونظام الحركة
# Design System, Glassmorphism & Framer Motion Guide

يوثق هذا الدليل النظام البصري الفعلي لمنصة **AgriMarket**، وهندسة الألوان والوضع الليلي، وكيفية بناء تأثير الزجاج المصنفر (Glassmorphism)، بالإضافة إلى شرح تفصيلي ومعياري لجميع حركات وأنيميشن المنصة مع مقتطفات برمجية حقيقية وشرح لمعاملاتها الفيزيائية وكيفية تخصيص سرعتها.

---

## 1. نظام التصميم ولوحة الألوان الزمردية (Terrace Earth Design System)

صُممت المنصة بهوية ترابية وزراعية مستوحاة من مدرجات البن اليمني الشاهقة في حراز ويافع وبني مطر. تم تعريف رموز التصميم (Tokens) في ملف `tailwind.config.js` مع متغيرات CSS في `src/index.css`.

### جدول رموز الألوان الأساسية:
| اسم الرمز (Token) | القيمة اللونية (Hex) | الدلالة والاستخدام في الواجهة |
| :--- | :--- | :--- |
| `primary` | `#185004` | الأخضر الزمردي الغابي العميق: الأزرار الرئيسية، الشعار، الأيقونات النشطة، وعناوين الهوية. |
| `primary-container` | `#31691d` | خلفيات الحاويات المميزة وحواضن الأيقونات العلوية. |
| `on-primary` | `#ffffff` | النصوص والأيقونات البيضاء التباينية فوق الخلفيات الزمردية الداكنة. |
| `secondary` | `#765934` | اللون البرونزي المحمص (لون كرز البن المحمص): النصوص الفرعية، شارات التقييم، والأرقام بالريال. |
| `secondary-container` | `#fed6a7` | خلفيات التمييز الدافئة للشارات وبطاقات التنبيه. |
| `surface` | `#f8faf5` | اللون الأساسي لسطح الصفحة في الوضع النهاري (أبيض مائل للخضرة الطبيعية الناعمة). |
| `surface-container-low` | `#f2f4ef` | خلفيات البطاقات العائمة، رؤوس النوافذ، وحاويات الحقول. |
| `surface-container-lowest`| `#ffffff` | بياض ناصع للبطاقات المرتفعة والمدخلات. |
| `outline` / `outline-variant` | `#727a6b` / `#c1c9b8` | الحدود الدقيقة الفاصلة بين الأقسام وحواف البطاقات. |

---

## 2. آلية عمل الوضع الليلي والنهاري (Dark / Light Mode)

يعتمد التطبيق على استراتيجية الفئة (`darkMode: "class"`) في Tailwind:

### 1. إدارة الحالة في `src/context/SettingsContext.jsx`:
```javascript
// تطبيق أو إزالة كلاس dark مباشرة على وسم html لضمان انتقال كامل الواجهة
useEffect(() => {
  const root = document.documentElement;
  if (themeMode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  localStorage.setItem('agrimarket_theme_mode', themeMode);
}, [themeMode]);
```

### 2. التجاوز السلس للمتغيرات في `src/index.css`:
بدلاً من إعادة كتابة كل لون في كل مكوّن، تم ربط أسطح الوضع الليلي عبر استهداف `html.dark`:
```css
html.dark {
  background-color: #111411;
  color: #e2e5e0;
}
html.dark .bg-surface {
  background-color: #111411 !important;
}
html.dark .bg-surface-container-lowest {
  background-color: #171b17 !important;
}
html.dark .border-surface-container {
  border-color: #262e26 !important;
}
```
**الفائدة الهندسية**: عند إضافة أي بطاقة جديدة باستخدام `bg-surface-container-lowest border border-surface-container`، تتكيف تلقائياً وفورياً مع الوضعين النهاري والليلي دون الحاجة لكتابة كلاسات إضافية في المكون.

---

## 3. تشريح تأثير الزجاج المصنفر (Glassmorphism Anatomy)

تعتمد جميع اللوحات العائمة (مثل `Navbar.jsx`، الشارات العلوية في `Hero.jsx`، وبطاقات التقييم) على تركيبة زجاجية متقدمة من 4 طبقات مدمجة:

```jsx
className="bg-white/80 dark:bg-[#0d1812]/80 backdrop-blur-xl border border-emerald-900/10 dark:border-emerald-400/15 shadow-lg shadow-emerald-950/5"
```

### تحليل معاملات التأثير الزجاجي:
1. **تعبئة شبه شفافة خفيفة (`bg-white/80 dark:bg-[#0d1812]/80`)**:
   - تسمح بمرور ألوان الخلفية الفيزيائية بنسبة 20%، مما يعطي إحساساً بالعمق والشفافية الحقيقية مع المحافظة على قراءة مريحة للنصوص.
2. **تغبيش الخلفية البصرية (`backdrop-blur-xl`)**:
   - تطبق مرشح Gaussian Blur قوي على العناصر المارة خلفها بمقدار `24px`، مما يمنع تشوش العين عند تمرير النصوص فوق مجسمات الخلفية أو الجزيئات.
3. **حافة لمعان زجاجية دقيقة (`border border-emerald-900/10 dark:border-emerald-400/15`)**:
   - إطار رفيع جداً بسماكة `1px` مع شفافية 10-15% من اللون الزمردي؛ يحاكي انعكاس الضوء على حافة لوح الزجاج المصقول.
4. **ظل ملون ناعم ومشتت (`shadow-lg shadow-emerald-950/5`)**:
   - ظل ذو انتشار واسع بلمحة زمردية خافتة يرفع اللوحة عن سطح الشاشة دون إحداث سواد حاد مزعج.

---

## 4. الحركات والأنيميشن التفاعلي في المنصة (Framer Motion & Canvas)

### أولاً: الخلفية التفاعلية وهالة الضوء (`GlobalInteractiveBackground.jsx`)

تجمع الخلفية بين **محاكاة الكانفاس (HTML5 Canvas)** للجزيئات الفيزيائية و**نوابض Framer Motion** لهالة الضوء والعمق ثلاثي الأبعاد:

```jsx
// 1. نوابض فيزيائية مرنة لتنعيم انتقال هالة الضوء مع حركة الماوس
const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
const smoothX = useSpring(mouseX, springConfig);
const smoothY = useSpring(mouseY, springConfig);

// 2. إحداثيات نسبية لحركة العمق (Parallax)
const normX = useMotionValue(0);
const normY = useMotionValue(0);
const smoothNormX = useSpring(normX, { damping: 30, stiffness: 90 });
const smoothNormY = useSpring(normY, { damping: 30, stiffness: 90 });

// 3. تحويل الإحداثيات النسبية إلى إزاحة بيكسلية خفيفة
const orb1X = useTransform(smoothNormX, [-0.5, 0.5], ['-35px', '35px']);
const orb1Y = useTransform(smoothNormY, [-0.5, 0.5], ['-35px', '35px']);
```

#### شرح المعاملات الفيزيائية:
- **`stiffness: 120` (الصلابة)**: تحدد مدى سرعة وقوة سحب الزنبرك للهالة نحو مؤشر الماوس. الرقم الأكبر يجعل الحركة أسرع استجابة.
- **`damping: 25` (التخميد)**: قوة الاحتكاك التي تكبح الحركة وتمنع تذبذب الهالة بعد توقف الماوس، مما ينتج حركة سائلة ناعمة.
- **`mass: 0.5` (الكتلة)**: تعطي وزناً خفيفاً للعنصر، فالكتلة الأقل تمنح خفة ورشاقة في الاستجابة.
- **`useTransform(smoothNormX, [-0.5, 0.5], ['-35px', '35px'])`**: تحول المجال النسبي للمؤشر من أقصى اليمين لأقصى اليسار إلى إزاحة قدرها 35 بكسل فقط، لصنع عمق فراغي مريح دون دوار بصري.

---

### ثانياً: مجسم الهاتف ثلاثي الأبعاد والكرات العائمة (`Hero.jsx`)

```jsx
// دوران الهاتف في الفضاء ثلاثي الأبعاد تبعاً لموضع الماوس
const phoneRotateX = useTransform(smoothMouseY, [-0.5, 0.5], ['10deg', '-10deg']);
const phoneRotateY = useTransform(smoothMouseX, [-0.5, 0.5], ['-16deg', '8deg']);

// تفاعل الزر المغناطيسي
const handleMagneticMove = (e) => {
  const { clientX, clientY, currentTarget } = e;
  const { left, top, width, height } = currentTarget.getBoundingClientRect();
  const centerX = left + width / 2;
  const centerY = top + height / 2;
  setMagneticOffset({
    x: (clientX - centerX) * 0.25,
    y: (clientY - centerY) * 0.25,
  });
};
```
- **دوران الهاتف**: زاوية `phoneRotateX` تميل الهاتف للأعلى والأسفل بمقدار 10 درجات، و `phoneRotateY` تميله جانبياً بمقدار 16 درجة، مما يعطي الهاتف إحساساً ملموساً بالمجسم الفيزيائي.
- **الزر المغناطيسي (`handleMagneticMove`)**: يحسب المسافة بين المؤشر ومركز الزر، ثم يسحب الزر بنسبة `25%` نحو المؤشر، مما يخلق تفاعلاً مغناطيسياً جاذباً للمستخدم عند محاولة النقر.

---

### ثالثاً: الظهور التسلسلي للبطاقات في المتجر (`HomePage.jsx`)

```jsx
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
  <ProductCard ... />
</motion.div>
```

#### شرح معاملات الظهور المتقدمة:
- **`initial={{ opacity: 0, y: 28, scale: 0.97 }}`**: تبدأ البطاقة من الأسفل بمقدار 28 بكسل، غير مرئية وبحجم 97%.
- **`whileInView` مع `viewport={{ once: false, amount: 0.15 }}`**:
  - `amount: 0.15`: تبدأ الحركة بمجرد ظهور 15% من البطاقة في إطار الشاشة أثناء التمرير.
  - `once: false`: تسمح بإعادة الحركة بنعومة عند التمرير ذهاباً وإياباً دون اختفاء مفاجئ.
- **`delay: (index % 4) * 0.08` (Staggering)**:
  - تعطي كل عمود في الشبكة تأخيراً زمنياً مقداره 80 ميلي ثانية عن سابقه (0ms، ثم 80ms، ثم 160ms، ثم 240ms)، مما يخلق موجة ظهور متدرجة ومريحة للعين بدلاً من هبوط كل البطاقات دفعة واحدة.
- **منحنى الحركة المخصص `ease: [0.22, 1, 0.36, 1]` (Cubic Bézier Curve)**:
  - هذا المنحنى هو سر نعومة وفخامة الحركة في المنصة؛ حيث ينطلق بسرعة طبيعية ثم يتباطأ بنعومة حريرية فائقة (Deceleration)، مانحاً واجهة المستخدم مظهراً احترافياً بعيداً عن حركات الخط المستقيم الآلية المبتذلة (Linear).

---

### رابعاً: أنيميشن طيران المنتج نحو السلة (`FlyToCartOverlay.jsx`)

```jsx
// احتساب نقطتي الانطلاق والوصول بدقة بالاعتماد على إحداثيات الشاشة
const startX = item.startRect.left + item.startRect.width / 2 - 24;
const startY = item.startRect.top + item.startRect.height / 2 - 24;
const targetX = item.targetRect.left + item.targetRect.width / 2 - 24;
const targetY = item.targetRect.top + item.targetRect.height / 2 - 24;

<motion.div
  initial={{ x: startX, y: startY, scale: 1, opacity: 0.95 }}
  animate={{ x: targetX, y: targetY, scale: 0.2, opacity: 0.25 }}
  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
  onAnimationComplete={handleComplete}
  className="fixed top-0 left-0 w-12 h-12 rounded-full ... z-[100] pointer-events-none"
/>
```
- **حساب الإحداثيات المباشر**: يستخدم `getBoundingClientRect()` لزر "إضافة للسلة" المنقور وأيقونة السلة في الـ Navbar، مما يضمن دقة نقطة الانطلاق والوصول على أي شاشة وبأي دقة.
- **تصغير الحجم والتلاشي**: يتقلص المنتج الطائر من `scale: 1` إلى `scale: 0.2` مع التلاشي أثناء الطيران نحو الأيقونة.
- **نبضة الارتداد في الـ Navbar (`handleComplete`)**: فور وصول المنتج، تُضاف فئة `scale-110` لأيقونة السلة لمدة `200ms` لتعطي تأكيداً بصرياً فورياً وممتعاً باكتمال الإضافة.

---

### خامساً: اللوحات المنزلقة المتوافقة مع اتجاه اللغة (`CartDrawer.jsx` و `SettingsDrawer.jsx`)

```jsx
<motion.aside
  initial={{ x: isEnglish ? '100%' : '-100%' }}
  animate={{ x: 0 }}
  exit={{ x: isEnglish ? '100%' : '-100%' }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
  className="..."
>
```
- **مراعاة الاتجاه اللغوي (RTL / LTR)**:
  - في اللغة العربية: تنزلق السلة من جهة اليسار (`-100%`) نحو المركز (`0`).
  - في اللغة الإنجليزية: تنزلق السلة من جهة اليمين (`100%`) نحو المركز (`0`).
  - هذا الفصل يضمن عدم تعارض الاتجاهات أو اختفاء اللوحة في الجانب الخاطئ عند تبديل اللغة.

---

## 5. دليل التحكم والضبط السريع للحركات (Tuning Cheat-Sheet)

إذا أردتِ تسريع أو تبطيء أو تعديل أي حركة في المنصة، فكل ما تحتاجينه هو تعديل الأرقام التالية في ملفاتها المحددة:

| التأثير المطلوب | الملف المسؤول | السطر أو المتغير | التعديل المقترح |
| :--- | :--- | :--- | :--- |
| **تسريع ظهور بطاقات المتجر** | `src/pages/HomePage.jsx` | `duration: 0.55` | غيّري الرقم إلى `0.3` لجعل الظهور سريعاً وخاطفاً. |
| **تقليل الفارق الزمني بين البطاقات** | `src/pages/HomePage.jsx` | `delay: (index % 4) * 0.08` | غيّري `0.08` إلى `0.04` لتتقارب أوقات ظهور البطاقات. |
| **تسريع انزلاق السلة والإعدادات** | `CartDrawer.jsx` / `SettingsDrawer.jsx` | `duration: 0.3` | غيّري الرقم إلى `0.2` لانزلاق فوري. |
| **تسريع طيران المنتج نحو السلة** | `src/components/common/FlyToCartOverlay.jsx` | `duration: 0.65` | غيّري الرقم إلى `0.4` لحركة طيران أسرع. |
| **تثبيت هاتف الـ Hero وتقليل حركته** | `src/components/home/Hero.jsx` | `['10deg', '-10deg']` | غيّريها إلى `['4deg', '-4deg']` لحركة ميلان هادئة جداً. |
| **تقليل عدد جزيئات الخلفية التفاعلية** | `GlobalInteractiveBackground.jsx` | `const particleCount = 38;` | غيّريها إلى `15` أو `20` لتقليل الاستهلاك على الأجهزة القديمة. |
| **تعطيل الحركات تماماً للراحة البصرية** | في أي مكون | `transition={{ duration: 0 }}` | تعيين المدة إلى صفر يُظهر العناصر فورياً بدون أي انزلاق. |
