const { db } = require("../config/dbconfig");
const {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    deleteDoc,
    doc,
} = require("firebase/firestore");

// 장바구니에 상품 추가
exports.addToCart = async (req, res) => {
    const { user_id, cart_number, product_number } = req.body;

    try {
        // Firestore의 "cart" 컬렉션에 장바구니 데이터 추가
        await addDoc(collection(db, "cart"), {
            user_id,
            cart_number,
            product_number,
        });

        return res.status(200).json({ message: "장바구니에 추가되었습니다." });
    } catch (error) {
        console.error("장바구니 추가 오류:", error);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};

// 장바구니 조회
exports.getCart = async (req, res) => {
    const { user_id } = req.query; // 쿼리 파라미터에서 user_id 받기

    try {
        const cartRef = collection(db, "cart");
        const q = query(cartRef, where("user_id", "==", user_id));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res
                .status(404)
                .json({ message: "장바구니가 비어있습니다." });
        }

        // 결과 데이터 구성
        const cartItems = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return res.status(200).json(cartItems);
    } catch (error) {
        console.error("장바구니 조회 오류:", error);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};

// 장바구니에서 상품 삭제
exports.removeFromCart = async (req, res) => {
    const { user_id, cart_number, product_number } = req.body;

    try {
        const cartRef = collection(db, "cart");
        const q = query(
            cartRef,
            where("user_id", "==", user_id),
            where("cart_number", "==", cart_number),
            where("product_number", "==", product_number)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res.status(404).json({
                message: "해당 상품이 장바구니에 없습니다.",
            });
        }

        // 해당 문서를 삭제
        const cartDoc = querySnapshot.docs[0];
        await deleteDoc(doc(db, "cart", cartDoc.id));

        return res
            .status(200)
            .json({ message: "장바구니에서 삭제되었습니다." });
    } catch (error) {
        console.error("장바구니 삭제 오류:", error);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};
