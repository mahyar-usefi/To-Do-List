async function fetchTasks() {
    try {
        const response = await fetch('/tasks');
        const tasks = await response.json();
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        tasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'task';

            taskDiv.innerHTML = `
                <input type="text" class="edit-title" value="${task.title}" />
                <input type="text" class="edit-description" value="${task.description}" />
                
                <label>
                    <input type="checkbox" class="toggle-status" ${task.completed ? 'checked' : ''} />
                    <span class="${task.completed ? 'completed' : 'not-completed'}">
                        ${task.completed ? 'Completed' : 'Not Completed'}
                    </span>
                </label>

                <div class="buttons">
                    <button class="update-btn" data-id="${task.id}">Update</button>
                    <button class="delete-btn" data-id="${task.id}">Delete</button>
                </div>
            `;

            // Add to DOM
            taskList.appendChild(taskDiv);

            // Handle update button
            taskDiv.querySelector('.update-btn').addEventListener('click', async () => {
                const updatedTask = {
                    id: task.id,
                    title: taskDiv.querySelector('.edit-title').value,
                    description: taskDiv.querySelector('.edit-description').value,
                    completed: taskDiv.querySelector('.toggle-status').checked
                };
                await updateTask(updatedTask);
            });

            // Handle delete button
            taskDiv.querySelector('.delete-btn').addEventListener('click', async () => {
                await deleteTask(task.id);
            });

            // Handle status toggle
            taskDiv.querySelector('.toggle-status').addEventListener('change', async (e) => {
                const updatedTask = {
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    completed: e.target.checked
                };
                await updateTask(updatedTask);
            });
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
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

async function createTask(title, description) {
    try {
        await fetch('/create-task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description })
        });
        fetchTasks();
    } catch (error) {
        console.error('Error creating task:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();

    const form = document.getElementById('createTaskForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('newTitle').value;
        const description = document.getElementById('newDescription').value;

        if (title.trim() !== '') {
            await createTask(title, description);
            form.reset();
        }
    });
});
