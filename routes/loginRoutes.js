const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
// 회원가입 요청 처리
router.post("/", loginController.login);
module.exports = router;
