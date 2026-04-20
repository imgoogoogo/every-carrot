const jwt = require("jsonwebtoken");        // jsonwebtoken 라이브러리 불러오기

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;       // 요청 헤더의 authorization 값 꺼내기
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success : false,
      message : "인증 토큰이 없습니다.",
      error : {code : "TOKEN_MISSING"},
    });
  }

  const token = authHeader.split(" ")[1];       // Bearer 토큰값에서 실제 토큰값만 저장
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);     // 토큰 검증, req.user에 저장
    next();
  } catch (err) {
    const code = err.name === "TokenExpiredError" ? "TOKEN_EXPIRED" : "TOKEN_INVALID";
    return res.status(401).json ({
      success : false,
      message : "유효하지 않은 토큰입니다.",
      error : {code},
    });
  }
};

module.exports = authenticate;
