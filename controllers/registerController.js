const bcrypt = require("bcrypt");
const mysql = require("mysql");
const dbconfig = require("../config/dbconfig.json");

// MySQL 연결 풀 설정
const pool = mysql.createPool({
    connectionLimit: 10,
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
});

exports.register = async (req, res) => {
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
};
