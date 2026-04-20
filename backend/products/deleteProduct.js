const pool = require("../config/db");

// 상품 삭제
const deleteProduct = async (req, res) => {
  try {
    const {id} = req.params;

    const [rows] = await pool.execute("SELECT * FROM products WHERE id = ?", [id]);
    const product = rows[0];

    if (!product) {
      return res.status(404).json ({
        success : false,
        message : "존재하지 않는 물품입니다.",
        error : {code : "PRODUCT_NOT_FOUND"},
      });
    }
    if (product.seller_id !== req.user.id) {
      return res.status(403).json ({
        success : false,
        message : "삭제 권한이 없습니다.",
        error : {code : "FORBIDDEN"},
      });
    }

    await pool.execute("DELETE FROM products WHERE id = ?", [id]);
    return res.status(200).json({success : true, message : "물품이 삭제되었습니다."});
  } catch (err) {
    console.error(err);
    return res.status(500).json ({
      success : false,
      message : "서버 오류가 발생했습니다.",
      error : {code : "INTERNAL_SERVER_ERROR"},
    });
  }
};

module.exports = deleteProduct;
