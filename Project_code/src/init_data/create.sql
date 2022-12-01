CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    email VARCHAR(200) NOT NULL,
    password VARCHAR(60) NOT NULL,
    wins INTEGER NOT NULL,
    losses INTEGER NOT NULL,
    points INTEGER,
    rank INTEGER,
    icon VARCHAR(50)
);