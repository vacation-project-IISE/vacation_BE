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

// 위시리스트에 상품 추가
exports.addToWishlist = async (req, res) => {
    const { user_id, product_name, price, category_name } = req.body;

    try {
        const wishlistRef = collection(db, "wishlists");
        const q = query(wishlistRef, where("user_id", "==", user_id));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            // 해당 사용자의 위시리스트가 없으면 새로 생성
            await addDoc(wishlistRef, {
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
            // 해당 사용자의 위시리스트가 있으면 기존 위시리스트에 추가
            const wishlistDoc = querySnapshot.docs[0];
            const wishlistDocRef = doc(db, "wishlists", wishlistDoc.id);
            await updateDoc(wishlistDocRef, {
                items: arrayUnion({
                    product_name,
                    price,
                    category_name,
                }),
            });
        }

        return res
            .status(200)
            .json({ message: "위시리스트에 추가되었습니다." });
    } catch (error) {
        console.error("위시리스트 추가 오류:", error);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};

// 위시리스트 조회
exports.getWishlist = async (req, res) => {
    const { user_id } = req.query;

    try {
        const wishlistRef = collection(db, "wishlists");
        const q = query(wishlistRef, where("user_id", "==", user_id));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res
                .status(404)
                .json({ message: "위시리스트가 비어있습니다." });
        }

        const wishlistItems = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))[0]; // 하나의 위시리스트만 반환

        return res.status(200).json(wishlistItems);
    } catch (error) {
        console.error("위시리스트 조회 오류:", error);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};

// 위시리스트에서 상품 삭제
exports.removeFromWishlist = async (req, res) => {
    const { user_id, product_name, price, category_name } = req.body;

    try {
        const wishlistRef = collection(db, "wishlists");
        const q = query(wishlistRef, where("user_id", "==", user_id));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res.status(404).json({
                message: "해당 사용자의 위시리스트가 없습니다.",
            });
        }

        const wishlistDoc = querySnapshot.docs[0];
        const wishlistDocRef = doc(db, "wishlists", wishlistDoc.id);

        // 기존 항목에서 삭제
        const wishlistItems = wishlistDoc
            .data()
            .items.filter(
                (item) =>
                    !(
                        item.product_name === product_name &&
                        item.price === price &&
                        item.category_name === category_name
                    )
            );

        await updateDoc(wishlistDocRef, { items: wishlistItems });

        return res
            .status(200)
            .json({ message: "위시리스트에서 삭제되었습니다." });
    } catch (error) {
        console.error("위시리스트 삭제 오류:", error);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};
