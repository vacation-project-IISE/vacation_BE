// dbconfig.js
const { initializeApp } = require("firebase/app");
const { getFirestore, collection } = require("firebase/firestore");
require("dotenv").config(); // 환경변수 로드

// Firebase 설정
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

// Firebase 초기화
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp); // Firestore 인스턴스를 가져옵니다.

module.exports = { db, collection }; // db를 export하여 다른 곳에서 사용 가능하게 합니다.
