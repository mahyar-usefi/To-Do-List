package main

import (
	"github.com/gin-gonic/gin"

	"ToDo/database"
	"ToDo/handlers"
)

func main() {
	database.ConnectDB()

	router := gin.Default()
	handlers.SetupRoutes(router)
	router.Run("localhost:8080")
}
