const express = require("express");
const path = require("path"); // 파일의 절대 경로를 만들거나 경로를 조작하기 위해 path 모듈 가져옴
const router = express.Router(); //새로운 라우터 인스턴스를 생성, router는 특정 경로에 대한 요청을 처리할 수 있는 핸들러를 정의할 수 있음

// 간단한 사용자 데이터베이스
const users = {
    user1: "password1",
    user2: "password2",
};

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/login.html"));
}); // 클라이언트가 / 경로로 GET 요청을 보내면, 서버는 public/login.html 파일을 반환

router.post("/", (req, res) => {
    const { user_id, user_pwd } = req.body;
    // user_id와 user_pwd를 추출

    if (users[user_id] && users[user_id] === user_pwd) {
        res.send("로그인 성공");
    } else {
        res.send("로그인 실패");
    }
});
// 클라이언트가 / 경로로 POST 요청을 보내면 핸들러 실행

module.exports = router;
// 다른 파일에서 이 모듈을 require하여 router를 사용할 수 있도록 함