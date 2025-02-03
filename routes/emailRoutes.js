const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController");

router.post("/findId", emailController.emailAuthId);
router.post("/findPw", emailController.emailAuthPw);
router.post("/resetPW", emailController.resetPassword); // 비밀번호 변경 추가

module.exports = router;
