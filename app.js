const express = require("express");
const mysql = require("mysql");
const path = require("path");
const static = require("serve-static");
const bcrypt = require("bcrypt");
const dbconfig = require("./config/dbconfig.json");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public", static(path.join(__dirname, "public")));

// MySQL 연결 풀 설정
const pool = mysql.createPool({
    connectionLimit: 10,
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
});

app.post("/api/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res
                .status(400)
                .json({ message: "필수 입력 항목이 누락되었습니다." });
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        pool.getConnection((err, conn) => {
            if (err) {
                console.error("MySQL getConnection error:", err);
                return res.status(500).json({ message: "DB 서버 실패" });
            }

            const sql =
                "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
            conn.query(
                sql,
                [username, email, hashedPassword],
                (err, result) => {
                    conn.release(); // 커넥션 반환

                    if (err) {
                        console.error("SQL 실행 오류:", err);
                        return res
                            .status(500)
                            .json({ message: "SQL 실행 실패" });
                    }

                    return res.status(200).json({ message: "회원가입 성공" });
                }
            );
        });
    } catch (error) {
        console.error("서버 오류:", error);
        return res.status(500).json({ message: "서버 오류 발생" });
    }
});
// 로그인 요청 처리 엔드포인트
app.post("/login", (req, res) => {
    const { user_id, user_pwd } = req.body;

    pool.getConnection((err, conn) => {
        if (err) {
            console.error("MySQL getConnection error:", err);
            res.status(500).send("DB 서버 실패");
            return;
        }

        const sql = "SELECT password FROM users WHERE id = ?";
        conn.query(sql, [user_id], async (err, results) => {
            conn.release(); // 커넥션 반환

            if (err) {
                console.error("SQL 실행 오류:", err);
                res.status(500).send("SQL 실행 실패");
                return;
            }

            if (results.length === 0) {
                // 사용자 아이디가 존재하지 않음
                res.status(401).send("아이디 또는 비밀번호가 잘못되었습니다.");
                return;
            }

            // 데이터베이스에서 가져온 해시된 비밀번호
            const hashedPassword = results[0].password;

            try {
                // 비밀번호 검증
                const match = await bcrypt.compare(user_pwd, hashedPassword);

                if (match) {
                    console.log(`로그인 성공: 아이디 ${user_id}`);
                    res.status(200).send("로그인 성공");
                } else {
                    res.status(401).send(
                        "아이디 또는 비밀번호가 잘못되었습니다."
                    );
                }
            } catch (err) {
                console.error("비밀번호 검증 오류:", err);
                res.status(500).send("서버 오류");
            }
        });
    });
});

// 서버 시작
app.listen(4000, () => {
    console.log("서버가 포트 4000에서 실행 중입니다.");
});
