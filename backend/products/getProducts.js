const pool = require("../config/db");

// 상품 목록 조회
const getProducts = async (req, res) => {
  try {
    const {keyword, category_id, min_price, max_price, status, page = 1, limit = 20, sort = "latest"} = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    let where = ["1 = 1"];
    const params = [];

    if (keyword) {
      where.push("(p.title LIKE ? OR p.description LIKE ?)");
      params.push(`%${keyword}%`, `%${keyword}%`);
    }
    if (category_id && !isNaN(Number(category_id))) {
      where.push("p.category_id = ?");
      params.push(Number(category_id));
    }
    if (min_price && !isNaN(Number(min_price))) {
      where.push("p.price >= ?");
      params.push(Number(min_price));
    }
    if (max_price && !isNaN(Number(max_price))) {
      where.push("p.price <= ?");
      params.push(Number(max_price));
    }
    const validStatuses = ["판매중", "예약중", "판매완료"];
    if (status && validStatuses.includes(status)) {
      where.push("p.status = ?");
      params.push(status);
    }

    const orderMap = {latest : "p.created_at DESC", price_asc : "p.price ASC", price_desc : "p.price DESC"};
    const orderBy = orderMap[sort] || "p.created_at DESC";
    const whereClause = where.join(" AND ");

    const [countRows] = await pool.execute (
      `SELECT COUNT(*) as total FROM products p WHERE ${whereClause}`,
      params
    );
    const total = countRows[0].total;

    const [products] = await pool.query(
      `SELECT p.id, p.title, p.price, p.status, p.image_url, p.created_at,
              c.id as cat_id, c.name as cat_name,
              u.id as seller_id, u.nickname as seller_nickname
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN users u ON p.seller_id = u.id
       WHERE ${whereClause}
       ORDER BY ${orderBy}
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    const formatted = products.map((p) => ({
      id : p.id,
      title : p.title,
      price : p.price,
      status : p.status,
      image_url : p.image_url,
      category : { id : p.cat_id, name : p.cat_name },
      seller : { id : p.seller_id, nickname : p.seller_nickname },
      created_at : p.created_at,
    }));

    return res.status(200).json({
      success : true,
      data : {
        products : formatted,
        pagination : { total, page : pageNum, limit : limitNum, total_pages : Math.ceil(total / limitNum) },
      },
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

module.exports = getProducts;
