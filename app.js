const express = require("express");
const path = require("path");
const static = require("serve-static");
const cors = require("cors");
const app = express();

// Firebase 설정 가져오기
const { db } = require("./config/dbconfig"); // Firestore 데이터베이스 가져오기
require("dotenv").config(); // .env 파일 로드

// 미들웨어 설정
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public", static(path.join(__dirname, "public")));

// 라우트 파일들 연결
const registerRoutes = require("./routes/registerRoutes");
const loginRoutes = require("./routes/loginRoutes");
const cartRoutes = require("./routes/cartRoutes");

app.use("/api/register", registerRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/cart", cartRoutes);

// 서버 시작
app.listen(4000, () => {
    console.log("서버가 포트 4000에서 실행 중입니다.");
});

module.exports = app;
