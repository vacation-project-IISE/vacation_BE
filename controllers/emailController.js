const { smtpTransport } =require('../config/email');

var generateRandomNumber = function(min, max) {
    var ranNum = Math.floor(Math.random()*(max-min+1)) + min;
    return ranNum;
};

const emailAuth = async(req,res) => {
    const number = generateRandomNumber(111111, 999999)

    const { email } = req.body;
    // const email = "vacabe240723@naver.com";

    const mailOptions = {
        from : "vacabe240723@naver.com", 
        to : email, 
        subject : " 인증 관련 메일 입니다. ",
        html : '<h1>인증번호를 입력해주세요 \n\n\n\n\n\n</h1>' + number
    }
    smtpTransport.sendMail(mailOptions, (err, response) => {
        console.log("response", response);
        //첫번째 인자는 위에서 설정한 mailOption을 넣어주고 두번째 인자로는 콜백함수.
        if(err) {
            res.json({ok : false , msg : ' 메일 전송에 실패하였습니다. '})
            smtpTransport.close() //전송종료
            return
        } else {
            res.json({ok: true, msg: ' 메일 전송에 성공하였습니다. ', authNum : number})
            smtpTransport.close() //전송종료
            return 

        }
    })
};

module.exports = { emailAuth };
// 비밀번호를 복호화해서 찾을수 없음
// 1. 처음부터 이메일에 임시비밀번호를 주고 나중에 변경하게 하기
// 2. 이메일에 랜덤 번호로 일치하면 변경하는 사이트 만들기