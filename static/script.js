async function fetchTasks() {
    try {
        const filter = document.getElementById('filterStatus')?.value || 'all';
        let endpoint = '/tasks';

        if (filter === 'completed') {
            endpoint = '/completed-tasks';
        } else if (filter === 'uncompleted') {
            endpoint = '/uncompleted-tasks';
        }

        const response = await fetch(endpoint);
        const tasks = await response.json();
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        tasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'task';

            taskDiv.innerHTML = `
                <input type="text" class="edit-title" value="${task.title}" />
                <input type="text" class="edit-description" value="${task.description}" />
                <input type="date" class="edit-due-date" value="${task.due_date || ''}" />

                <label>
                    <input type="checkbox" class="toggle-status" ${task.completed ? 'checked' : ''} />
                    <span>${task.completed ? '✅ Completed' : '❌ Not Completed'}</span>
                </label>
                
                ${task.over_due ? '<p class="overdue-warning">⚠️ Overdue!</p>' : ''}

                <div class="buttons">
                    <button class="update-btn" data-id="${task.id}">Update</button>
                    <button class="delete-btn" data-id="${task.id}">Delete</button>
                </div>
            `;

            taskList.appendChild(taskDiv);

            // Handle update
            taskDiv.querySelector('.update-btn').addEventListener('click', async () => {
                const updatedTask = {
                    id: task.id,
                    title: taskDiv.querySelector('.edit-title').value,
                    description: taskDiv.querySelector('.edit-description').value,
                    completed: taskDiv.querySelector('.toggle-status').checked,
                    due_date: taskDiv.querySelector('.edit-due-date').value
                };
                await updateTask(updatedTask);
            });

            // Handle delete
            taskDiv.querySelector('.delete-btn').addEventListener('click', async () => {
                await deleteTask(task.id);
            });

            // Handle status toggle
            taskDiv.querySelector('.toggle-status').addEventListener('change', async (e) => {
                const updatedTask = {
                    id: task.id,
                    title: taskDiv.querySelector('.edit-title').value,
                    description: taskDiv.querySelector('.edit-description').value,
                    completed: e.target.checked,
                    due_date: taskDiv.querySelector('.edit-due-date').value
                };
                await updateTask(updatedTask);
            });
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

async function createTask(title, description, due_date) {
    try {
        await fetch('/create-task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, due_date })
        });
        fetchTasks();
    } catch (error) {
        console.error('Error creating task:', error);
    }
}

async function updateTask(task) {
    try {
        await fetch('/update-task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });
        fetchTasks();
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

async function deleteTask(id) {
    try {
        await fetch(`/delete-task/${id}`);
        fetchTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();

    const form = document.getElementById('createTaskForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const due_date = document.getElementById('taskDueDate').value;

        if (title.trim() !== '') {
            await createTask(title, description, due_date);
            form.reset();
        }
    });

    const filterDropdown = document.getElementById('filterStatus');
    if (filterDropdown) {
        filterDropdown.addEventListener('change', fetchTasks);
    }
});
