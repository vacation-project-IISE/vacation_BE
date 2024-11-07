const bcrypt = require("bcrypt");
const pool = require("../models/db");

exports.login = (req, res) => {
    const { user_id, user_pwd } = req.body; // user_id가 이메일임

    pool.getConnection((err, conn) => {
        if (err) {
            console.error("MySQL getConnection error:", err); // 오류 로그
            res.status(500).send("DB 서버 실패");
            return;
        }

        // 이메일 기반으로 사용자 정보 조회
        const sql = "SELECT email, password FROM users WHERE email = ?";
        conn.query(sql, [user_id], async (err, results) => {
            conn.release(); // 커넥션 반환

            if (err) {
                console.error("SQL 실행 오류:", err); // SQL 실행 오류 로그
                res.status(500).send("SQL 실행 실패");
                return;
            }

            if (results.length === 0) {
                // 이메일이 존재하지 않음
                console.log("사용자 없음:", user_id); // 로그 출력
                res.status(401).send("아이디 또는 비밀번호가 잘못되었습니다.");
                return;
            }

            // 데이터베이스에서 가져온 해시된 비밀번호
            const hashedPassword = results[0].password;

            try {
                // 비밀번호 검증
                const match = await bcrypt.compare(user_pwd, hashedPassword);

                if (match) {
                    console.log(`로그인 성공: 이메일 ${user_id}`);
                    res.status(200).send("로그인 성공");
                } else {
                    console.log("비밀번호 불일치");
                    res.status(401).send(
                        "아이디 또는 비밀번호가 잘못되었습니다."
                    );
                }
            } catch (err) {
                console.error("비밀번호 검증 오류:", err); // bcrypt 오류 로그
                res.status(500).send("서버 오류");
            }
        });
    });
};
