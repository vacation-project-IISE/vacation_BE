const jwt = require("jsonwebtoken"); // JWT 라이브러리 가져오기
const bcrypt = require("bcrypt");
const {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
} = require("firebase/firestore");
const { db } = require("../config/dbconfig");
const crypto = require("crypto"); // crypto 모듈 가져오기
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

exports.login = async (req, res) => {
    const { user_id, user_pwd } = req.body;

    if (!user_id || !user_pwd) {
        return res.status(400).send("이메일과 비밀번호를 입력해주세요.");
    }

    if (!emailRegex.test(user_id)) {
        return res.status(400).send("유효하지 않은 이메일 형식입니다.");
    }

    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", user_id));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res
                .status(404)
                .send("해당 이메일로 가입된 사용자가 없습니다.");
        }

        const user = querySnapshot.docs[0].data();
        const hashedPassword = user.password;

        const match = await bcrypt.compare(user_pwd, hashedPassword);

        if (match) {
            // 로그인 시마다 고유한 JWT 시크릿 키 생성
            const secretKey = crypto.randomBytes(64).toString("hex"); // 고유한 시크릿 키 생성

            // 토큰 생성
            const token = jwt.sign({ email: user_id }, secretKey, {
                expiresIn: "1h", // 토큰 유효 기간 (1시간)
            });

            console.log(`로그인 성공: 이메일 ${user_id}`);
            console.log("발급된 토큰:", token); // 발급된 토큰을 콘솔에 출력
            return res.status(200).json({ message: "로그인 성공", token }); // 토큰 반환
        } else {
            console.log("비밀번호 불일치");
            return res
                .status(401)
                .send("아이디 또는 비밀번호가 잘못되었습니다.");
        }
    } catch (err) {
        console.error("서버 오류:", err.message);
        console.error(err.stack);
        return res.status(500).send("서버 오류");
    }
};
