const { db } = require("../config/dbconfig");
const {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  doc,
} = require("firebase/firestore");

// 결제 데이터 저장
exports.saveOrder = async (req, res) => {
  const {
    amount,
    buyer_addr,
    buyer_name,
    buyer_postcode,
    name,
    merchant_uid,
    product_array,
  } = req.body;

  // 필수 데이터 검증
  if (
    !amount ||
    !buyer_addr ||
    !buyer_name ||
    !buyer_postcode ||
    !name ||
    !merchant_uid
  ) {
    return res.status(400).json({ message: "모든 필드를 입력해주세요." });
  }

  try {
    const orderRef = collection(db, "orders");

    // Firestore에 주문 데이터 저장
    await addDoc(orderRef, {
      total_price: amount, // 결제 금액
      address: buyer_addr, // 구매자 주소
      user_id: buyer_name, // 구매자 이름
      postcode: buyer_postcode, // 우편번호
      product_name: name, // 상품 이름 (또는 설명)
      product_array: product_array,
      order_number: merchant_uid, // 주문 고유 번호
      createdAt: new Date(), // 주문 생성 시간
    });

    return res
      .status(200)
      .json({ message: "결제 정보가 성공적으로 저장되었습니다." });
  } catch (error) {
    console.error("결제 정보 저장 중 오류:", error);
    return res
      .status(500)
      .json({ message: "결제 정보를 저장하는 데 실패했습니다." });
  }
};

// 주문 조회 함수
exports.getOrders = async (req, res) => {
  const { user_id } = req.body; // POST 요청에서 user_id 추출

  if (!user_id) {
    return res.status(400).json({ message: "user_id가 필요합니다." });
  }

  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("user_id", "==", user_id)); // Firestore에서 buyer_email 기준으로 조회
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log(`주문 내역이 없습니다. (user_id: ${user_id})`); // 디버깅용 로그
      return res.status(200).json([]); // 주문이 없을 경우 빈 배열 반환
    }

    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() }); // Firestore 문서 데이터를 배열로 저장
    });

    // console.log(`조회된 주문 데이터:`, orders); // 디버깅용 로그
    return res.status(200).json(orders); // 주문 데이터 반환
  } catch (error) {
    console.error("주문 조회 중 오류:", error);
    return res
      .status(500)
      .json({ message: "주문 데이터를 조회하는 데 실패했습니다." });
  }
};
