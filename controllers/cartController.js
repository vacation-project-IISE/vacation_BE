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
    const { user_id } = req.query;

    try {
        const cartRef = collection(db, "carts");
        const q = query(cartRef, where("user_id", "==", user_id));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res
                .status(404)
                .json({ message: "장바구니가 비어있습니다." });
        }

        const cartItems = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))[0]; // 하나의 장바구니만 반환

        return res.status(200).json(cartItems);
    } catch (error) {
        console.error("장바구니 조회 오류:", error);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};

// 장바구니에서 상품 삭제
exports.removeFromCart = async (req, res) => {
    const { user_id, product_name, price, category_name } = req.body;

    try {
        const cartRef = collection(db, "carts");
        const q = query(cartRef, where("user_id", "==", user_id));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res.status(404).json({
                message: "해당 사용자의 장바구니가 없습니다.",
            });
        }

        const cartDoc = querySnapshot.docs[0];
        const cartDocRef = doc(db, "carts", cartDoc.id);

        // 기존 항목에서 삭제
        const cartItems = cartDoc
            .data()
            .items.filter(
                (item) =>
                    !(
                        item.product_name === product_name &&
                        item.price === price &&
                        item.category_name === category_name
                    )
            );

        await updateDoc(cartDocRef, { items: cartItems });

        return res
            .status(200)
            .json({ message: "장바구니에서 삭제되었습니다." });
    } catch (error) {
        console.error("장바구니 삭제 오류:", error);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};
