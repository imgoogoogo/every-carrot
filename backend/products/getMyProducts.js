const pool = require("../config/db");

// 내 상품 목록 조회
const getMyProducts = async (req, res) => {
  try {
    const {status, page = 1, limit = 20} = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    let where = ["p.seller_id = ?"];
    const params = [req.user.id];

    const validStatuses = ["판매중", "예약중", "판매완료"];
    if (status && validStatuses.includes(status)) {
      where.push("p.status = ?");
      params.push(status);
    }

    const whereClause = where.join(" AND ");

    const [countRows] = await pool.execute(
      `SELECT COUNT(*) as total FROM products p WHERE ${whereClause}`,
      params
    );
    const total = countRows[0].total;

    const [products] = await pool.query(
      `SELECT p.id, p.title, p.price, p.status, p.image_url, p.created_at,
              c.id as cat_id, c.name as cat_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE ${whereClause}
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    const formatted = products.map((p) => ({
      id : p.id,
      title : p.title,
      price : p.price,
      status : p.status,
      image_url : p.image_url,
      category : {id : p.cat_id, name : p.cat_name},
      created_at : p.created_at,
    }));

    return res.status(200).json({
      success : true,
      data : {
        products : formatted,
        pagination : {total, page : pageNum, limit : limitNum, total_pages : Math.ceil(total / limitNum)},
      },
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

module.exports = getMyProducts;
