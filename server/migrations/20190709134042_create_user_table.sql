-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL UNIQUE,
  password varchar(255) NOT NULL,
  pin varchar(255),
  session varchar(255),
  session_expiration timestamp,
  notification_enabled boolean NOT NULL DEFAULT true,
  transaction_alert_enabled boolean NOT NULL DEFAULT true,
  withdrawal_limit_alert_enabled boolean NOT NULL DEFAULT true,
  minimum_balance_alert_enabled boolean NOT NULL DEFAULT true,
  credit_limit_alert_enabled boolean NOT NULL DEFAULT true,
  created_at timestamp NOT NULL DEFAULT NOW(),
  updated_at timestamp NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION upd_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_time_users
  BEFORE UPDATE
  ON users
  FOR EACH ROW
  EXECUTE PROCEDURE upd_timestamp();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS users;
DROP FUNCTION IF EXISTS upd_timestamp;
DROP TRIGGER IF EXISTS update_time_users ON users;
-- +goose StatementEnd
