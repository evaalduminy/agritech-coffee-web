import { SITE_CONFIG } from '../config/siteConfig';

// رقم الهاتف الافتراضي للتواصل وخدمة العملاء من ملف الإعدادات المركزي
export const DEFAULT_WHATSAPP_PHONE = SITE_CONFIG.contact.whatsappNumber;

// خريطة حالات الطلب والحجز بالعربية والإنجليزية
const STATUS_LABELS = {
  ar: {
    confirmed: 'مؤكد',
    completed: 'مكتمل',
    pending: 'قيد المراجعة',
  },
  en: {
    confirmed: 'Confirmed',
    completed: 'Completed',
    pending: 'Pending Review',
  },
};

// خريطة عناوين العمليات حسب نوع المعاملة
const OPERATION_TITLES = {
  ar: {
    reservation: 'طلب حجز محصول قهوة مسبق',
    order: 'طلب شراء محاصيل بن فاخر',
  },
  en: {
    reservation: 'Advance Crop Reservation Request',
    order: 'Specialty Crop Purchase Order',
  },
};

// دالة تنسيق تفاصيل الطلب أو الحجز إلى نص رسالة واتساب مرتب
export function formatOrderMessage(order, customerInfo = {}, isEnglish = false) {
  const isEng = isEnglish || customerInfo?.isEnglish || order?.isEnglish || false;
  const langKey = isEng ? 'en' : 'ar';
  const isReservation = order.type === 'reservation';

  // تحديد عنوان العملية وحالة الطلب
  const titles = OPERATION_TITLES[langKey] || OPERATION_TITLES.ar;
  const statuses = STATUS_LABELS[langKey] || STATUS_LABELS.ar;
  const title = titles[order.type] || titles.order;
  const status = statuses[order.status] || statuses.pending;
  const orderDate = order.created_at || new Date().toISOString().split('T')[0];

  // تجميع أسطر الترويسة الأساسية للرسالة
  const platformSubtitle = isEng ? SITE_CONFIG.brand.subtitle.en : SITE_CONFIG.brand.subtitle.ar;
  const lines = [
    `*${title}*`,
    `منصة ${SITE_CONFIG.brand.name} - ${platformSubtitle}`,
    '---------------------------------------',
    `*${isEng ? 'Transaction ID' : 'رقم المعاملة'}:* ${order.id || (isEng ? 'New' : 'جديد')}`,
    `*${isEng ? 'Date' : 'التاريخ'}:* ${orderDate}`,
    `*${isEng ? 'Status' : 'حالة المعاملة'}:* ${status}`,
  ];

  // تحديد بيانات العميل وفق متطلبات المنصة الرسمية
  const defaultGuestName = isEng ? 'Website Guest' : 'زائر عبر الموقع';
  const defaultToBeConfirmed = isEng ? 'To be confirmed' : 'يُحدَّد عند التواصل';

  const clientName = customerInfo.name?.trim() || defaultGuestName;
  const clientPhone = customerInfo.phone?.trim() || defaultToBeConfirmed;
  const clientAddress = customerInfo.city?.trim() || customerInfo.address?.trim() || defaultToBeConfirmed;

  // إضافة بيانات العميل إلى نص الرسالة
  lines.push('');
  lines.push(isEng ? '*Customer Details:*' : '*بيانات العميل:*');
  lines.push(isEng ? `- Name: ${clientName}` : `- الاسم: ${clientName}`);
  lines.push(isEng ? `- Phone: ${clientPhone}` : `- الهاتف: ${clientPhone}`);
  lines.push(isEng ? `- City / Address: ${clientAddress}` : `- المدينة / العنوان: ${clientAddress}`);

  // إضافة تفاصيل المحاصيل والكميات المطلوبة
  lines.push('');
  lines.push(isEng ? '*Crops & Quantities:*' : '*المحاصيل والكميات:*');

  // تكرار عناصر الطلب وتنسيق السعر والكمية لكل منتج
  if (Array.isArray(order.items) && order.items.length > 0) {
    order.items.forEach((item, index) => {
      const itemTotal = (item.price * item.quantity).toFixed(2);
      lines.push(`${index + 1}. *${item.name}*`);
      lines.push(
        isEng
          ? `   Qty: ${item.quantity} | Price: $${Number(item.price).toFixed(2)} | Total: $${itemTotal}`
          : `   الكمية: ${item.quantity} | السعر: $${Number(item.price).toFixed(2)} | الإجمالي: $${itemTotal}`
      );
    });
  } else {
    lines.push(isEng ? '- No items specified' : '- لا توجد عناصر محددة');
  }

  // إضافة الملاحظات الاختيارية في حال توفرها
  if (order.notes) {
    lines.push('');
    lines.push(isEng ? `*Notes:* ${order.notes}` : `*ملاحظات:* ${order.notes}`);
  }

  // إضافة الإجمالي والملاحظة الختامية المناسبة لنوع الطلب
  lines.push('---------------------------------------');
  lines.push(`*${isEng ? 'Total Amount' : 'الإجمالي الكلي'}:* $${Number(order.total_price || 0).toFixed(2)}`);
  lines.push('');

  const note = isReservation
    ? (isEng
        ? 'Reservation Note: Please confirm crop allotment availability and provide harvest, processing, and shipping schedule.'
        : 'ملاحظة الحجز: يرجى تأكيد توفر حصة المحصول وتزويدي بجدول القطف والتجفيف والشحن.')
    : (isEng
        ? 'Note: This order was placed via the platform. Please provide delivery method and shipping confirmation.'
        : 'ملاحظة: تم تسجيل هذا الطلب عبر المنصة، يرجى تزويدي بطريقة التسليم وتأكيد الشحن.');

  lines.push(note);

  // دمج كافة الأسطر بفاصل سطر جديد
  return lines.join('\n');
}

// دالة تنسيق رسالة الاستفسار السريع عن منتج معين بدون طلب شراء
export function formatInquiryMessage(product, isEnglish = false) {
  const name = isEnglish ? (product.name_en || product.name) : product.name;
  const origin = isEnglish ? (product.origin_en || product.origin) : product.origin;
  const price = Number(product.price).toFixed(2);

  if (isEnglish) {
    const lines = [
      '*Specialty Coffee Lot Inquiry*',
      'Yemeni Specialty Coffee Platform',
      '---------------------------------------',
      `Product: *${name}*`,
      origin ? `Origin: ${origin}` : '',
      `Reference Price: $${price}`,
      '',
      `Hello, I would like to inquire about this lot regarding availability, current harvest dispatch, and cupping profile.`,
    ].filter(Boolean);
    return lines.join('\n');
  }

  const lines = [
    '*استفسار عن محصول بن فاخر*',
    `منصة ${SITE_CONFIG.brand.name} (${SITE_CONFIG.brand.subtitle.ar})`,
    '---------------------------------------',
    `المحصول: *${name}*`,
    origin ? `المصدر: ${origin}` : '',
    `السعر المرجعي: $${price}`,
    '',
    `مرحباً، أرغب بالاستفسار عن محصول (${name})، ومواعيد توفره والشحن المباشر من المزرعة.`,
  ].filter(Boolean);

  return lines.join('\n');
}

// دالة إنشاء رابط واتساب المباشر مع تشفير نص الرسالة
export function generateWhatsAppUrl(order, customerInfo = {}, phoneNumber = DEFAULT_WHATSAPP_PHONE) {
  // تنظيف رقم الهاتف من أي رموز أو مسافات
  const cleanPhone = String(phoneNumber).replace(/[^0-9]/g, '');
  const messageText = formatOrderMessage(order, customerInfo);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
}

// دالة فتح محادثة واتساب لتأكيد الطلب
export function openWhatsApp(order, customerInfo = {}, phoneNumber = DEFAULT_WHATSAPP_PHONE) {
  const url = generateWhatsAppUrl(order, customerInfo, phoneNumber);
  return window.open(url, '_blank', 'noopener,noreferrer');
}

// دالة فتح محادثة واتساب للاستفسار السريع عن منتج
export function openWhatsAppInquiry(product, isEnglish = false, phoneNumber = DEFAULT_WHATSAPP_PHONE) {
  const cleanPhone = String(phoneNumber).replace(/[^0-9]/g, '');
  const messageText = formatInquiryMessage(product, isEnglish);
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
  return window.open(url, '_blank', 'noopener,noreferrer');
}

// دالة فتح محادثة واتساب للدعم الفني وخدمة العملاء العامة
export function openWhatsAppSupport(customMessage = '', phoneNumber = DEFAULT_WHATSAPP_PHONE) {
  const cleanPhone = String(phoneNumber).replace(/[^0-9]/g, '');
  const text = customMessage || `مرحباً، أود الاستفسار عن منصة ${SITE_CONFIG.brand.name} وخدمات المحاصيل`;
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  return window.open(url, '_blank', 'noopener,noreferrer');
}

export default {
  DEFAULT_WHATSAPP_PHONE,
  formatOrderMessage,
  formatInquiryMessage,
  generateWhatsAppUrl,
  openWhatsApp,
  openWhatsAppInquiry,
  openWhatsAppSupport,
};
