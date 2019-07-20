-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
CREATE TABLE IF NOT EXISTS transaction_categories (
  id serial PRIMARY KEY,
  user_id integer REFERENCES users ON DELETE CASCADE NOT NULL,
  base_transaction_category_ids integer[],
  name varchar(255) NOT NULL,
  created_at timestamp NOT NULL DEFAULT NOW(),
  updated_at timestamp NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS base_transaction_category_relations (
  id serial PRIMARY KEY,
  base_transaction_category_id integer REFERENCES base_transaction_categories ON DELETE CASCADE NOT NULL,
  transaction_category_id integer REFERENCES transaction_categories ON DELETE CASCADE NOT NULL,
  created_at timestamp NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_time_transaction_categories
  BEFORE UPDATE
  ON transaction_categories
  FOR EACH ROW
  EXECUTE PROCEDURE upd_timestamp();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS base_transaction_category_relations;
DROP TABLE IF EXISTS transaction_categories;
DROP TRIGGER IF EXISTS update_time_transaction_categories ON transaction_categories;
-- +goose StatementEnd
