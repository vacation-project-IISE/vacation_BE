const { smtpTransport } = require("../config/email");
const { db } = require("../config/dbconfig");
const {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
} = require("firebase/firestore");
const bcrypt = require("bcryptjs");

exports.emailAuthId = async (req, res) => {
    const { email, authNumber } = req.body;

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    // const email = "vacabe240723@naver.com";

    if (querySnapshot.empty) {
        return res.status(404).json({
            ok: false,
            message: "해당 이메일로 가입된 사용자가 없습니다.",
        });
    }

    const userData = querySnapshot.docs[0].data();
    console.log("찾은 사용자 데이터:", userData); // user_id 값 확인

    const mailOptions = {
        from: "vacabe240723@naver.com",
        to: email,
        subject: " 인증 관련 메일 입니다. ",
        html: "<h1>인증번호를 입력해주세요 \n\n\n\n\n\n</h1>" + authNumber,
    };

    smtpTransport.sendMail(mailOptions, (err, response) => {
        console.log("response", response);
        if (err) {
            res.json({ ok: false, msg: "메일 전송에 실패하였습니다." });
        } else {
            res.json({
                ok: true,
                msg: "메일 전송에 성공하였습니다.",
                user_id: userData.user_id, // ✅ user_id 사용
            });
        }
        smtpTransport.close(); // ✅ 전송 종료는 중복 호출하지 않도록 수정
    });
};

exports.emailAuthPw = async (req, res) => {
    const { email, user_id, authNumber } = req.body;
    const usersRef = collection(db, "users");
    const q = query(
        usersRef,
        where("email", "==", email),
        where("user_id", "==", user_id)
    );
    const querySnapshot = await getDocs(q);

    const mailOptions = {
        from: "vacabe240723@naver.com",
        to: email,
        subject: " 인증 관련 메일 입니다. ",
        html: "<h1>인증번호를 입력해주세요 \n\n\n\n\n\n</h1>" + authNumber,
    };

    if (querySnapshot.empty) {
        return res.status(404).json({
            ok: false,
            message: "해당 이메일로 가입된 사용자가 없습니다.",
        });
    } else {
        smtpTransport.sendMail(mailOptions, (err, response) => {
            console.log("response", response);
            //첫번째 인자는 위에서 설정한 mailOption을 넣어주고 두번째 인자로는 콜백함수.
            if (err) {
                res.json({ ok: false, msg: " 메일 전송에 실패하였습니다. " });
                smtpTransport.close(); //전송종료
                return;
            } else {
                res.json({
                    ok: true,
                    msg: " 메일 전송에 성공하였습니다. ",
                    authNum: authNumber,
                });
                smtpTransport.close(); //전송종료
                return;
            }
        });
    }
};

exports.resetPassword = async (req, res) => {
    const { user_id, newPassword } = req.body;

    console.log("백엔드에서 받은 user_id:", user_id);
    console.log("백엔드에서 받은 newPassword:", newPassword); // ✅ 값 확인

    // ✅ newPassword가 없으면 user_pwd 사용
    const passwordToHash = newPassword || user_pwd; // undefined 방지
    if (!passwordToHash) {
        return res
            .status(400)
            .json({ ok: false, message: "비밀번호가 제공되지 않았습니다." });
    }
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("user_id", "==", user_id)); // ✅ user_id 기준으로 검색
        const querySnapshot = await getDocs(q);

        console.log("Firestore에서 찾은 사용자 수:", querySnapshot.size);

        if (querySnapshot.empty) {
            return res
                .status(404)
                .json({ ok: false, message: "사용자를 찾을 수 없습니다." });
        }

        // ✅ 비밀번호 해싱 전에 undefined 체크
        console.log("비밀번호 해싱 중... (원본 비밀번호):", passwordToHash);
        const hashedPassword = await bcrypt.hash(passwordToHash, 10);
        console.log("해싱된 비밀번호:", hashedPassword);

        // Firestore에 업데이트
        const userDoc = querySnapshot.docs[0].ref;
        await updateDoc(userDoc, { password: hashedPassword });

        return res
            .status(200)
            .json({ ok: true, message: "비밀번호가 변경되었습니다." });
    } catch (error) {
        console.error("비밀번호 변경 오류:", error);
        return res.status(500).json({ ok: false, message: "서버 오류 발생" });
    }
};
