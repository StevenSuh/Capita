-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
CREATE TABLE IF NOT EXISTS base_transaction_categories (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  created_at timestamp NOT NULL DEFAULT NOW()
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS base_transaction_categories;
-- +goose StatementEnd
