-- =============================================================
--  Campus Marketplace — 스키마 (DDL)
--  MySQL 8.0 / MariaDB 10.3+
--  Workbench에서 바로 실행 가능
-- =============================================================

CREATE DATABASE IF NOT EXISTS campus_marketplace
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE campus_marketplace;


-- -------------------------------------------------------------
--  1. users
-- -------------------------------------------------------------
CREATE TABLE users (
    id            INT          NOT NULL AUTO_INCREMENT,
    email         VARCHAR(100) NOT NULL,
    password      VARCHAR(255) NOT NULL,
    nickname      VARCHAR(30)  NOT NULL,
    department    VARCHAR(50)  NULL,
    profile_image VARCHAR(255) NULL,
    is_verified   BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at    DATETIME     NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email    (email),
    UNIQUE KEY uq_users_nickname (nickname)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -------------------------------------------------------------
--  2. categories
-- -------------------------------------------------------------
CREATE TABLE categories (
    id   INT         NOT NULL AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -------------------------------------------------------------
--  3. products  (users, categories 다음에 생성)
-- -------------------------------------------------------------
CREATE TABLE products (
    id          INT          NOT NULL AUTO_INCREMENT,
    seller_id   INT          NOT NULL,
    title       VARCHAR(100) NOT NULL,
    description TEXT         NOT NULL,
    price       INT          NOT NULL,
    category_id INT          NOT NULL,
    status      ENUM('판매중','예약중','판매완료') NOT NULL DEFAULT '판매중',
    image_url   VARCHAR(255) NULL,
    created_at  DATETIME     NOT NULL DEFAULT NOW(),
    updated_at  DATETIME     NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    PRIMARY KEY (id),
    CONSTRAINT fk_products_seller   FOREIGN KEY (seller_id)   REFERENCES users(id)      ON DELETE CASCADE,
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -------------------------------------------------------------
--  4. chat_rooms  (users, products 다음에 생성)
-- -------------------------------------------------------------
CREATE TABLE chat_rooms (
    id         INT      NOT NULL AUTO_INCREMENT,
    product_id INT      NOT NULL,
    buyer_id   INT      NOT NULL,
    seller_id  INT      NOT NULL,
    created_at DATETIME NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    UNIQUE KEY uq_chat_rooms (product_id, buyer_id, seller_id),
    CONSTRAINT fk_chatrooms_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_chatrooms_buyer   FOREIGN KEY (buyer_id)   REFERENCES users(id)    ON DELETE CASCADE,
    CONSTRAINT fk_chatrooms_seller  FOREIGN KEY (seller_id)  REFERENCES users(id)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -------------------------------------------------------------
--  5. messages  (chat_rooms, users 다음에 생성)
-- -------------------------------------------------------------
CREATE TABLE messages (
    id           INT      NOT NULL AUTO_INCREMENT,
    chat_room_id INT      NOT NULL,
    sender_id    INT      NOT NULL,
    content      TEXT     NOT NULL,
    is_read      BOOLEAN  NOT NULL DEFAULT FALSE,
    created_at   DATETIME NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    CONSTRAINT fk_messages_chatroom FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_sender   FOREIGN KEY (sender_id)    REFERENCES users(id)      ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -------------------------------------------------------------
--  6. email_verifications
-- -------------------------------------------------------------
CREATE TABLE email_verifications (
    id         INT          NOT NULL AUTO_INCREMENT,
    email      VARCHAR(100) NOT NULL,
    code       VARCHAR(6)   NOT NULL,
    expires_at DATETIME     NOT NULL,
    created_at DATETIME     NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    KEY idx_email_verifications_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -------------------------------------------------------------
--  7. 인덱스
-- -------------------------------------------------------------
CREATE INDEX idx_products_status     ON products (status);
CREATE INDEX idx_products_category   ON products (category_id);
CREATE INDEX idx_products_seller     ON products (seller_id);
CREATE INDEX idx_products_price      ON products (price);
CREATE INDEX idx_products_created_at ON products (created_at DESC);

CREATE INDEX idx_messages_chatroom_created ON messages (chat_room_id, created_at);
CREATE INDEX idx_messages_is_read          ON messages (chat_room_id, is_read);

CREATE INDEX idx_chatrooms_buyer  ON chat_rooms (buyer_id);
CREATE INDEX idx_chatrooms_seller ON chat_rooms (seller_id);


-- -------------------------------------------------------------
--  8. 카테고리 기초 데이터
-- -------------------------------------------------------------
INSERT INTO categories (name) VALUES
    ('전자기기'),
    ('의류/잡화'),
    ('도서/교재'),
    ('스포츠/레저'),
    ('가구/인테리어'),
    ('식품/음료'),
    ('뷰티/미용'),
    ('기타');
