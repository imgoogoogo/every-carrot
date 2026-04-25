// 인증 코드 인메모리 저장소
// { email: { code, expiresAt } }
const store = new Map();

// 인증 완료된 이메일 집합 (회원가입 시 확인용)
const verifiedEmails = new Set();

const EXPIRE_MS =
  (parseInt(process.env.VERIFICATION_CODE_EXPIRE_MINUTES) || 10) * 60 * 1000;

function saveCode(email, code) {
  store.set(email, {
    code,
    expiresAt: Date.now() + EXPIRE_MS,
  });
}

function getCode(email) {
  const entry = store.get(email);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(email);
    return null;
  }
  return entry.code;
}

function deleteCode(email) {
  store.delete(email);
}

function markVerified(email) {
  verifiedEmails.add(email);
}

function isVerified(email) {
  return verifiedEmails.has(email);
}

function clearVerified(email) {
  verifiedEmails.delete(email);
}

module.exports = { saveCode, getCode, deleteCode, markVerified, isVerified, clearVerified };