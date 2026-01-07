CREATE
EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users
(
    id            UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
    telegram_id   BIGINT UNIQUE,
    username      TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    first_name    TEXT        NOT NULL,
    last_name     TEXT,
    role          TEXT                     DEFAULT 'User',
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE chats
(
    id               UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
    telegram_chat_id BIGINT UNIQUE NOT NULL,
    title            TEXT,
    created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_sessions
(
    id            UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
    user_id       UUID                     NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    session_token TEXT UNIQUE              NOT NULL,
    expires_at    TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_chats
(
    user_id UUID REFERENCES users (id) ON DELETE CASCADE,
    chat_id UUID REFERENCES chats (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, chat_id)
);

-- Очистка старых данных (необязательно, но полезно для тестов)
TRUNCATE users, chats, user_chats, user_sessions CASCADE;

-- 1. Добавляем пользователей с разными ролями (Level 3 Requirement)
INSERT INTO users (id, username, password_hash, first_name, last_name, role)
VALUES (gen_random_uuid(), 'admin', '$2a$11$evS.S8V/.T4MvU7BvP1P/.fO6O5yP3K5f8f8f8f8f8f8f8f8', 'System',
        'Administrator', 'Admin'),
       (gen_random_uuid(), 'manager', '$2a$11$evS.S8V/.T4MvU7BvP1P/.fO6O5yP3K5f8f8f8f8f8f8f8f8', 'Alex', 'Manager',
        'User'),
       (gen_random_uuid(), 'user_test', '$2a$11$evS.S8V/.T4MvU7BvP1P/.fO6O5yP3K5f8f8f8f8f8f8f8f8', 'Ivan', 'Ivanov',
        'User'),
       (gen_random_uuid(), 'guest_account', '$2a$11$evS.S8V/.T4MvU7BvP1P/.fO6O5yP3K5f8f8f8f8f8f8f8f8', 'Guest',
        'Visitor', 'Guest');

INSERT INTO users (id, username, password_hash, first_name, last_name, role)
VALUES (gen_random_uuid(), 'admin', '$2a$11$q9v8p7o6n5m4l3k2j1i0h.GvP1P/.fO6O5yP3K5f8f8f8f8f8f8f8', 'System',
        'Administrator', 'Admin'),
       (gen_random_uuid(), 'user1', '$2a$11$q9v8p7o6n5m4l3k2j1i0h.GvP1P/.fO6O5yP3K5f8f8f8f8f8f8f8', 'Ivan', 'Ivanov',
        'User');

-- 2. Добавляем чаты
INSERT INTO chats (id, telegram_chat_id, title)
VALUES (gen_random_uuid(), 100001, 'Общий чат разработки'),
       (gen_random_uuid(), 100002, 'Маркетинг и PR'),
       (gen_random_uuid(), 100003, 'Техническая поддержка'),
       (gen_random_uuid(), 100004, 'Архив проектов');

-- 3. Создаем связи многие-ко-многим с доп. колонками (Level 1 Requirement)
-- Добавляем админа во все чаты
INSERT INTO user_chats (user_id, chat_id, role_in_chat, joined_at)
SELECT u.id, c.id, 'Owner', NOW() - (random() * interval '30 days')
FROM users u,
     chats c
WHERE u.username = 'admin';

-- Добавляем обычного пользователя в пару чатов
INSERT INTO user_chats (user_id, chat_id, role_in_chat, joined_at)
SELECT u.id, c.id, 'Member', NOW()
FROM users u,
     chats c
WHERE u.username = 'user_test' LIMIT 2;