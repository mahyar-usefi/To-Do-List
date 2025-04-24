package database

import (
	"ToDo/models"
	"time"
)

func CreateTask(title string, description string, dueDate string) uint {
	createDate := time.Now().Format("2006-01-02")
	task := models.Task{
		Title:       title,
		Description: description,
		Completed:   false,
		CreateDate:  createDate,
		DueDate:     dueDate,
	}
	DB.Create(&task)
	return task.ID
}

func GetAllTasks() []models.Task {
	var tasks []models.Task
	DB.Find(&tasks)

	now := time.Now()
	for i, task := range tasks {
		dueDate, _ := time.Parse(time.DateOnly, tasks[0].DueDate)
		if !task.Completed && dueDate.Before(now) {
			tasks[i].OverDue = true
		} else {
			tasks[i].OverDue = false
		}
	}

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

	req.CreateDate = task.CreateDate
	if req.DueDate == "" {
		req.DueDate = task.DueDate
	}

	if task.ID != 0 {
		DB.Save(&req)
		return true
	} else {
		return false
	}
}
