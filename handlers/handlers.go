package handlers

import (
	"ToDo/models"
	"github.com/gin-gonic/gin"
	"net/http"

	"ToDo/database"
)

func root(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", nil)
}

func allTasks(c *gin.Context) {
	tasks := database.GetAllTasks()
	c.JSON(http.StatusOK, tasks)
}

func taskByID(c *gin.Context) {
	id := c.Param("id")
	task := database.GetTask(id)
	if task.ID != 0 {
		c.JSON(http.StatusOK, task)
	} else {
		c.JSON(http.StatusNotFound, gin.H{})
	}
}

func deleteTask(c *gin.Context) {
	id := c.Param("id")
	if database.DeleteTask(id) {
		c.JSON(http.StatusOK, gin.H{})
	} else {
		c.JSON(http.StatusNotFound, gin.H{})
	}
}

func updateTask(c *gin.Context) {
	var task models.Task
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	if database.UpdateTask(&task) {
		c.JSON(http.StatusOK, gin.H{})
	} else {
		c.JSON(http.StatusNotFound, gin.H{})
	}
}

func createTask(c *gin.Context) {
	var task models.Task
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	id := database.CreateTask(task.Title, task.Description, task.DueDate)
	if id != 0 {
		c.JSON(http.StatusOK, gin.H{})
	} else {
		c.JSON(http.StatusBadRequest, gin.H{})
	}
}

func completedTasks(c *gin.Context) {
	tasks := database.CompletedTasks()
	c.JSON(http.StatusOK, tasks)
}

func uncompletedTasks(c *gin.Context) {
	tasks := database.UncompletedTasks()
	c.JSON(http.StatusOK, tasks)
}
