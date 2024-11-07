const mysql = require("mysql");
const dbconfig = require("../config/dbconfig.json");

const pool = mysql.createPool({
    connectionLimit: 10,
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
});

pool.on("connection", (connection) => {
    console.log("DB 연결 성공:", connection.threadId);
});

pool.on("error", (err) => {
    console.error("DB 연결 오류:", err);
});

module.exports = pool;
