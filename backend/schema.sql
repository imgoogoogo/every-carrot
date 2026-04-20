CREATE DATABASE IF NOT EXISTS every_carrot DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE every_carrot;
SET NAMES utf8mb4;
SET sql_mode = '';

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nickname VARCHAR(30) NOT NULL UNIQUE,
  department VARCHAR(100),
  profile_image VARCHAR(500),
  is_verified TINYINT(1) DEFAULT 0,
  refresh_token TEXT,
  created_at DATETIME DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_verifications (
  email VARCHAR(255) PRIMARY KEY,
  code VARCHAR(6) NOT NULL,
  expires_at DATETIME NOT NULL,
  verified TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

INSERT IGNORE INTO categories (id, name) VALUES
  (1, '전자기기'), (2, '의류'), (3, '도서'), (4, '생활용품'), (5, '기타');

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  price INT NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT '판매중',
  category_id INT,
  seller_id INT NOT NULL,
  image_url VARCHAR(500),
  created_at DATETIME DEFAULT NOW(),
  updated_at DATETIME DEFAULT NOW(),
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chat_rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  buyer_id INT NOT NULL,
  seller_id INT NOT NULL,
  created_at DATETIME DEFAULT NOW(),
  UNIQUE KEY unique_chat (product_id, buyer_id, seller_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chat_room_id INT NOT NULL,
  sender_id INT NOT NULL,
  content TEXT NOT NULL,
  is_read TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT NOW(),
  FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);
