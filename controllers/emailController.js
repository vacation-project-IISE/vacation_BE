const { smtpTransport } =require('../config/email');
const { db } = require('../config/dbconfig');
const { collection, query, where, getDocs, } = require('firebase/firestore');

exports.emailAuthId = async(req,res) => {
    const { email, authNumber } = req.body;

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    // const email = "vacabe240723@naver.com";
    
    const mailOptions = {
        from : "vacabe240723@naver.com", 
        to : email, 
        subject : " 인증 관련 메일 입니다. ",
        html : '<h1>인증번호를 입력해주세요 \n\n\n\n\n\n</h1>' + authNumber
    }
    if(querySnapshot.empty) {
        return res.status(404).json({ok : false, message: "해당 이메일로 가입된 사용자가 없습니다." });
    } else {
        smtpTransport.sendMail(mailOptions, (err, response) => {
            console.log("response", response);
            //첫번째 인자는 위에서 설정한 mailOption을 넣어주고 두번째 인자로는 콜백함수.
            if(err) {
                res.json({ok : false , msg : ' 메일 전송에 실패하였습니다. '})
                smtpTransport.close() //전송종료
                return
            } else {
                res.json({ok: true, msg: ' 메일 전송에 성공하였습니다. ', authNum : authNumber})
                smtpTransport.close() //전송종료
                return 
    
            }
        });
    };
    
};

exports.emailAuthPw = async(req,res) => {
    const { user_id, email, authNumber } = req.body;

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email), where("user_id", "==", user_id));
    const querySnapshot = await getDocs(q);
    
    if(querySnapshot.empty) {
        // authNumber = "해당 이메일로 가입된 사용자가 없습니다.";
        console.log("해당 이메일로 가입된 사용자가 없습니다.해당 이메일로 가입된 사용자가 없습니다.해당 이메일로 가입된 사용자가 없습니다.해당 이메일로 가입된 사용자가 없습니다.");
        return res.status(404).json({ok : false, message: "해당 이메일로 가입된 사용자가 없습니다." });
    } else {
        smtpTransport.sendMail(mailOptions, (err, response) => {
            console.log("response", response);
            //첫번째 인자는 위에서 설정한 mailOption을 넣어주고 두번째 인자로는 콜백함수.
            if(err) {
                res.json({ok : false , msg : ' 메일 전송에 실패하였습니다. '})
                smtpTransport.close() //전송종료
                return
            } else {
                res.json({ok: true, msg: ' 메일 전송에 성공하였습니다. ', authNum : authNumber})
                smtpTransport.close() //전송종료
                return 
    
            }
        });
    };

    const mailOptions = {
        from : "vacabe240723@naver.com", 
        to : email, 
        subject : " 인증 관련 메일 입니다. ",
        html : '<h1>인증번호를 입력해주세요 \n\n\n\n\n\n</h1>' + authNumber
    }
};

// 이메일이 틀리면 즉각적인 반응?