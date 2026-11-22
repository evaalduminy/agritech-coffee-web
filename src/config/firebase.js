import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

// قراءة بيانات تهيئة Firebase من متغيرات البيئة ببادئة Vite
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// التحقق الآمن من وجود المفاتيح الأساسية لتفادي أي انهيار في حال غياب ملف .env
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  String(firebaseConfig.apiKey).trim() !== '' &&
  String(firebaseConfig.authDomain).trim() !== '' &&
  String(firebaseConfig.projectId).trim() !== ''
);

// تهيئة تطبيق ومزود المصادقة فقط عند توفر مفاتيح المشروع
let app = null;
let auth = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    // إتاحة نافذة اختيار حساب Gmail للمستخدم دائماً
    googleProvider.setCustomParameters({
      prompt: 'select_account',
    });
  } catch (error) {
    console.warn('تعذر تهيئة Firebase Auth:', error);
  }
}

export { app, auth, googleProvider, signInWithPopup, signOut };
