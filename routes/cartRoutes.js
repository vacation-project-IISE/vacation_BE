const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// 장바구니 추가
router.post("/", cartController.addToCart);

// 장바구니 조회
router.get("/", cartController.getCart);

// 장바구니 삭제
router.get("/", cartController.removeFromCart);

module.exports = router;
