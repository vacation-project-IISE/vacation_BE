const express = require("express"); //Express 모듈을 가져옴
const router = express.Router(); // 라우터 인스턴스를 생성, 특정 경로에 대한 요청을 처리하는 데 사용, router는 라우트 핸들러를 정의할 수 있는 객체입니다.
const login = require("./login"); // login.js 파일을 가져오기

router.use("/", login); //  / <- 이 경로로 들어오는 요청은 login 모듈에서 정의한 라우트 핸들러로 처리
module.exports = router; // 다른 파일에서 이 모듈을 require하여 router를 사용가능, app.js 파일에서 이 모듈을 가져와서 /login 경로에 연결하게 됨
