-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
CREATE INDEX idx_session ON users (session);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP INDEX idx_session;
-- +goose StatementEnd
