const { db } = require("../config/dbconfig");
const { collection, addDoc } = require("firebase/firestore");

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Firestore에 사용자 데이터 저장
        await addDoc(collection(db, "users"), {
            username,
            email,
            password,
        });

        res.status(200).json({ message: "회원가입 성공!" });
    } catch (error) {
        console.error("회원가입 오류:", error);
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};

module.exports = { register };
