const pool = require("../config/db");

// 내 프로필 조회
const getMyProfile = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, email, nickname, department, profile_image, is_verified, created_at FROM users WHERE id = ?",
      [req.user.id]
    );
    const user = rows[0];
    if (!user) {
      return res.status(404).json ({
        success : false,
        message : "사용자를 찾을 수 없습니다.",
        error : {code : "USER_NOT_FOUND"},
      });
    }
    return res.status(200).json({success : true, data : user});
  } catch (err) {
    console.error(err);
    return res.status(500).json ({
      success : false,
      message : "서버 오류가 발생했습니다.",
      error : {code : "INTERNAL_SERVER_ERROR"},
    });
  }
};

module.exports = getMyProfile;
