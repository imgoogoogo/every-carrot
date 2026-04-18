const pool = require("../config/db");

async function findByEmail(email) {
  const [rows] = await pool.query(
    "SELECT id, email, password, nickname, department FROM users WHERE email = ?",
    [email]
  );
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(
    "SELECT id, email FROM users WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

async function emailExists(email) {
  const [rows] = await pool.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );
  return rows.length > 0;
}

async function nicknameExists(nickname) {
  const [rows] = await pool.query(
    "SELECT id FROM users WHERE nickname = ?",
    [nickname]
  );
  return rows.length > 0;
}

async function create({ email, hashedPassword, nickname, department }) {
  const [result] = await pool.query(
    "INSERT INTO users (email, password, nickname, department, is_verified) VALUES (?, ?, ?, ?, TRUE)",
    [email, hashedPassword, nickname, department || null]
  );
  const [rows] = await pool.query(
    "SELECT id, email, nickname, department, created_at FROM users WHERE id = ?",
    [result.insertId]
  );
  return rows[0];
}

module.exports = { findByEmail, findById, emailExists, nicknameExists, create };