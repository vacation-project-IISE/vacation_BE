const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController");

router.post("/findId", emailController.emailAuthId);
router.post("/findPw", emailController.emailAuthPw);

module.exports = router;
