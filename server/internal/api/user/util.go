package user

import (
	"os"

	"golang.org/x/crypto/bcrypt"
)

func EncryptPassword(password *string) {
	passwordSalt, _ := os.LookupEnv("PASSWORD_SALT")
	*password += passwordSalt

	hash, err := bcrypt.GenerateFromPassword([]byte(*password), bcrypt.DefaultCost)
	if err != nil {
		panic("Encrypting password failed")
	}
	*password = string(hash)
}

func ConfirmPassword(hash string, password string) bool {
	passwordSalt, _ := os.LookupEnv("PASSWORD_SALT")
	password += passwordSalt

	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)); err != nil {
		return false
	}
	return true
}

func ValidatePassword(password string) bool {
	return true
}
