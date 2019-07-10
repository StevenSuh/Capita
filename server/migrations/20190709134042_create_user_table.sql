-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  name varchar(255),
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  session varchar(255),
  session_expiration timestamp
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS users;
-- +goose StatementEnd
