const pool = require("../config/db");

// 내 프로필 수정
const updateMyProfile = async (req, res) => {
  try {
    const {nickname, department} = req.body;
    const profileImageFile = req.file;

    if (nickname !== undefined && (nickname.length < 2 || nickname.length > 30)) {
      return res.status(400).json({
        success : false,
        message : "닉네임은 2자 이상 30자 이하로 입력해주세요.",
        error : {code : "INVALID_INPUT"},
      });
    }

    const updates = [];
    const values = [];

    if (nickname !== undefined) {
      const [nickRows] = await pool.execute(
        "SELECT id FROM users WHERE nickname = ? AND id != ?",
        [nickname, req.user.id]
      );
      if (nickRows[0]) {
        return res.status(409).json ({
          success : false,
          message : "이미 사용 중인 닉네임입니다.",
          error : {code : "NICKNAME_ALREADY_EXISTS"},
        });
      }
      updates.push("nickname = ?");
      values.push(nickname);
    }

    if (department !== undefined) {
      updates.push("department = ?");
      values.push(department);
    }

    if (profileImageFile) {
      updates.push("profile_image = ?");
      values.push(`/uploads/profiles/${profileImageFile.filename}`);
    }

    if (updates.length === 0) {
      return res.status(400).json ({
        success : false,
        message : "수정할 내용이 없습니다.",
        error : {code : "NO_CHANGES"},
      });
    }

    values.push(req.user.id);
    await pool.execute(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, values);

    const [rows] = await pool.execute(
      "SELECT id, nickname, department, profile_image FROM users WHERE id = ?",
      [req.user.id]
    );

    return res.status(200).json ({
      success : true,
      message : "프로필이 수정되었습니다.",
      data : rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success : false,
      message : "서버 오류가 발생했습니다.",
      error : {code : "INTERNAL_SERVER_ERROR"},
    });
  }
};

module.exports = updateMyProfile;
