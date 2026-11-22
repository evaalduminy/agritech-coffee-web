// عنوان الخادم الأساسي مع قيمة افتراضية لسيرفر Laravel المحلي
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1').replace(/\/+$/, '');

// التحقق من تفعيل وضع المحاكاة التجريبية (الافتراضي هو true ما لم يُحدد false صراحة)
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';

// مفتاح تخزين توكن التوثيق Sanctum في التخزين المحلي
const AUTH_TOKEN_KEY = 'agritech_auth_token';

// كائن مسارات واجهة برمجة التطبيقات الموحد المطابق لتوثيق الـ YAML المعتمد
export const ENDPOINTS = {
  auth: {
    register: '/register',
    login: '/login',
    logout: '/logout',
    me: '/me',
  },
  products: {
    list: '/products',
    details: (id) => `/products/${id}`,
  },
  orders: {
    list: '/orders',
    create: '/orders',
    details: (id) => `/orders/${id}`,
  },
  settings: {
    public: '/settings',
    admin: '/admin/settings',
  },
};

// إدارة رمز المصادقة في التخزين المحلي
export const tokenStorage = {
  // استرجاع الرمز المخزن
  getToken: () => {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY) || null;
    } catch {
      return null;
    }
  },

  // حفظ الرمز في التخزين المحلي
  setToken: (token) => {
    try {
      if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, String(token).trim());
      } else {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    } catch (error) {
      console.warn('تعذر حفظ رمز التوثيق محلياً:', error);
    }
  },

  // إزالة الرمز من التخزين المحلي
  removeToken: () => {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.warn('تعذر حذف رمز التوثيق محلياً:', error);
    }
  },
};

// فئة مخصصة وموحدة لتمثيل أخطاء الـ API واستخراج تفاصيل التحقق
export class ApiError extends Error {
  constructor(message, status = 500, errors = null, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.data = data;
  }
}

// دالة تنفيذ طلبات HTTP الموحدة باستخدام fetch الأصلي
export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http://') || endpoint.startsWith('https://')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const token = tokenStorage.getToken();

  // ترويسات الطلب الموحدة
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // معالجة استجابات 204 No Content بأمان دون استدعاء JSON
    if (response.status === 204) {
      return { success: true };
    }

    // استخراج محتوى الاستجابة بأمان مع معالجة الجسم الفارغ
    let jsonResult = null;
    const text = await response.text();
    if (text && text.trim().length > 0) {
      try {
        jsonResult = JSON.parse(text);
      } catch {
        jsonResult = { message: text };
      }
    } else {
      jsonResult = { success: response.ok };
    }

    // معالجة حالات النجاح (رمز الاستجابة 2xx)
    if (response.ok) {
      return jsonResult;
    }

    // معالجة حالة انتهاء صلاحية الجلسة أو عدم التوثيق 401
    const isLoginEndpoint = url.endsWith(ENDPOINTS.auth.login) || url.includes('/login');
    if (response.status === 401) {
      tokenStorage.removeToken();
      // عدم إطلاق حدث انتهاء الجلسة العام إذا كان الخطأ ناتجاً عن تسجيل الدخول
      if (!isLoginEndpoint && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('agritech:unauthorized'));
      }
    }

    // استخراج وتنسيق رسالة الخطأ من استجابة الخادم
    let errorMessage = jsonResult?.message || `خطأ في الاتصال بالخادم (${response.status})`;
    const fieldErrors = jsonResult?.errors || null;

    // استخراج أول خطأ تفصيلي للحقول في حالة خطأ التحقق 422
    if (response.status === 422 && fieldErrors && typeof fieldErrors === 'object') {
      const firstErrorList = Object.values(fieldErrors).flat();
      if (firstErrorList.length > 0) {
        errorMessage = firstErrorList[0];
      }
    } else if (response.status === 401) {
      errorMessage = jsonResult?.message || (isLoginEndpoint
        ? 'رقم الهاتف أو كلمة المرور غير صحيحة.'
        : 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً.');
    } else if (response.status === 403) {
      errorMessage = jsonResult?.message || 'ليس لديك الصلاحية الكافية لإتمام هذا الإجراء.';
    } else if (response.status === 404) {
      errorMessage = jsonResult?.message || 'العنصر المطلوب غير موجود على الخادم.';
    } else if (response.status === 409) {
      errorMessage = jsonResult?.message || 'البيانات المدخلة مسجلة مسبقاً في النظام.';
    } else if (response.status >= 500) {
      errorMessage = jsonResult?.message || 'حدث خطأ في خادم النظام، يرجى المحاولة لاحقاً.';
    }

    throw new ApiError(errorMessage, response.status, fieldErrors, jsonResult);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // خطأ انقطاع الشبكة أو تعذر الوصول للسيرفر
    throw new ApiError(
      'تعذر الاتصال بخادم المنصة. يرجى التأكد من تشغيل خادم Laravel المحلي أو اتصال الإنترنت.',
      0,
      null,
      null
    );
  }
}

// دالة مساعدة لمطابقة بيانات المنتج من بنية Laravel مع واجهة المتجر
export function formatApiProduct(p) {
  if (!p) return null;

  // استخراج مصفوفة الصور ومطابقة الصورة الأساسية مع بنية الـ YAML
  const rawImages = p.images || p.product_images || [];
  const primaryImg = (Array.isArray(rawImages) && rawImages.find((img) => img.is_primary)?.image_url)
    || (Array.isArray(rawImages) && rawImages[0]?.image_url)
    || (Array.isArray(rawImages) && rawImages[0]?.url)
    || p.image_url
    || '/images/coffee-1.jpg';

  // استخراج مصفوفة الفئات ومطابقة الفئة مع بنية الـ YAML
  const rawCategories = p.categories || p.product_categories || [];
  const categoryName = (Array.isArray(rawCategories) && rawCategories[0]?.variety_name?.toLowerCase())
    || (Array.isArray(rawCategories) && rawCategories[0]?.name?.toLowerCase())
    || p.category
    || 'roasted';

  // استخراج الاسم الآمن باللغتين مع اعتماد product_name كبديل آمن
  const fallbackName = p.product_name || p.name || '';
  const nameAr = p.product_name_ar || fallbackName || 'محصول بن فاخر';
  const nameEn = p.product_name_en || fallbackName || 'Specialty Coffee';

  return {
    ...p,
    id: p.product_id || p.id,
    product_id: p.product_id || p.id,
    name: nameAr,
    name_en: nameEn,
    price: Number(p.price) || 0,
    available_quantity: Number(p.available_quantity) || 0,
    weight: p.weight || '250 جرام',
    roast_level: p.processing_method || p.roast_level || 'تحميص متوسط',
    roast_level_en: p.roast_level_en || 'Medium Roast',
    origin: p.agricultural_region || p.origin || 'اليمن',
    origin_en: p.origin_en || p.agricultural_region || 'Yemen',
    description: p.description || '',
    description_en: p.description_en || p.description || '',
    image_url: primaryImg,
    badge: p.badge || (p.available_quantity > 0 ? 'محاصيل مختصة' : 'نفدت الكمية'),
    badge_en: p.badge_en || 'Specialty',
    is_reservable: p.is_reservable !== undefined ? Boolean(p.is_reservable) : true,
    farmer_name: p.farmer_name || (p.farm_id ? `مزرعة رقم ${p.farm_id}` : 'مزارع محلي'),
    farmer_name_en: p.farmer_name_en || 'Local Farmer',
    category: categoryName,
    images: Array.isArray(rawImages) ? rawImages : [],
    categories: Array.isArray(rawCategories) ? rawCategories : [],
  };
}

// دالة مساعدة لمطابقة بيانات الطلب من بنية Laravel مع لوحة المشتري
export function formatApiOrder(o) {
  if (!o) return null;
  return {
    ...o,
    id: o.order_id ? `ORD-${o.order_id}` : (o.id || `ORD-${Date.now().toString().slice(-4)}`),
    order_id: o.order_id || o.id,
    type: o.type || 'order',
    status: o.order_status || o.status || 'pending',
    total_price: Number(o.total_price) || 0,
    created_at: o.order_date ? o.order_date.split('T')[0] : (o.created_at || new Date().toISOString().split('T')[0]),
    notes: o.notes || '',
    items: Array.isArray(o.items)
      ? o.items.map((item) => ({
          ...item,
          product_id: item.product_id,
          name: item.product_name || item.name || 'محصول بن',
          quantity: Number(item.quantity) || 1,
          price: Number(item.unit_price || item.price) || 0,
          subtotal: Number(item.subtotal || (Number(item.unit_price || item.price || 0) * (item.quantity || 1))),
        }))
      : [],
  };
}

// وحدة خدمات المصادقة والمستخدمين (Auth API)
export const authApi = {
  // إنشاء حساب جديد مع تجريد أي حقول غير مصرح بها وتمرير الحقول المعتمدة لـ RegisterRequest
  register: async (payload = {}) => {
    const password = payload.password || '';
    const safePayload = {
      username: String(payload.username || '').replace(/\s+/g, '').trim(),
      first_name: String(payload.first_name || '').trim(),
      last_name: String(payload.last_name || '').trim(),
      email: String(payload.email || '').trim().toLowerCase(),
      phone: String(payload.phone || '').replace(/[\s\-_]/g, '').trim(),
      password,
      password_confirmation: payload.password_confirmation || password,
    };

    return apiRequest(ENDPOINTS.auth.register, {
      method: 'POST',
      body: JSON.stringify(safePayload),
    });
  },

  // تسجيل الدخول برقم الهاتف وكلمة المرور لـ LoginRequest
  login: async ({ phone, password }) => {
    const safePayload = {
      phone: String(phone || '').replace(/[\s\-_]/g, '').trim(),
      password,
    };

    return apiRequest(ENDPOINTS.auth.login, {
      method: 'POST',
      body: JSON.stringify(safePayload),
    });
  },

  // تسجيل الخروج وإلغاء صلاحية التوكن في الخادم مع ضمان حذفه محلياً
  logout: async () => {
    try {
      await apiRequest(ENDPOINTS.auth.logout, { method: 'POST' });
    } finally {
      tokenStorage.removeToken();
    }
  },

  // جلب بيانات الحساب الحالي الموثق بالتوكن (GET /me)
  getCurrentUser: async () => {
    return apiRequest(ENDPOINTS.auth.me, { method: 'GET' });
  },
};

// وحدة خدمات استعراض المنتجات والمحاصيل (Products API)
export const productsApi = {
  // جلب قائمة المنتجات مع تصفية الفئة والبحث وترقيم الصفحات بحد أقصى 50 عنصر
  list: async ({ page = 1, per_page = 12, category_id, search, sort } = {}) => {
    const safePage = Math.max(1, Number(page) || 1);
    const safePerPage = Math.min(Math.max(1, Number(per_page) || 12), 50);
    const params = new URLSearchParams();

    params.append('page', String(safePage));
    params.append('per_page', String(safePerPage));

    if (category_id) {
      params.append('category_id', String(category_id));
    }

    if (search && String(search).trim() !== '') {
      params.append('search', String(search).trim().slice(0, 100));
    }

    if (sort && ['newest', 'price_asc', 'price_desc'].includes(sort)) {
      params.append('sort', sort);
    }

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`${ENDPOINTS.products.list}${query}`, { method: 'GET' });
  },

  // جلب تفاصيل محصول معين بمعرفه الرقمي (GET /products/{product_id})
  getById: async (id) => {
    return apiRequest(ENDPOINTS.products.details(id), { method: 'GET' });
  },
};

// وحدة خدمات إدارة وإنشاء الطلبات والحجوزات (Orders API)
export const ordersApi = {
  // إنشاء طلب أو حجز محصول مطابق لـ CreateOrderRequest
  create: async ({ items = [], type = 'purchase', notes = '' } = {}) => {
    const sanitizedItems = (Array.isArray(items) ? items : [])
      .map((item) => {
        const id = Number(item.product_id || item.id);
        const qty = Math.max(1, Number(item.quantity) || 1);
        if (!id || Number.isNaN(id)) return null;
        return { product_id: id, quantity: qty };
      })
      .filter(Boolean);

    const orderType = type === 'reservation' ? 'reservation' : 'purchase';

    const payload = {
      type: orderType,
      items: sanitizedItems,
    };

    if (notes && String(notes).trim() !== '') {
      payload.notes = String(notes).trim().slice(0, 1000);
    }

    return apiRequest(ENDPOINTS.orders.create, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // جلب سجل طلبات المستخدم الحالي الموثق مع دعم الفلترة بحالة الطلب وترقيم الصفحات
  listOwn: async ({ page = 1, per_page = 15, status } = {}) => {
    const safePage = Math.max(1, Number(page) || 1);
    const safePerPage = Math.min(Math.max(1, Number(per_page) || 15), 50);
    const params = new URLSearchParams();

    params.append('page', String(safePage));
    params.append('per_page', String(safePerPage));

    if (status && ['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      params.append('status', status);
    }

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`${ENDPOINTS.orders.list}${query}`, { method: 'GET' });
  },

  // جلب تفاصيل طلب محدد للمستخدم (GET /orders/{order_id})
  getOwnById: async (id) => {
    return apiRequest(ENDPOINTS.orders.details(id), { method: 'GET' });
  },
};

// وحدة خدمات إعدادات المنصة العامة وإعدادات الإدارة (Settings API)
export const settingsApi = {
  // جلب الإعدادات العامة للمتجر المتاحة للجميع (GET /settings)
  getPublic: async () => {
    return apiRequest(ENDPOINTS.settings.public, { method: 'GET' });
  },

  // تحديث إعدادات المنصة من قبل المشرف (PUT /admin/settings)
  updateAdmin: async (payload = {}) => {
    return apiRequest(ENDPOINTS.settings.admin, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};
