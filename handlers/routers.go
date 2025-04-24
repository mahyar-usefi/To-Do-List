package handlers

import (
	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	router.GET("/", root)
	router.GET("/tasks", allTasks)
	router.GET("/task/:id", taskByID)
	router.GET("/delete-task/:id", deleteTask)
	router.POST("/update-task", updateTask)
	router.POST("/create-task", createTask)
	router.GET("/completed-tasks", completedTasks)
	router.GET("/uncompleted-tasks", uncompletedTasks)

	router.Run("localhost:8080")
}
