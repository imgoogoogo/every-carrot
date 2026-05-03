const multer = require("multer");       // multer 라이브러리 불러오기
const path = require("path");           // Node.js 기본 모듈

// 업로드 파일 형식 제한
const fileFilter = (req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error("jpg/png 파일만 업로드 가능합니다."), false);
};

// 프로필 이미지 업로드용 multer 설정 객체 생성
const uploadProfile = multer ({
  storage : multer.diskStorage ({
    destination : (req, file, cb) => {
      cb(null, path.join(__dirname, "../uploads/profiles"));
    },
    filename : (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
  }),
  fileFilter,
  limits : {fileSize : 5 * 1024 * 1024},
});

// 상품 이미지 업로드용 multer 설정 객체 생성
const uploadProduct = multer ({
  storage : multer.diskStorage ({
    destination : (req, file, cb) => {
      cb(null, path.join(__dirname, "../uploads/products"));
    },
    filename : (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
  }),
  fileFilter,
  limits : {fileSize : 10 * 1024 * 1024, files : 5},
});

module.exports = {uploadProfile, uploadProduct};
