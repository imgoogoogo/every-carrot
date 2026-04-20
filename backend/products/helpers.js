const pool = require("../config/db");

const PRODUCT_SELECT_SQL = `
  SELECT p.*, c.id as cat_id, c.name as cat_name,
         u.id as u_id, u.nickname, u.department, u.profile_image
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.id
  LEFT JOIN users u ON p.seller_id = u.id
  WHERE p.id = ?
`;

const getProductById = async (id) => {
  const [rows] = await pool.execute(PRODUCT_SELECT_SQL, [id]);
  return rows[0] || null;
};

const formatProduct = (p) => ({
  id : p.id,
  title : p.title,
  description : p.description,
  price : p.price,
  status : p.status,
  category : { id : p.cat_id, name : p.cat_name },
  image_url : p.image_url,
  seller : {id : p.u_id, nickname : p.nickname, department : p.department, profile_image : p.profile_image},
  created_at : p.created_at,
  updated_at : p.updated_at,
});

module.exports = {getProductById, formatProduct};
