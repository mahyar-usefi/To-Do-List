package models

type Task struct {
	ID          uint   `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Completed   bool   `json:"completed"`
	CreateDate  string `json:"create_date"`
	DueDate     string `json:"due_date"`
	OverDue     bool   `json:"over_due" gorm:"-"`
}
