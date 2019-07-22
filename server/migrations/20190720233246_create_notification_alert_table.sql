-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
CREATE TABLE IF NOT EXISTS notification_alerts (
  id serial PRIMARY KEY,
  user_id integer REFERENCES users ON DELETE CASCADE NOT NULL,
  profile_id integer REFERENCES profiles ON DELETE CASCADE NOT NULL,
  content varchar(255) NOT NULL,
  type varchar(255) NOT NULL,
  created_at timestamp NOT NULL DEFAULT NOW()
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS notification_alerts;
-- +goose StatementEnd
