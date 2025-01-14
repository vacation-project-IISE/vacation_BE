const express = require("express");
const router = express.Router();
const { emailAuth } = require("../controllers/emailController");

router.post("/", emailAuth);
module.exports = router;
