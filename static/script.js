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
      `;

            taskList.appendChild(taskDiv);
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

window.onload = fetchTasks;
