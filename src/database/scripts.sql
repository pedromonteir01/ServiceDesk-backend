CREATE DATABASE bflow;

\c bflow;

CREATE TABLE users (
  email VARCHAR(255) PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  isAdmin BOOLEAN NOT NULL,
  isStudent BOOLEAN NOT NULL
);

CREATE TABLE requests (
  id SERIAL PRIMARY KEY,
  title VARCHAR(35),
  image TEXT,
  description TEXT,
  local VARCHAR(255),
  status_request VARCHAR(12),
  date_request DATE,
  date_conclusion DATE,
  email VARCHAR(255) REFERENCES users(email)
);

CREATE TABLE refreshToken (
  token VARCHAR(255) PRIMARY KEY,
  expires DATE NOT NULL,
  email VARCHAR(255) REFERENCES users(email)
);