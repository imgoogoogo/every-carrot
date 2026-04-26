const { getProductById, formatProduct } = require("./helpers");

// 상품 조회
const getProduct = async (req, res) => {
  try {
    const {id} = req.params;

    const product = await getProductById(id);
    if (!product) {
      return res.status(404).json({
        success : false,
        message : "존재하지 않는 물품입니다.",
        error : { code : "PRODUCT_NOT_FOUND" },
      });
    }

    return res.status(200).json({success : true, data : formatProduct(product)});
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success : false,
      message : "서버 오류가 발생했습니다.",
      error : {code : "INTERNAL_SERVER_ERROR"},
    });
  }
};

module.exports = getProduct;
