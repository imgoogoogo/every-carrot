const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "인증이 필요합니다.",
      error: { code: "UNAUTHORIZED" },
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "토큰이 만료되었거나 유효하지 않습니다.",
      error: { code: "INVALID_TOKEN" },
    });
  }
}

module.exports = { authenticate };