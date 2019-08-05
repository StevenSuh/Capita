package api

import (
	"database/sql"
	"time"

	"github.com/lib/pq"
)

type User struct {
	ID                          int64          `db:"id" json:"id"`
	Name                        string         `db:"name" json:"name"`
	Email                       string         `db:"email" json:"email"`
	Password                    string         `db:"password" json:"-"`
	Pin                         sql.NullString `db:"pin" json:"pin"`
	Session                     sql.NullString `db:"session" json:"-"`
	SessionExpiration           pq.NullTime    `db:"session_expiration" json:"-"`
	NotificationEnabled         bool           `db:"notification_enabled" json:"notificationEnabled"`
	TransactionAlertEnabled     bool           `db:"transaction_alert_enabled" json:"transactionAlertEnabled"`
	WithdrawalLimitAlertEnabled bool           `db:"withdrawal_limit_alert_enabled" json:"withdrawalLimitAlertEnabled"`
	MinimumBalanceAlertEnabled  bool           `db:"minimum_balance_alert_enabled" json:"minimumBalanceAlertEnabled"`
	CreditLimitAlertEnabled     bool           `db:"credit_limit_alert_enabled" json:"creditLimitAlertEnabled"`
	CreatedAt                   time.Time      `db:"created_at" json:"createdAt"`
	UpdatedAt                   time.Time      `db:"updated_at" json:"updatedAt"`
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
	PlaidInstitutionID string         `db:"plaid_institution_id" json:"plaidInstitutionId"`
	InstitutionName    string         `db:"institution_name" json:"institutionName"`
	InstitutionURL     sql.NullString `db:"institution_url" json:"institutionUrl"`
	InstitutionLogo    sql.NullString `db:"institution_logo" json:"institutionLogo"`
	CreatedAt          time.Time      `db:"created_at" json:"createdAt"`
	UpdatedAt          time.Time      `db:"updated_at" json:"updatedAt"`
}

type Account struct {
	ID                            int64           `db:"id" json:"id"`
	UserID                        int64           `db:"user_id" json:"userId"`
	ProfileID                     sql.NullInt64   `db:"profile_id" json:"profileId"`
	InstitutionLinkID             int64           `db:"institution_link_id" json:"institutionLinkId"`
	PlaidAccountID                string          `db:"plaid_account_id" json:"plaidAccountId"`
	Ready                         bool            `db:"ready" json:"ready"`
	Mask                          string          `db:"mask" json:"mask"`
	Name                          string          `db:"name" json:"name"`
	OfficialName                  sql.NullString  `db:"official_name" json:"officalName"`
	Subtype                       string          `db:"subtype" json:"subtype"`
	Type                          string          `db:"type" json:"type"`
	VerificationStatus            sql.NullString  `db:"verification_status" json:"verificationStatus"`
	BalanceAvailable              sql.NullFloat64 `db:"balance_available" json:"balanceAvailable"`
	BalanceCurrent                float64         `db:"balance_current" json:"balanceCurrent"`
	BalanceLimit                  sql.NullFloat64 `db:"balance_limit" json:"balanceLimit"`
	BalanceIsoCurrencyCode        sql.NullString  `db:"balance_iso_currency_code" json:"balanceIsoCurrencyCode"`
	BalanceUnofficialCurrencyCode sql.NullString  `db:"balance_unofficial_currency_code" json:"balanceUnofficialCurrencyCode"`
	APY                           sql.NullFloat64 `db:"apy" json:"apy"`
	WithdrawalLimit               sql.NullInt64   `db:"withdrawal_limit" json:"withdrawalLimit"`
	MinimumBalance                sql.NullFloat64 `db:"minimum_balance" json:"minimumBalance"`
	NotificationEnabled           bool            `db:"notification_enabled" json:"notificationEnabled"`
	TransactionAlertEnabled       bool            `db:"transaction_alert_enabled" json:"transactionAlertEnabled"`
	WithdrawalLimitAlertEnabled   bool            `db:"withdrawal_limit_alert_enabled" json:"withdrawalLimitAlertEnabled"`
	MinimumBalanceAlertEnabled    bool            `db:"minimum_balance_alert_enabled" json:"minimumBalanceAlertEnabled"`
	CreditLimitAlertEnabled       bool            `db:"credit_limit_alert_enabled" json:"creditLimitAlertEnabled"`
	InstitutionName               string          `db:"institution_name" json:"institutionName"`
	InstitutionLogo               sql.NullString  `db:"institution_logo" json:"institutionLogo"`
	ManuallyCreated               bool            `db:"manually_created" json:"manuallyCreated"`
	Hidden                        bool            `db:"hidden" json:"hidden"`
	CreatedAt                     time.Time       `db:"created_at" json:"createdAt"`
	UpdatedAt                     time.Time       `db:"updated_at" json:"updatedAt"`
}

type Category struct {
	ID        int64     `db:"id" json:"id"`
	UserID    int64     `db:"user_id" json:"userId"`
	Name      string    `db:"name" json:"name"`
	PlaidName string    `db:"plaid_name" json:"plaidName"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
	UpdatedAt time.Time `db:"updated_at" json:"updatedAt"`
}

type Transaction struct {
	ID                     int64          `db:"id" json:"id"`
	UserID                 int64          `db:"user_id" json:"userId"`
	AccountID              int64          `db:"account_id" json:"accountId"`
	CategoryID             int64          `db:"category_id" json:"categoryId"`
	PlaidTransactionID     string         `db:"plaid_transaction_id" json:"plaidTransactionId"`
	TransactionType        string         `db:"transaction_type" json:"transactionType"`
	Name                   string         `db:"name" json:"name"`
	Amount                 float64        `db:"amount" json:"amount"`
	IsoCurrencyCode        sql.NullString `db:"iso_currency_code" json:"IsoCurrencyCode"`
	UnofficialCurrencyCode sql.NullString `db:"unofficial_currency_code" json:"unofficialCurrencyCode"`
	Date                   string         `db:"date" json:"date"`
	Note                   sql.NullString `db:"note" json:"note"`
	Pending                bool           `db:"pending" json:"pending"`
	Recurring              bool           `db:"recurring" json:"recurring"`
	ManuallyCreated        bool           `db:"manually_created" json:"manuallyCreated"`
	Hidden                 bool           `db:"hidden" json:"hidden"`
	CreatedAt              time.Time      `db:"created_at" json:"createdAt"`
	UpdatedAt              time.Time      `db:"updated_at" json:"updatedAt"`
}

type NotificationAlert struct {
	ID        int64     `db:"id" json:"id"`
	UserID    int64     `db:"user_id" json:"userId"`
	ProfileID int64     `db:"profile_id" json:"profileId"`
	Content   string    `db:"content" json:"content"`
	Type      string    `db:"string" json:"string"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
}

type TransferLog struct {
	ID            int64     `db:"id" json:"id"`
	FromAccountID int64     `db:"from_account_id" json:"fromAccountId"`
	ToAccountID   int64     `db:"to_account_id" json:"toAccountId"`
	Amount        float64   `db:"amount" json:"amount"`
	CreatedAt     time.Time `db:"created_at" json:"createdAt"`
}

type Tag struct {
	ID        int64     `db:"id" json:"id"`
	UserID    int64     `db:"user_id" json:"userId"`
	ProfileID int64     `db:"profile_id" json:"profileId"`
	Name      string    `db:"name" json:"name"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
}

type TransactionTagRelation struct {
	ID            int64     `db:"id" json:"id"`
	TransactionID int64     `db:"transaction_id" json:"transactionId"`
	TagID         int64     `db:"tag_id" json:"tagId"`
	CreatedAt     time.Time `db:"created_at" json:"createdAt"`
}
