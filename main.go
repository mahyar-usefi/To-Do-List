package main

import (
	"ToDo/database"
	"ToDo/handlers"
	"github.com/gin-gonic/gin"
)

func main() {
	database.ConnectDB()

	router := gin.Default()

	router.Static("/static", "./static")
	router.LoadHTMLFiles("templates/index.html")

	handlers.SetupRoutes(router)
	router.Run("localhost:8080")
}
