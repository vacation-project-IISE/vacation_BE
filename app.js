const express = require("express");
const mysql = require("mysql");
const path = require("path"); //경로를 쉽게 사용하기 위함
const static = require("serve-static"); //얘가 경로 맨 위 조상임
const dbconfig = require("./config/dbconfig.json");

//database connection pool
const pool = mysql.createPool({
    //공용 전동킥보드 느낌
    connectionLimit: 10, //pool개수 10개
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
    debug: false,
});

const app = express();
app.use(express.urlencoded({ extended: true })); //어떤 형태의 url로 보내건 해석 가능하도록
app.use(express.json()); //json으로 와도 해석 가능
app.use("/public", static(path.join(__dirname, "public")));

app.post("/process/adduser", (req, res) => {
    console.log("/process/adduser 호출됨" + req);

    const paramID = req.body.id;
    const paramName = req.body.name;
    const paramAge = req.body.age;
    const paramPassword = req.body.password;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("error");
            res.writeHead("200", {
                "Content-Type": "text/html; charset=utf8",
            });
            res.write("<h2>db 서버 연결 실패</h2>");
            res.end();
            return;
        }

        console.log("데베 연결 끈 얻었음");
        conn.query(
            "INSERT INTO users (id, name, age, password) VALUES (?, ?, ?, PASSWORD(?));",
            [paramID, paramName, paramAge, paramPassword],
            (err, result) => {
                conn.release();

                if (err) {
                    console.error("SQL 실행 오류: ", err); // 오류 로그 출력
                    res.writeHead(500, {
                        "Content-Type": "text/html; charset=utf8",
                    });
                    res.write("<h2>SQL 쿼리 실행 실패</h2>");
                    res.end();
                    return;
                }

                console.log("사용자 추가 성공");
                res.writeHead(200, {
                    "Content-Type": "text/html; charset=utf8",
                });
                res.write("<h2>사용자 추가 성공</h2>");
                res.end();
            }
        );
    }); //놀고있는 커넥텬 하나 줘
});

app.listen(3000, () => {
    console.log("port 3000");
});
