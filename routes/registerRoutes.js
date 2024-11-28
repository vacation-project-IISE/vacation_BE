const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");
// 회원가입 요청 처리
router.post("/", registerController.register); // /register -> "/"
module.exports = router;
