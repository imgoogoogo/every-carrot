const pool = require("../config/db");

// 다른 사용자 프로필 조회
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      "SELECT id, nickname, department, profile_image FROM users WHERE id = ?",
      [id]
    );
    if (!rows[0]) {
      return res.status(404).json ({
        success : false,
        message : "사용자를 찾을 수 없습니다.",
        error : {code : "USER_NOT_FOUND"},
      });
    }
    return res.status(200).json({success : true, data : rows[0]});
  } catch (err) {
    console.error(err);
    return res.status(500).json ({
      success : false,
      message : "서버 오류가 발생했습니다.",
      error : {code : "INTERNAL_SERVER_ERROR"},
    });
  }
};

module.exports = getUserProfile;
