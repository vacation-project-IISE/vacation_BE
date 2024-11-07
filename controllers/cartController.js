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

exports.addToCart = (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    const sql =
        "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)";
    pool.query(sql, [user_id, product_id, quantity], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "SQL 실행 오류" });
        }
        return res.status(200).json({ message: "장바구니에 추가되었습니다." });
    });
};

exports.getCart = (req, res) => {
    const sql = "SELECT * FROM cart";
    pool.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "SQL 실행 오류" });
        }
        return res.status(200).json(results);
    });
};
