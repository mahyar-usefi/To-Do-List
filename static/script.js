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
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p>Status: <span class="${task.completed ? 'completed' : 'not-completed'}">
                    ${task.completed ? 'Completed' : 'Not Completed'}
                </span></p>
                <button class="delete-btn" data-id="${task.id}">Delete</button>
            `;

            taskList.appendChild(taskDiv);
        });

        // Attach event listeners to all delete buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const taskId = e.target.getAttribute('data-id');
                await deleteTask(taskId);
            });
        });

    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

async function deleteTask(id) {
    try {
        const res = await fetch(`/delete-task/${id}`);
        if (res.ok) {
            fetchTasks(); // Refresh the task list
        } else {
            console.error("Task not found or could not be deleted.");
        }
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}

window.onload = fetchTasks;
