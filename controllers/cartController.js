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

// 장바구니에 상품 추가
exports.addToCart = async (req, res) => {
  const { user_id, product_name, price, category_name } = req.body;

  try {
    const cartRef = collection(db, "carts");
    const q = query(cartRef, where("user_id", "==", user_id));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // 해당 사용자의 장바구니가 없으면 새로 생성
      await addDoc(cartRef, {
        user_id,
        items: [
          {
            product_name,
            price,
            category_name,
          },
        ],
      });
    } else {
      // 해당 사용자의 장바구니가 있으면 기존 장바구니에 추가
      const cartDoc = querySnapshot.docs[0];
      const cartDocRef = doc(db, "carts", cartDoc.id);
      await updateDoc(cartDocRef, {
        items: arrayUnion({
          product_name,
          price,
          category_name,
        }),
      });
    }

    return res.status(200).json({ message: "장바구니에 추가되었습니다." });
  } catch (error) {
    console.error("장바구니 추가 오류:", error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 장바구니 조회
exports.getCart = async (req, res) => {
  console.log("Request query:", req.query);
  const { user_id } = req.query;
  console.log("User ID:", user_id);

  if (!user_id) {
    return res.status(400).json({ message: "user_id 받지 못함" });
  }

  try {
    // carts 컬렉션에서 user_id 필드가 일치하는 문서 찾기
    const cartsRef = collection(db, "carts");
    const q = query(cartsRef, where("user_id", "==", user_id));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("장바구니가 비어있습니다.");
      return res.status(200).json([]); // 빈 배열 반환
    }

    const cartItems = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.items) {
        cartItems.push(...data.items); // items 배열 병합
      }
    });

    return res.status(200).json(cartItems); // 장바구니 아이템 목록 반환
  } catch (error) {
    console.error("장바구니 조회 오류:", error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 장바구니에서 상품 삭제
exports.removeFromCart = async (req, res) => {
  const { user_id, product_name, price, category_name } = req.body;

  if (
    !user_id ||
    !product_name ||
    !Array.isArray(product_name) ||
    product_name.length === 0
  ) {
    return res.status(400).json({ message: "유효하지 않은 요청입니다." });
  }

  try {
    const cartRef = collection(db, "carts");
    const q = query(cartRef, where("user_id", "==", user_id));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res
        .status(404)
        .json({ message: "해당 사용자의 장바구니가 없습니다." });
    }

    const cartDoc = querySnapshot.docs[0];
    const cartDocRef = doc(db, "carts", cartDoc.id);
    const existingItems = cartDoc.data().items || [];

    // 삭제 대상 제외한 항목만 유지
    const updatedItems = existingItems.filter(
      (item) => !product_name.includes(item.product_name)
    );

    // 장바구니 업데이트
    await updateDoc(cartDocRef, { items: updatedItems });

    return res.status(200).json({
      message: "항목이 삭제되었습니다.",
      deletedItems: product_name, // 삭제된 항목의 ID를 반환
    });
  } catch (error) {
    console.error("삭제 오류:", error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
