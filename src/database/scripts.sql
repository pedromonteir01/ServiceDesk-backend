CREATE DATABASE bflow;

\c bflow;

CREATE TABLE users (
  email VARCHAR(255) PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  isAdmin BOOLEAN NOT NULL,
  isStudent BOOLEAN NOT NULL,
  passwordResetToken VARCHAR(255),
  passwordResetExpires TIMESTAMP
);

CREATE TABLE requests (
  id SERIAL PRIMARY KEY,
  title VARCHAR(35),
  image VARCHAR(255),
  description TEXT,
  local VARCHAR(255),
  status_request BOOLEAN,
  date_request DATE,
  date_conclusion DATE,
  email VARCHAR(255) REFERENCES users(email)
);