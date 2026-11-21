// رقم الهاتف الافتراضي للتواصل وخدمة العملاء
export const DEFAULT_WHATSAPP_PHONE = '967770000000';

// خريطة حالات الطلب والحجز بالعربية
const STATUS_LABELS = {
  confirmed: 'مؤكد',
  completed: 'مكتمل',
  pending: 'قيد المراجعة',
};

// خريطة عناوين العمليات حسب نوع المعاملة
const OPERATION_TITLES = {
  reservation: 'طلب حجز محصول قهوة مسبق',
  order: 'طلب شراء محاصيل بن فاخر',
};

// دالة تنسيق تفاصيل الطلب أو الحجز إلى نص رسالة واتساب مرتب
export function formatOrderMessage(order, customerInfo = {}) {
  const isReservation = order.type === 'reservation';
  
  // تحديد عنوان العملية وحالة الطلب عبر كائنات المطابقة الثابتة
  const title = OPERATION_TITLES[order.type] || OPERATION_TITLES.order;
  const status = STATUS_LABELS[order.status] || STATUS_LABELS.pending;
  const orderDate = order.created_at || new Date().toISOString().split('T')[0];

  // تجميع أسطر الترويسة الأساسية للرسالة
  const lines = [
    `*${title}*`,
    'منصة سوق البن الفاخر (AgriTech Platform)',
    '---------------------------------------',
    `*رقم المعاملة:* ${order.id || 'جديد'}`,
    `*التاريخ:* ${orderDate}`,
    `*حالة المعاملة:* ${status}`,
  ];

  // إضافة بيانات العميل إذا كانت متوفرة
  if (customerInfo.name || customerInfo.phone || customerInfo.city) {
    lines.push('');
    lines.push('*بيانات العميل:*');
    if (customerInfo.name) lines.push(`- الاسم: ${customerInfo.name}`);
    if (customerInfo.phone) lines.push(`- الهاتف: ${customerInfo.phone}`);
    if (customerInfo.city) lines.push(`- المدينة / العنوان: ${customerInfo.city}`);
  }

  // إضافة تفاصيل المحاصيل والكميات المطلوبة
  lines.push('');
  lines.push('*المحاصيل والكميات:*');

  // تكرار عناصر الطلب وتنسيق السعر والكمية لكل منتج
  if (Array.isArray(order.items) && order.items.length > 0) {
    order.items.forEach((item, index) => {
      const itemTotal = (item.price * item.quantity).toFixed(2);
      lines.push(`${index + 1}. *${item.name}*`);
      lines.push(`   الكمية: ${item.quantity} | السعر: $${Number(item.price).toFixed(2)} | الإجمالي: $${itemTotal}`);
    });
  } else {
    lines.push('- لا توجد عناصر محددة');
  }

  // إضافة الإجمالي والملاحظة الختامية المناسبة لنوع الطلب
  lines.push('---------------------------------------');
  lines.push(`*الإجمالي الكلي:* $${Number(order.total_price || 0).toFixed(2)}`);
  lines.push('');

  const note = isReservation
    ? 'ملاحظة الحجز: يرجى تأكيد توفر حصة المحصول وتزويدي بجدول القطف والتجفيف والشحن.'
    : 'ملاحظة: تم تسجيل هذا الطلب عبر المنصة، يرجى تزويدي بطريقة التسليم وتأكيد الشحن.';

  lines.push(note);

  // دمج كافة الأسطر بفاصل سطر جديد
  return lines.join('\n');
}

// دالة إنشاء رابط واتساب المباشر مع تشفير نص الرسالة
export function generateWhatsAppUrl(order, customerInfo = {}, phoneNumber = DEFAULT_WHATSAPP_PHONE) {
  // تنظيف رقم الهاتف من أي رموز أو مسافات
  const cleanPhone = String(phoneNumber).replace(/[^0-9]/g, '');
  const messageText = formatOrderMessage(order, customerInfo);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
}

// دالة فتح محادثة واتساب في نافذة متصفح جديدة
export function openWhatsApp(order, customerInfo = {}, phoneNumber = DEFAULT_WHATSAPP_PHONE) {
  const url = generateWhatsAppUrl(order, customerInfo, phoneNumber);
  return window.open(url, '_blank', 'noopener,noreferrer');
}

export default {
  DEFAULT_WHATSAPP_PHONE,
  formatOrderMessage,
  generateWhatsAppUrl,
  openWhatsApp,
};
