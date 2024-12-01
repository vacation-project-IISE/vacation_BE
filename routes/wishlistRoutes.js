const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");

// 위시리스트 추가
router.post("/", wishlistController.addToWishlist);

// 위시리스트 조회
router.get("/", wishlistController.getWishlist);

// 위시리스트 삭제
router.delete("/", wishlistController.removeFromWishlist);

module.exports = router;
