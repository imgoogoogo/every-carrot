const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const { saveCode, getCode, deleteCode, markVerified, isVerified, clearVerified } = require("../utils/verificationStore");

const ALLOWED_DOMAIN = process.env.ALLOWED_EMAIL_DOMAIN || "dongguk.ac.kr";

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendVerification(req, res) {
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({
      success: false,
      message: `학교 이메일(@${ALLOWED_DOMAIN})만 사용 가능합니다.`,
      error: { code: "INVALID_EMAIL_DOMAIN" },
    });
  }

  const emailDomain = email.split("@")[1];
  if (emailDomain !== ALLOWED_DOMAIN) {
    return res.status(400).json({
      success: false,
      message: `학교 이메일(@${ALLOWED_DOMAIN})만 사용 가능합니다.`,
      error: { code: "INVALID_EMAIL_DOMAIN" },
    });
  }

  const code = generateCode();
  saveCode(email, code);

  try {
    await transporter.sendMail({
      from: `"에브리캐럿" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "[에브리캐럿] 이메일 인증 코드",
      text: `인증 코드: ${code}\n\n이 코드는 10분간 유효합니다.`,
      html: `<p>인증 코드: <strong>${code}</strong></p><p>이 코드는 10분간 유효합니다.</p>`,
    });

    return res.status(200).json({
      success: true,
      message: "인증 코드가 발송되었습니다. 10분 이내에 인증해주세요.",
    });
  } catch (err) {
    console.error("이메일 발송 오류:", err);
    return res.status(500).json({
      success: false,
      message: "이메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.",
      error: { code: "EMAIL_SEND_FAILED" },
    });
  }
}

async function verifyEmail(req, res) {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({
      success: false,
      message: "인증 코드가 올바르지 않거나 만료되었습니다.",
      error: { code: "INVALID_OR_EXPIRED_CODE" },
    });
  }

  const savedCode = getCode(email);
  if (!savedCode || savedCode !== code) {
    return res.status(400).json({
      success: false,
      message: "인증 코드가 올바르지 않거나 만료되었습니다.",
      error: { code: "INVALID_OR_EXPIRED_CODE" },
    });
  }

  deleteCode(email);
  markVerified(email);

  return res.status(200).json({
    success: true,
    message: "이메일 인증이 완료되었습니다.",
  });
}

async function register(req, res) {
  const { email, password, nickname, department } = req.body;

  if (!email || !password || !nickname) {
    return res.status(400).json({
      success: false,
      message: "email, password, nickname은 필수 항목입니다.",
      error: { code: "MISSING_REQUIRED_FIELDS" },
    });
  }

  if (!isVerified(email)) {
    return res.status(400).json({
      success: false,
      message: "이메일 인증이 완료되지 않았습니다.",
      error: { code: "EMAIL_NOT_VERIFIED" },
    });
  }

  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message: "비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.",
      error: { code: "INVALID_PASSWORD_FORMAT" },
    });
  }

  if (nickname.length < 2 || nickname.length > 30) {
    return res.status(400).json({
      success: false,
      message: "닉네임은 2자 이상 30자 이하여야 합니다.",
      error: { code: "INVALID_NICKNAME_FORMAT" },
    });
  }

  try {
    if (await userModel.emailExists(email)) {
      return res.status(409).json({
        success: false,
        message: "이미 사용 중인 이메일입니다.",
        error: { code: "EMAIL_ALREADY_EXISTS" },
      });
    }

    if (await userModel.nicknameExists(nickname)) {
      return res.status(409).json({
        success: false,
        message: "이미 사용 중인 닉네임입니다.",
        error: { code: "NICKNAME_ALREADY_EXISTS" },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({ email, hashedPassword, nickname, department });
    clearVerified(email);

    return res.status(201).json({
      success: true,
      message: "회원가입이 완료되었습니다.",
      data: newUser,
    });
  } catch (err) {
    console.error("회원가입 오류:", err);
    return res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      error: { code: "SERVER_ERROR" },
    });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "email과 password는 필수 항목입니다.",
      error: { code: "MISSING_REQUIRED_FIELDS" },
    });
  }

  try {
    const user = await userModel.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
        error: { code: "INVALID_CREDENTIALS" },
      });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "1h" }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "로그인에 성공했습니다.",
      data: {
        access_token: accessToken,
        token_type: "Bearer",
        user: { id: user.id, email: user.email, nickname: user.nickname },
      },
    });
  } catch (err) {
    console.error("로그인 오류:", err);
    return res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      error: { code: "SERVER_ERROR" },
    });
  }
}

function logout(_req, res) {
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 0,
  });

  return res.status(200).json({
    success: true,
    message: "로그아웃되었습니다.",
  });
}

async function refresh(req, res) {
  const token = req.cookies?.refreshToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Refresh Token이 만료되었습니다. 다시 로그인해주세요.",
      error: { code: "REFRESH_TOKEN_EXPIRED" },
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Refresh Token이 만료되었습니다. 다시 로그인해주세요.",
        error: { code: "REFRESH_TOKEN_EXPIRED" },
      });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "1h" }
    );

    return res.status(200).json({
      success: true,
      data: { access_token: accessToken, token_type: "Bearer" },
    });
  } catch {
    return res.status(401).json({
      success: false,
      message: "Refresh Token이 만료되었습니다. 다시 로그인해주세요.",
      error: { code: "REFRESH_TOKEN_EXPIRED" },
    });
  }
}

module.exports = { sendVerification, verifyEmail, register, login, logout, refresh };