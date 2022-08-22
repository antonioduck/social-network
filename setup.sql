

DROP TABLE users IF EXISTS;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first VARCHAR NOT NULL CHECK (first != ''),
    last VARCHAR NOT NULL CHECK (last != ''),
    email VARCHAR UNIQUE NOT NULL CHECK (email != ''),
    password VARCHAR NOT NULL,
    url VARCHAR,
    bio VARCHAR,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reset_codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL,
    code VARCHAR NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );


  DROP TABLE IF EXISTS friendships;

CREATE TABLE friendships(
    id SERIAL PRIMARY KEY,
    sender_id VARCHAR NOT NULL,
    recipient_id VARCHAR NOT NULL,
    accepted BOOLEAN DEFAULT false
);

CREATE TABLE chat_messages(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users (id),
    message VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO chat_messages (message,user_id)
    VALUES ('hello', 1),('how are you' ,2),('I am fine',3);