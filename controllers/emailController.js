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
    try {
        console.log("이메일 인증 요청 시작");
        console.log("요청 데이터:", req.body);

        const { email, authNumber } = req.body;
        if (!email || !authNumber) {
            console.log("요청 데이터가 부족합니다.");
            return res
                .status(400)
                .json({ ok: false, msg: "이메일 또는 인증번호 누락" });
        }

        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res.status(404).json({
                ok: false,
                message: "해당 이메일로 가입된 사용자가 없습니다.",
            });
        }

        const userData = querySnapshot.docs[0].data();
        console.log("찾은 사용자 데이터:", userData);

        await sendMailAsync(email, authNumber);

        console.log("응답 전송 완료");
        return res.json({
            ok: true,
            msg: "메일 전송 성공",
            user_id: userData.user_id,
            authNum: authNumber,
        });
    } catch (error) {
        console.error("서버 오류 발생:", error);
        return res.status(500).json({ ok: false, msg: "서버 오류 발생" });
    }
};

exports.emailAuthPw = async (req, res) => {
    try {
        const { email, user_id, authNumber } = req.body;
        if (!email || !user_id || !authNumber) {
            return res
                .status(400)
                .json({ ok: false, msg: "요청 데이터가 부족합니다." });
        }

        const usersRef = collection(db, "users");
        const q = query(
            usersRef,
            where("email", "==", email),
            where("user_id", "==", user_id)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res
                .status(404)
                .json({
                    ok: false,
                    message: "해당 이메일로 가입된 사용자가 없습니다.",
                });
        }

        await sendMailAsync(email, authNumber);

        res.json({
            ok: true,
            msg: "메일 전송에 성공하였습니다.",
            authNum: authNumber,
        });
    } catch (error) {
        console.error("메일 전송 실패:", error);
        res.status(500).json({ ok: false, msg: "메일 전송 중 오류 발생" });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { user_id, newPassword } = req.body;

        console.log("백엔드에서 받은 user_id:", user_id);
        console.log("백엔드에서 받은 newPassword:", newPassword);

        if (!user_id || !newPassword) {
            return res
                .status(400)
                .json({ ok: false, message: "요청 데이터가 부족합니다." });
        }

        const usersRef = collection(db, "users");
        const q = query(usersRef, where("user_id", "==", user_id));
        const querySnapshot = await getDocs(q);

        console.log("Firestore에서 찾은 사용자 수:", querySnapshot.size);

        if (querySnapshot.empty) {
            return res
                .status(404)
                .json({ ok: false, message: "사용자를 찾을 수 없습니다." });
        }

        console.log("비밀번호 해싱 중...");
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log("해싱된 비밀번호:", hashedPassword);

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

const sendMailAsync = (email, authNumber) => {
    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: "vacabe240723@naver.com",
            to: email,
            subject: "인증 관련 메일입니다.",
            html: `<h1>인증번호를 입력해주세요</h1><p>${authNumber}</p>`,
        };

        smtpTransport.sendMail(mailOptions, (err, response) => {
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        });

        setTimeout(() => reject(new Error("SMTP 응답 시간 초과")), 10000);
    });
};
