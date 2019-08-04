-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
INSERT INTO categories
  (user_id, name, plaid_name)
VALUES
  -- (1, '', '');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DELETE FROM categories
WHERE plaid_name IN (

);
-- +goose StatementEnd
