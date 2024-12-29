const bcrypt = require("bcryptjs");
const { db } = require("../config/dbconfig");
const { collection, addDoc, query, where, getDocs } = require("firebase/firestore");

const register = async (req, res) => {
    try {
        const { user_id, email, password } = req.body;

        // user_id 중복 확인
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("user_id", "==", user_id));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            return res
                .status(400)
                .json({ message: "이미 사용 중인 user_id입니다." });
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10); // 10은 salt rounds

        // Firestore에 사용자 데이터 저장 (비밀번호를 해싱된 값으로 저장)
        await addDoc(collection(db, "users"), {
            user_id,
            email,
            password: hashedPassword, // 해싱된 비밀번호를 저장
        });

        res.status(200).json({ message: "회원가입 성공!" });
    } catch (error) {
        console.error("회원가입 오류:", error);
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};

module.exports = { register };
