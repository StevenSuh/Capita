-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
CREATE TABLE IF NOT EXISTS institution_links (
  id serial PRIMARY KEY,
  user_id integer REFERENCES users ON DELETE CASCADE NOT NULL,
  access_token varchar(255) NOT NULL,
  plaid_item_id varchar(255) NOT NULL UNIQUE,
  link_session_id varchar(255) NOT NULL UNIQUE,
  plaid_institution_id varchar(255) NOT NULL,
  institution_name varchar(255) NOT NULL,
  institution_url varchar(255),
  institution_logo varchar(255),
  created_at timestamp NOT NULL DEFAULT NOW(),
  updated_at timestamp NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_time_institution_links
  BEFORE UPDATE
  ON institution_links
  FOR EACH ROW
  EXECUTE PROCEDURE upd_timestamp();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS institution_links;
DROP TRIGGER IF EXISTS update_time_institution_links ON institution_links;
-- +goose StatementEnd
