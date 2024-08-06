const express = require("express"); //express 불러오기
const app = express(); // express() 함수를 호출 -> app 객체를 통해 라우팅 및 미들웨어를 설정
const port = 3000; // 서버가 수신할 포트 번호 설정
const router = require("../routes/route"); // routes 폴더 안의 route.js와 연결

app.use(express.static("public")); // public 폴더에 있는 정적 파일을 서빙, public의 html파일 접근하려고 함
app.use(express.urlencoded({ extended: true })); //  URL-encoded 형식의 요청 본문을 파싱할 수 있도록 설정, 주로 HTML 폼에서 제출된 데이터를 파싱하는 데 사
app.use(express.json()); // JSON 형식의 요청 본문을 파싱할 수 있도록 설정m 주로 API에서 JSON 데이터를 처리할 때 사용

app.listen(port, () => {
    console.log("서버 가동");
}); //서버를 시작하고, 지정된 포트에서 요청을 수신 대기

app.get("/", (req, res) => {
    res.send("hello");
}); // 루트 경로(/)에 대한 GET 요청을 처리

app.use("/login", router);
// login 경로로 들어오는 요청은 route.js에서 정의한 방식으로 처리
// router는 route.js 파일에서 정의된 라우터를 의미
