package database

import (
	"ToDo/models"
)

func CreateTask(title string, description string) uint {
	task := models.Task{Title: title, Description: description, Completed: false}
	DB.Create(&task)
	return task.ID
}

func GetAllTasks() []models.Task {
	var tasks []models.Task
	DB.Find(&tasks)
	return tasks
}

func UncompletedTasks() []models.Task {
	var tasks []models.Task
	DB.Where("completed = ?", false).Find(&tasks)
	return tasks
}

func GetTask[V uint | string](id V) models.Task {
	var task models.Task
	DB.First(&task, id)
	return task
}

func DeleteTask[V uint | string](id V) bool {
	if GetTask(id).ID != 0 {
		DB.Delete(&models.Task{}, id)
		return true
	} else {
		return false
	}
}

func UpdateTask(req *models.Task) bool {
	task := GetTask(req.ID)
	if task.ID != 0 {
		DB.Save(&req)
		return true
	} else {
		return false
	}
}
