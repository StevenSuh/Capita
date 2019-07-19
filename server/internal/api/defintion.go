package api

import (
	"database/sql"
	"time"

	"github.com/lib/pq"
)

type User struct {
	ID                int64          `db:"id" json:"id"`
	Name              string         `db:"name" json:"name"`
	Email             string         `db:"email" json:"email"`
	Password          string         `db:"password" json:"-"`
	Session           sql.NullString `db:"session" json:"-"`
	SessionExpiration pq.NullTime    `db:"session_expiration" json:"-"`
	CreatedAt         time.Time      `db:"created_at" json:"createdAt"`
	UpdatedAt         time.Time      `db:"updated_at" json:"updatedAt"`
}

type PlaidInstitutionLink struct {
	ID              int64          `db:"id" json:"id"`
	UserID          int64          `db:"user_id" json:"userId"`
	AccessToken     string         `db:"access_token" json:"accessToken"`
	LinkItemID      string         `db:"link_item_id" json:"linkItemId"`
	LinkSessionID   string         `db:"link_session_id" json:"linkSessionId"`
	InstitutionID   string         `db:"institution_id" json:"institutionId"`
	InstitutionName string         `db:"institution_name" json:"institutionName"`
	InstitutionURL  sql.NullString `db:"institution_url" json:"institutionUrl"`
	InstitutionLogo sql.NullString `db:"institution_logo" json:"institutionLogo"`
	CreatedAt       time.Time      `db:"created_at" json:"createdAt"`
	UpdatedAt       time.Time      `db:"updated_at" json:"updatedAt"`
}

type Account struct {
	ID                            int64          `db:"id" json:"id"`
	UserID                        int64          `db:"user_id" json:"userId"`
	PlaidInstitutionLinkID        int64          `db:"plaid_institution_link_id" json:"plaidInstitutionLinkId"`
	LinkItemID                    string         `db:"link_item_id" json:"linkItemId"`
	PlaidAccountID                string         `db:"plaid_account_id" json:"plaidAccountId"`
	Mask                          string         `db:"mask" json:"mask"`
	Name                          string         `db:"name" json:"name"`
	OfficialName                  sql.NullString `db:"official_name" json:"officalName"`
	Subtype                       string         `db:"subtype" json:"subtype"`
	Type                          string         `db:"type" json:"type"`
	VerificationStatus            sql.NullString `db:"verification_status" json:"verificationStatus"`
	BalanceAvailable              sql.NullInt64  `db:"balance_available" json:"balanceAvailable"`
	BalanceCurrent                sql.NullInt64  `db:"balance_current" json:"balanceCurrent"`
	BalanceLimit                  sql.NullInt64  `db:"balance_limit" json:"balanceLimit"`
	BalanceISOCurrencyCode        sql.NullString `db:"balance_iso_currency_code" json:"balanceISOCurrencyCode"`
	BalanceUnofficialCurrencyCode sql.NullString `db:"balance_unofficial_currency_code" json:"balanceUnofficialCurrencyCode"`
	InstitutionID                 string         `db:"institution_id" json:"institutionId"`
	InstitutionName               string         `db:"institution_name" json:"institutionName"`
	InstitutionURL                sql.NullString `db:"institution_url" json:"institutionUrl"`
	InstitutionLogo               sql.NullString `db:"institution_logo" json:"institutionLogo"`
	CreatedAt                     time.Time      `db:"created_at" json:"createdAt"`
	UpdatedAt                     time.Time      `db:"updated_at" json:"updatedAt"`
}

const (
	Session                   = "session"
	SessionExpirationDuration = 30
)
