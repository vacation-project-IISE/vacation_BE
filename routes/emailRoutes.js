const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController");
const e = require("express");

router.post("/findId", emailController.emailAuthId);
router.post("/findPw", emailController.emailAuthPw);
router.post("/resetPW",emailController.resetPassword);

module.exports = router;
