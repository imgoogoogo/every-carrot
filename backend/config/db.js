const mysql = require ("mysql2/promise");      // mysql2의 promise 버전 불러오기
require ("dotenv").config ();                   // .env의 환경 변수 읽음

const pool = mysql.createPool ({
  host : process.env.DB_HOST,            // DB 서버 주소
  port : process.env.DB_PORT,            // DB 포트 번호
  user : process.env.DB_USER,            // DB 사용자명
  password : process.env.DB_PASSWORD,    // DB 비밀번호
  database : process.env.DB_NAME,        // DB 이름
  waitForConnections : true,             // 연결 후 대기
  connectionLimit : 10,                  // 동시 연결 수
  queueLimit : 0,                        // 대기열 제한 수(무제한)
});

module.exports = pool;                  // 다른 파일에서 DB 연결 풀을 사용 가능
