// Fetch and display all tasks
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
    <p>Status: <span class="${task.completed ? 'completed' : 'not-completed'}">
        ${task.completed ? 'Completed' : 'Not Completed'}
    </span></p>
    <div class="buttons">
        <button class="update-btn" data-id="${task.id}">Update</button>
        <button class="delete-btn" data-id="${task.id}">Delete</button>
    </div>
`;

            taskList.appendChild(taskDiv);
        });

        // Attach delete button listeners
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const taskId = e.target.getAttribute('data-id');
                await deleteTask(taskId);
            });
        });

        // Attach update button listeners
        document.querySelectorAll('.update-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const taskId = e.target.getAttribute('data-id');
                const taskDiv = e.target.parentElement;
                const titleInput = taskDiv.querySelector('.edit-title');
                const descInput = taskDiv.querySelector('.edit-description');
                const statusText = taskDiv.querySelector('span').textContent.trim();

                const updatedTask = {
                    id: Number(taskId),
                    title: titleInput.value.trim(),
                    description: descInput.value.trim(),
                    completed: statusText === 'Completed',
                };

                await updateTask(updatedTask);
            });
        });

    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// Delete a task by ID
async function deleteTask(id) {
    try {
        const res = await fetch(`/delete-task/${id}`);
        if (res.ok) {
            fetchTasks();
        } else {
            console.error("Task not found or could not be deleted.");
        }
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}

// Create a new task
async function createTask(title, description) {
    try {
        const res = await fetch("/create-task", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                description,
                completed: false,
            }),
        });

        if (!res.ok) {
            const err = await res.json();
            console.error("Failed to create task:", err);
        }
    } catch (error) {
        console.error("Error creating task:", error);
    }
}

// Update an existing task
async function updateTask(task) {
    try {
        const res = await fetch("/update-task", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(task),
        });

        if (res.ok) {
            fetchTasks();
        } else {
            console.error("Task could not be updated.");
        }
    } catch (error) {
        console.error("Error updating task:", error);
    }
}

// Handle create task form submission
document.getElementById("createTaskForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("taskTitle").value.trim();
    const description = document.getElementById("taskDescription").value.trim();

    if (!title || !description) return;

    await createTask(title, description);

    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";

    fetchTasks();
});

// Load tasks on page load
window.onload = fetchTasks;
