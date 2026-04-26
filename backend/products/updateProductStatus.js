const pool = require("../config/db");

const VALID_STATUSES = ["판매중", "예약중", "판매완료"];

// 상품 상태 변경
const updateProductStatus = async (req, res) => {
  try {
    const {id} = req.params;
    const {status} = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success : false,
        message : "유효하지 않은 거래 상태입니다.",
        error : {code : "INVALID_STATUS"},
      });
    }

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
        message : "권한이 없습니다.",
        error : {code : "FORBIDDEN"},
      });
    }

    await pool.execute("UPDATE products SET status = ?, updated_at = NOW() WHERE id = ?", [status, id]);

    return res.status(200).json ({
      success : true,
      message : "거래 상태가 변경되었습니다.",
      data : {id : parseInt(id, 10), status},
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json ({
      success : false,
      message : "서버 오류가 발생했습니다.",
      error : {code : "INTERNAL_SERVER_ERROR"},
    });
  }
};

module.exports = updateProductStatus;
