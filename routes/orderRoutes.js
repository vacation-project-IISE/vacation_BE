const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// 주문 데이터 저장 (POST 요청)
router.post("/", orderController.saveOrder);

// 주문 데이터 조회 (POST 요청)
router.post("/getOrders", orderController.getOrders);

module.exports = router;
