/**
 * بيانات تجريبية موحدة لمنصة سوق البن الفاخر (AgriTech Coffee Platform)
 * متوافقة حرفياً مع عقد البيانات الموحّد (Laravel API) المعرّف في PROJECT_RULES.md
 * تدعم الحقول الأصلية بالعربية والحقول المترجمة بالإنجليزية (_en)
 */

export const mockProducts = [
  {
    id: 1,
    name: "بن حراز مجفف طبيعي",
    name_en: "Harazi Natural Sun-Dried",
    category: "roasted", // roasted | green | blends | haraz | matari
    price: 22.00,
    weight: "250 جرام",
    weight_en: "250g",
    roast_level: "تحميص متوسط",
    roast_level_en: "Medium Roast",
    origin: "حراز - اليمن",
    origin_en: "Haraz - Yemen",
    description: "محصول فاخر من أعالي قمم جبال حراز، مجفف بطريقة طبيعية تحت أشعة الشمس الجبلية ليمنح إيحاءات التوت البري والشوكولاتة الداكنة والعسل الجبلي.",
    description_en: "A premier microlot from the peaks of Haraz, naturally dried under mountain sunshine to reveal notes of wild berries, dark chocolate, and highland honey.",
    image_url: "/images/coffee-1.jpg",
    badge: "محاصيل مختصة",
    badge_en: "Specialty Lot",
    is_reservable: true,
    farmer_name: "مزرعة الجبل",
    farmer_name_en: "Al-Jabal Mountain Farm"
  },
  {
    id: 2,
    name: "بن مطري إكسترا تحميص هوائي",
    name_en: "Matari Extra Air-Roasted",
    category: "matari",
    price: 26.50,
    weight: "250 جرام",
    weight_en: "250g",
    roast_level: "تحميص متوسط خفيف",
    roast_level_en: "Light-Medium Roast",
    origin: "بني مطر - صنعاء",
    origin_en: "Bani Matar - Sana'a",
    description: "أحد أعرق أصناف البن اليمني من وديان بني مطر التاريخية. قوام ممتلئ غني وحمضية فاكهية متوازنة مع نوتات التين المجفف والكراميل.",
    description_en: "One of the most historic Yemeni coffee varieties from Bani Matar valleys. Full-bodied richness and balanced fruity acidity with dried fig and caramel notes.",
    image_url: "/images/coffee-2.jpg",
    badge: "الأكثر طلباً",
    badge_en: "Best Seller",
    is_reservable: true,
    farmer_name: "مزارع وادي السيل",
    farmer_name_en: "Wadi Al-Sayl Farms"
  },
  {
    id: 3,
    name: "بن يافعي أخضر نيء كرزي",
    name_en: "Yafai Raw Green Cherry",
    category: "green",
    price: 34.00,
    weight: "1 كجم",
    weight_en: "1 kg",
    roast_level: "أخضر نيء (غير محمص)",
    roast_level_en: "Raw Green (Unroasted)",
    origin: "يافع - لحج",
    origin_en: "Yafa - Lahj",
    description: "حبوب بن يافعي خضراء نقية 100% مختارة بعناية فائقة من مدرجات يافع المرتفعة، معدة للمحامص والمختصين الراغبين في التحميص الطازج.",
    description_en: "100% pure green Yafai beans handpicked from high-altitude terraces, prepared for specialty roasters seeking the freshest green stock.",
    image_url: "/images/coffee-3.jpg",
    badge: "بن أخضر فاخر",
    badge_en: "Premium Green",
    is_reservable: false,
    farmer_name: "تعاونية حمومة الزراعية",
    farmer_name_en: "Hamouma Farm Cooperative"
  },
  {
    id: 4,
    name: "خلطة الأصالة التراثية الفاخرة",
    name_en: "Heritage Reserve Blend",
    category: "blends",
    price: 19.50,
    weight: "250 جرام",
    weight_en: "250g",
    roast_level: "تحميص داكن",
    roast_level_en: "Dark Roast",
    origin: "مزيج حرازي ومطري",
    origin_en: "Haraz & Matar Blend",
    description: "توليفة متناغمة تجمع بين نكهات البن الحرازي الغني وقوام البن المطري الفاخر، مثالية لتحضير القهوة العربية والاسبريسو.",
    description_en: "A harmonious marriage of deep Harazi flavors and elegant Matari body, crafted for classic Arabic coffee pots and rich espresso.",
    image_url: "/images/coffee-4.jpg",
    badge: "خلطة مميزة",
    badge_en: "Signature Blend",
    is_reservable: false,
    farmer_name: "اتحاد المزارعين المستقلين",
    farmer_name_en: "Independent Growers Guild"
  },
  {
    id: 5,
    name: "بن حرازي لاهابي معالجة لاهوائية",
    name_en: "Harazi Lahabi Anaerobic Microlot",
    category: "haraz",
    price: 30.00,
    weight: "250 جرام",
    weight_en: "250g",
    roast_level: "تحميص خفيف فلتر",
    roast_level_en: "Light Filter Roast",
    origin: "حراز - قرية اللاهاب",
    origin_en: "Haraz - Al-Lahab Village",
    description: "محصول تجريبي نادر خضع لتخمير لاهوائي دقيق في براميل محكمة الإغلاق، يبرز نكهات الفراولة المجففة وحلوى المشمش والياسمين.",
    description_en: "A rare experimental microlot undergoing airtight anaerobic fermentation, showcasing candied apricots, dried strawberries, and jasmine aroma.",
    image_url: "/images/coffee-5.jpg",
    badge: "إصدار محدود",
    badge_en: "Limited Edition",
    is_reservable: true,
    farmer_name: "مزرعة الشيخ صالح",
    farmer_name_en: "Sheikh Saleh Estate"
  },
  {
    id: 6,
    name: "بن آنسي أخضر نخب أول",
    name_en: "Anisi Prime Grade Green",
    category: "green",
    price: 31.00,
    weight: "1 كجم",
    weight_en: "1 kg",
    roast_level: "أخضر نيء (غير محمص)",
    roast_level_en: "Raw Green (Unroasted)",
    origin: "آنس - ذمار",
    origin_en: "Anis - Dhamar",
    description: "حبوب بن خضراء منتقاة حبة حبة من مزارع بلاد آنس الخصبة، رطوبة متزنة ومعالجة عسلية نظيفة تضمن نتائج تحميص استثنائية.",
    description_en: "Sorted bean-by-bean from fertile Anisi highlands with balanced moisture and clean honey processing, delivering exceptional roasting profiles.",
    image_url: "/images/coffee-6.jpg",
    badge: "محصول جديد",
    badge_en: "New Harvest",
    is_reservable: true,
    farmer_name: "مزارع مدرجات آنس",
    farmer_name_en: "Anis Terrace Plantations"
  },
  {
    id: 7,
    name: "بن برعي تحميص أومني فلتر واسبريسو",
    name_en: "Bura'i Omni Roast (Filter & Espresso)",
    category: "roasted",
    price: 24.00,
    weight: "250 جرام",
    weight_en: "250g",
    roast_level: "تحميص متوسط",
    roast_level_en: "Medium Omni Roast",
    origin: "جبل برع - الحديدة",
    origin_en: "Mount Bura'a - Hodeidah",
    description: "من محمية جبل برع الطبيعية على ارتفاعات شاهقة وسط الضباب الدائم. مذاق معتدل وحلاوة سكر بني واضحة مع لمسات التوابل الخفيفة.",
    description_en: "From the mist-shrouded nature reserve of Mount Bura'a. Smooth balance, distinct brown sugar sweetness, and subtle baking spice notes.",
    image_url: "/images/coffee-7.jpg",
    badge: "عضوي معتمد",
    badge_en: "Certified Organic",
    is_reservable: false,
    farmer_name: "جمعية برع الحرفية",
    farmer_name_en: "Bura'a Artisan Society"
  },
  {
    id: 8,
    name: "بن إسمعيلي مطري مسلوبي",
    name_en: "Ismaili Matari Masloobi",
    category: "matari",
    price: 28.00,
    weight: "250 جرام",
    weight_en: "250g",
    roast_level: "تحميص خفيف فلتر",
    roast_level_en: "Light Filter Roast",
    origin: "بني مطر - حقل المسلوب",
    origin_en: "Bani Matar - Masloob Parcel",
    description: "سلالة إسماعيلية نادرة ومعالجة مجففة نقية، تمنح حمضية زهرية عطرية أنيقة وإيحاءات الخوخ والبرغموت لرواد القهوة المختصة المقطرة.",
    description_en: "Heirloom Ismaili botanical variety, purely natural processed, presenting refined floral acidity, white peach, and bergamot for pour-over connoisseurs.",
    image_url: "/images/coffee-8.jpg",
    badge: "نادر ومختص",
    badge_en: "Rare Specialty",
    is_reservable: true,
    farmer_name: "مزرعة الحاج قاسم",
    farmer_name_en: "Hajj Qasim Family Farm"
  }
];

export const mockOrders = [
  {
    id: "ORD-2026-101",
    type: "order", // order | reservation
    status: "confirmed", // pending | confirmed | completed
    total_price: 44.00,
    created_at: "2026-11-21",
    items: [
      {
        product_id: 1,
        name: "بن حراز مجفف طبيعي",
        quantity: 2,
        price: 22.00
      }
    ]
  },
  {
    id: "RSV-2026-102",
    type: "reservation",
    status: "pending",
    total_price: 130.00,
    created_at: "2026-11-20",
    items: [
      {
        product_id: 5,
        name: "بن حرازي لاهابي معالجة لاهوائية",
        quantity: 3,
        price: 30.00
      },
      {
        product_id: 2,
        name: "بن مطري إكسترا تحميص هوائي",
        quantity: 1,
        price: 26.50
      },
      {
        product_id: 7,
        name: "بن برعي تحميص أومني فلتر واسبريسو",
        quantity: 1,
        price: 24.00
      }
    ]
  },
  {
    id: "ORD-2026-103",
    type: "order",
    status: "completed",
    total_price: 68.00,
    created_at: "2026-11-18",
    items: [
      {
        product_id: 3,
        name: "بن يافعي أخضر نيء كرزي",
        quantity: 2,
        price: 34.00
      }
    ]
  }
];

export default {
  mockProducts,
  mockOrders
};
