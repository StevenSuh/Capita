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
	// Notification                     // TODO
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
	UpdatedAt time.Time `db:"updated_at" json:"updatedAt"`
}

type Profile struct {
	ID        int64     `db:"id" json:"id"`
	UserID    int64     `db:"user_id" json:"userId"`
	Name      string    `db:"name" json:"name"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
	UpdatedAt time.Time `db:"updated_at" json:"updatedAt"`
}

type InstitutionLink struct {
	ID                 int64          `db:"id" json:"id"`
	UserID             int64          `db:"user_id" json:"userId"`
	AccessToken        string         `db:"access_token" json:"accessToken"`
	PlaidItemID        string         `db:"plaid_item_id" json:"plaidItemId"`
	LinkSessionID      string         `db:"link_session_id" json:"linkSessionId"`
	PlaidInstitutionID string         `db:"institution_id" json:"institutionId"`
	InstitutionName    string         `db:"institution_name" json:"institutionName"`
	InstitutionURL     sql.NullString `db:"institution_url" json:"institutionUrl"`
	InstitutionLogo    sql.NullString `db:"institution_logo" json:"institutionLogo"`
	CreatedAt          time.Time      `db:"created_at" json:"createdAt"`
	UpdatedAt          time.Time      `db:"updated_at" json:"updatedAt"`
}

type Account struct {
	ID                            int64           `db:"id" json:"id"`
	UserID                        int64           `db:"user_id" json:"userId"`
	InstitutionLinkID             int64           `db:"institution_link_id" json:"institutionLinkId"`
	PlaidAccountID                string          `db:"plaid_account_id" json:"plaidAccountId"`
	Mask                          string          `db:"mask" json:"mask"`
	Name                          string          `db:"name" json:"name"`
	OfficialName                  sql.NullString  `db:"official_name" json:"officalName"`
	Subtype                       string          `db:"subtype" json:"subtype"`
	Type                          string          `db:"type" json:"type"`
	VerificationStatus            sql.NullString  `db:"verification_status" json:"verificationStatus"`
	BalanceAvailable              sql.NullFloat64 `db:"balance_available" json:"balanceAvailable"`
	BalanceCurrent                sql.NullFloat64 `db:"balance_current" json:"balanceCurrent"`
	BalanceLimit                  sql.NullFloat64 `db:"balance_limit" json:"balanceLimit"`
	BalanceISOCurrencyCode        sql.NullString  `db:"balance_iso_currency_code" json:"balanceISOCurrencyCode"`
	BalanceUnofficialCurrencyCode sql.NullString  `db:"balance_unofficial_currency_code" json:"balanceUnofficialCurrencyCode"`
	// Notification                                  // TODO
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
	UpdatedAt time.Time `db:"updated_at" json:"updatedAt"`
}

type ProfileAccountRelation struct {
	ID        int64     `db:"id" json:"id"`
	ProfileID int64     `db:"profile_id" json:"profileId"`
	AccountID int64     `db:"account_id" json:"accountId"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
}

type BaseTransactionCategory struct {
	ID        int64     `db:"id" json:"id"`
	Name      string    `db:"name" json:"name"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
}

type TransactionCategory struct {
	ID        int64     `db:"id" json:"id"`
	UserID    int64     `db:"user_id" json:"userId"`
	Name      string    `db:"name" json:"name"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
	UpdatedAt time.Time `db:"updated_at" json:"updatedAt"`
}

type BaseTransactionCategoryRelation struct {
	ID                        int64     `db:"id" json:"id"`
	BaseTransactionCategoryID int64     `db:"base_transaction_category_id" json:"baseTransactionCategoryId"`
	TransactionCategoryID     int64     `db:"transaction_category_id" json:"transactionCategoryId"`
	CreatedAt                 time.Time `db:"created_at" json:"createdAt"`
}

type Transaction struct {
	ID                     int64          `db:"id" json:"id"`
	UserID                 int64          `db:"user_id" json:"userId"`
	AccountID              int64          `db:"account_id" json:"accountId"`
	PlaidTransactionID     string         `db:"plaid_transaction_id" json:"plaidTransactionId"`
	TransactionType        string         `db:"transaction_type" json:"transactionType"`
	Name                   string         `db:"name" json:"name"`
	Amount                 float64        `db:"amount" json:"amount"`
	ISOCurrencyCode        sql.NullString `db:"iso_currency_code" json:"ISOCurrencyCode"`
	UnofficialCurrencyCode sql.NullString `db:"unofficial_currency_code" json:"unofficialCurrencyCode"`
	Date                   string         `db:"date" json:"date"`
	Pending                bool           `db:"pending" json:"pending"`
	Recurring              bool           `db:"recurring" json:"recurring"`
	CreatedAt              time.Time      `db:"created_at" json:"createdAt"`
	UpdatedAt              time.Time      `db:"updated_at" json:"updatedAt"`
}

type TransactionCategoryRelation struct {
	ID                    int64     `db:"id" json:"id"`
	TransactionID         int64     `db:"transaction_id" json:"transactionId"`
	TransactionCategoryID int64     `db:"transaction_category_id" json:"transaction_category_id"`
	CreatedAt             time.Time `db:"created_at" json:"createdAt"`
}

type TransferLog struct {
	ID int64 `db:"id" json:"id"`
}

const (
	Session                   = "session"
	SessionExpirationDuration = 30
)
