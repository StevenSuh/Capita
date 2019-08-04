-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
CREATE TABLE IF NOT EXISTS tags (
  id serial PRIMARY KEY,
  user_id integer REFERENCES users ON DELETE CASCADE NOT NULL,
  profile_id integer REFERENCES profiles ON DELETE CASCADE NOT NULL,
  name varchar(255) NOT NULL,
  created_at timestamp NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transaction_tag_relations (
  id serial PRIMARY KEY,
  transaction_id integer REFERENCES transactions ON DELETE CASCADE NOT NULL,
  tag_id integer REFERENCES tags ON DELETE CASCADE NOT NULL,
  created_at timestamp NOT NULL DEFAULT NOW()
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS transaction_tag_relations;
DROP TABLE IF EXISTS tags;
-- +goose StatementEnd
