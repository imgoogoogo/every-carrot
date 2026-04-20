const pool = require("../config/db");
const { getProductById, formatProduct } = require("./helpers");

// 상품 등록 - 새 상품을 DB에 저장
const createProduct = async (req, res) => {
  try {
    const { title, description, price, category_id } = req.body;
    const imageFile = req.file;

    if (!title || !description || price === undefined || !category_id) {
      return res.status(400).json({
        success : false,
        message : "필수 항목을 모두 입력해주세요.",
        error : { code : "MISSING_REQUIRED_FIELDS" },
      });
    }

    if (title.length < 2 || title.length > 100) {
      return res.status(400).json({
        success : false,
        message : "제목은 2자 이상 100자 이하로 입력해주세요.",
        error : { code : "INVALID_INPUT" },
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({
        success : false,
        message : "가격은 0 이상이어야 합니다.",
        error : { code : "INVALID_INPUT" },
      });
    }

    const imageUrl = imageFile
      ? `${req.protocol}://${req.get("host")}/uploads/products/${imageFile.filename}`
      : null;

    const [result] = await pool.execute(
      "INSERT INTO products (title, description, price, category_id, seller_id, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [title, description, Number(price), Number(category_id), req.user.id, imageUrl, "판매중"]
    );

    const product = await getProductById(result.insertId);
    return res.status(201).json({
      success : true,
      message : "물품이 등록되었습니다.",
      data : formatProduct(product),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success : false,
      message : "서버 오류가 발생했습니다.",
      error : { code : "INTERNAL_SERVER_ERROR" },
    });
  }
};

module.exports = createProduct;
