-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
CREATE TABLE IF NOT EXISTS accounts (
  id serial PRIMARY KEY,
  user_id integer REFERENCES users ON DELETE CASCADE NOT NULL,
  institution_link_id integer REFERENCES institution_links ON DELETE CASCADE NOT NULL,
  plaid_account_id varchar(255) NOT NULL,
  active boolean NOT NULL DEFAULT true,
  mask varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  official_name varchar(255),
  subtype varchar(255) NOT NULL,
  type varchar(255) NOT NULL,
  verification_status varchar(255),
  balance_available decimal,
  balance_current decimal,
  balance_limit decimal,
  balance_iso_currency_code varchar(255),
  balance_unofficial_currency_code varchar(255),
  apy decimal,
  withdrawal_limit integer,
  minimum_balance decimal,
  notification_enabled boolean NOT NULL DEFAULT true,
  transaction_alert_enabled boolean NOT NULL DEFAULT true,
  withdrawal_limit_alert_enabled boolean NOT NULL DEFAULT true,
  minimum_balance_alert_enabled boolean NOT NULL DEFAULT true,
  credit_limit_alert_enabled boolean NOT NULL DEFAULT true,
  created_at timestamp NOT NULL DEFAULT NOW(),
  updated_at timestamp NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profile_account_relations (
  id serial PRIMARY KEY,
  profile_id integer REFERENCES profiles ON DELETE CASCADE NOT NULL,
  account_id integer REFERENCES accounts ON DELETE CASCADE NOT NULL,
  created_at timestamp NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_time_accounts
  BEFORE UPDATE
  ON accounts
  FOR EACH ROW
  EXECUTE PROCEDURE upd_timestamp();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS profile_account_relations;
DROP TABLE IF EXISTS accounts;
DROP TRIGGER IF EXISTS update_time_accounts ON accounts;
-- +goose StatementEnd
