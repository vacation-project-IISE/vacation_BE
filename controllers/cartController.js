const mysql = require("mysql");
const dbconfig = require("../config/dbconfig.json");

const pool = mysql.createPool({
    connectionLimit: 10,
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
});

// 장바구니에 상품 추가
exports.addToCart = (req, res) => {
    const { user_id, cart_number, product_number } = req.body;
    const sql =
        "INSERT INTO cart (user_id, cart_number, product_number) VALUES (?, ?, ?)";
    pool.query(sql, [user_id, cart_number, product_number], (err, result) => {
        if (err) {
            console.error("SQL 실행 오류:", err);
            return res.status(500).json({ message: "SQL 실행 오류" });
        }
        return res.status(200).json({ message: "장바구니에 추가되었습니다." });
    });
};

// 장바구니 조회
exports.getCart = (req, res) => {
    const sql = "SELECT * FROM cart WHERE user_id = ?";
    const userId = req.query.user_id; // 쿼리 파라미터에서 user_id 받기

    pool.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("SQL 실행 오류:", err);
            return res.status(500).json({ message: "SQL 실행 오류" });
        }
        if (results.length === 0) {
            return res
                .status(404)
                .json({ message: "장바구니에 항목이 없습니다." });
        }
        return res.status(200).json(results);
    });
};

// 장바구니에서 상품 삭제
exports.removeFromCart = (req, res) => {
    const { user_id, cart_number, product_number } = req.body;
    const sql =
        "DELETE FROM cart WHERE user_id = ? AND cart_number = ? AND product_number = ?";
    pool.query(sql, [user_id, cart_number, product_number], (err, result) => {
        if (err) {
            console.error("SQL 실행 오류:", err);
            return res.status(500).json({ message: "SQL 실행 오류" });
        }
        if (result.affectedRows === 0) {
            return res
                .status(404)
                .json({ message: "장바구니에 해당 상품이 없습니다." });
        }
        return res
            .status(200)
            .json({ message: "장바구니에서 삭제되었습니다." });
    });
};
