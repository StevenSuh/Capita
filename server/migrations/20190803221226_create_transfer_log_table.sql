-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
CREATE TABLE IF NOT EXISTS transfer_logs (
  id serial PRIMARY KEY,
  from_account_id integer REFERENCES accounts ON DELETE CASCADE NOT NULL,
  to_account_id integer REFERENCES accounts ON DELETE CASCADE NOT NULL,
  amount decimal NOT NULL,
  created_at timestamp NOT NULL DEFAULT NOW()
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS transfer_logs;
-- +goose StatementEnd
