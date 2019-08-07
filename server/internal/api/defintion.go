package api

const (
	Session                   = "session"
	SessionExpirationDuration = 30
	DefaultLimit              = 50
	DefaultOffset             = 0
)

type key string

const (
	UserCtx key = "user"
)

const (
	DateFormatISO = "2018-04-07"
)
