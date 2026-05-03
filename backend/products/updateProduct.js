const pool = require("../config/db");
const { getProductById, formatProduct } = require("./helpers");

// 상품 수정
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

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
      return res.status(403).json({
        success : false,
        message : "수정 권한이 없습니다.",
        error : {code : "FORBIDDEN"},
      });
    }

    const { title, description, price, category_id } = req.body;
    const imageFiles = req.files;

    if (title !== undefined && (title.length < 2 || title.length > 100)) {
      return res.status(400).json({
        success : false,
        message : "제목은 2글자 이상 100글자 이하로 입력해주세요.",
        error : {code : "INVALID_INPUT"},
      });
    }

    if (price !== undefined && Number(price) < 0) {
      return res.status(400).json({
        success : false,
        message : "가격은 0 이상이어야 합니다.",
        error : {code : "INVALID_INPUT"},
      });
    }

    const updates = [];
    const values = [];

    if (title !== undefined) {updates.push("title = ?"); values.push(title);}
    if (description !== undefined) {updates.push("description = ?"); values.push(description);}
    if (price !== undefined) {updates.push("price = ?"); values.push(Number(price));}
    if (category_id !== undefined) {updates.push("category_id = ?"); values.push(Number(category_id));}
    if (imageFiles && imageFiles.length > 0) {
      updates.push("image_url = ?");
      values.push(`/uploads/products/${imageFiles[0].filename}`);
    }

    if (updates.length === 0) {
      return res.status(400).json ({
        success : false,
        message : "수정할 내용이 없습니다.",
        error : {code : "NO_CHANGES"},
      });
    }

    updates.push("updated_at = NOW()");
    values.push(id);
    await pool.execute(`UPDATE products SET ${updates.join(", ")} WHERE id = ?`, values);

    const updated = await getProductById(id);
    return res.status(200).json ({
      success : true,
      message : "물품이 수정되었습니다.",
      data : formatProduct(updated),
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

module.exports = updateProduct;
