// Firebase Firestore 연결 코드
const { initializeApp } = require("firebase/app");
const {
    getFirestore,
    collection,
    getDocs,
    addDoc,
} = require("firebase/firestore");
require("dotenv").config(); // 환경변수 로드

// Firebase 설정 객체
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
};

// Firebase 앱 초기화
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Firestore에서 데이터 읽기 예시
const getProducts = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const products = querySnapshot.docs.map((doc) => doc.data());
        console.log("Products:", products);
        return products;
    } catch (error) {
        console.error("Error getting products:", error);
        throw new Error("Unable to fetch products");
    }
};

// Firestore에 데이터 추가 예시
const addProduct = async (product) => {
    try {
        const docRef = await addDoc(collection(db, "products"), product);
        console.log("Document written with ID:", docRef.id);
    } catch (error) {
        console.error("Error adding product:", error);
        throw new Error("Unable to add product");
    }
};

// db 객체 내보내기
module.exports = {
    db, // Firebase db 객체
    getProducts,
    addProduct,
};
