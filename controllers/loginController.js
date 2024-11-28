const bcrypt = require("bcrypt");
const {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
} = require("firebase/firestore");
const { db } = require("../config/dbconfig"); // Firebase 초기화된 db 객체

// 이메일 형식 검사를 위한 정규식
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

exports.login = async (req, res) => {
    const { user_id, user_pwd } = req.body;

    // 유효성 검사: 이메일과 비밀번호가 제공되지 않으면 400 오류
    if (!user_id || !user_pwd) {
        return res.status(400).send("이메일과 비밀번호를 입력해주세요.");
    }

    // 이메일 형식 검사
    if (!emailRegex.test(user_id)) {
        return res.status(400).send("유효하지 않은 이메일 형식입니다.");
    }

    try {
        // Firestore에서 해당 이메일로 사용자 정보 조회
        const usersRef = collection(db, "users"); // "users" 컬렉션 참조
        const q = query(usersRef, where("email", "==", user_id));
        const querySnapshot = await getDocs(q); // getDocs 사용

        // 사용자 정보가 없으면 404 오류
        if (querySnapshot.empty) {
            return res
                .status(404)
                .send("해당 이메일로 가입된 사용자가 없습니다.");
        }

        const user = querySnapshot.docs[0].data(); // 첫 번째 사용자 정보
        const hashedPassword = user.password;

        // 비밀번호 검증
        const match = await bcrypt.compare(user_pwd, hashedPassword);

        if (match) {
            console.log(`로그인 성공: 이메일 ${user_id}`);
            return res.status(200).send("로그인 성공");
        } else {
            console.log("비밀번호 불일치");
            return res
                .status(401)
                .send("아이디 또는 비밀번호가 잘못되었습니다.");
        }
    } catch (err) {
        console.error("서버 오류:", err.message); // 상세한 오류 메시지 로그
        console.error(err.stack); // 스택 트레이스를 함께 출력하여 디버깅에 도움
        return res.status(500).send("서버 오류");
    }
};
