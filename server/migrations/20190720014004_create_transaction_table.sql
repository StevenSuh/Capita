-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
CREATE TABLE IF NOT EXISTS transactions (
  id serial PRIMARY KEY,
  user_id integer REFERENCES users ON DELETE CASCADE NOT NULL,
  account_id integer REFERENCES accounts ON DELETE CASCADE NOT NULL,
  plaid_transaction_id varchar(255) NOT NULL,
  transaction_type varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  category varchar(255) NOT NULL,
  amount decimal NOT NULL,
  iso_currency_code varchar(255),
  unofficial_currency_code varchar(255),
  date varchar(255) NOT NULL,
  note varchar(255),
  pending boolean NOT NULL,
  recurring boolean NOT NULL DEFAULT false,
  manually_created boolean NOT NULL DEFAULT false,
  hidden boolean NOT NULL DEFAULT false,
  created_at timestamp NOT NULL DEFAULT NOW(),
  updated_at timestamp NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_time_transactions
  BEFORE UPDATE
  ON transactions
  FOR EACH ROW
  EXECUTE PROCEDURE upd_timestamp();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS transactions;
DROP TRIGGER IF EXISTS update_time_transactions ON transactions;
-- +goose StatementEnd
