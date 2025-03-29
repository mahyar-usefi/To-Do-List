package database

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	var err error
	DB, err = gorm.Open(sqlite.Open("/Users/mahyar/GolandProjects/todo.db"), &gorm.Config{})

	if err != nil {
		panic("failed to connect database")
	}
}
