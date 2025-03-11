## **Task Tracker Program**

### **File Structure**
1. `index.html` - The main HTML file for the user interface.
2. `styles.css` - CSS file for styling the UI.
3. `script.js` - JavaScript file containing the logic for the task tracker.

---

### **1. `index.html`**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Task Tracker</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>Task Tracker</h1>
    <form id="task-form">
      <input type="text" id="task-title" placeholder="Task Title" required>
      <textarea id="task-description" placeholder="Task Description" required></textarea>
      <input type="date" id="task-due-date" required>
      <select id="task-priority" required>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button type="submit">Add Task</button>
    </form>

    <div class="filters">
      <input type="text" id="search-input" placeholder="Search tasks...">
      <select id="filter-priority">
        <option value="all">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button id="sort-priority">Sort by Priority</button>
    </div>

    <div id="task-list"></div>

    <div class="stats">
      <h2>Statistics</h2>
      <p>Total Tasks: <span id="total-tasks">0</span></p>
      <p>Completed Tasks: <span id="completed-tasks">0</span></p>
      <p>Tasks Due Next Week: <span id="tasks-due-next-week">0</span></p>
    </div>
  </div>

  <script src="script.js"></script>
</body>
</html>
```

---

### **2. `styles.css`**
```css
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
}

form {
  margin-bottom: 20px;
}

input, textarea, select, button {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}

.filters {
  margin-bottom: 20px;
}

.task {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
}

.task.completed {
  background-color: #d4edda;
}

.stats {
  margin-top: 20px;
}
```

---

### **3. `script.js`**
```javascript
// Task Tracker Application
class TaskTracker {
  constructor() {
    this.tasks = this.loadTasks();
    this.renderTasks();
    this.updateStats();
  }

  // Load tasks from localStorage
  loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    return tasks;
  }

  // Save tasks to localStorage
  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  // Add a new task
  addTask(title, description, dueDate, priority) {
    const task = {
      id: Date.now(),
      title,
      description,
      dueDate,
      priority,
      completed: false,
    };
    this.tasks.push(task);
    this.saveTasks();
    this.renderTasks();
    this.updateStats();
  }

  // Mark a task as complete
  markTaskComplete(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = true;
      this.saveTasks();
      this.renderTasks();
      this.updateStats();
    }
  }

  // Delete a task
  deleteTask(taskId) {
    this.tasks = this.tasks.filter((t) => t.id !== taskId);
    this.saveTasks();
    this.renderTasks();
    this.updateStats();
  }

  // Search tasks by keyword
  searchTasks(keyword) {
    return this.tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(keyword.toLowerCase()) ||
        task.description.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // Filter tasks by priority
  filterTasks(priority) {
    if (priority === 'all') return this.tasks;
    return this.tasks.filter((task) => task.priority === priority);
  }

  // Sort tasks by priority
  sortTasks() {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    this.tasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    this.renderTasks();
  }

  // Render tasks to the UI
  renderTasks(filteredTasks = null) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    const tasksToRender = filteredTasks || this.tasks;
    tasksToRender.forEach((task) => {
      const taskElement = document.createElement('div');
      taskElement.className = `task ${task.completed ? 'completed' : ''}`;
      taskElement.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p><strong>Due Date:</strong> ${task.dueDate}</p>
        <p><strong>Priority:</strong> ${task.priority}</p>
        <button onclick="tracker.markTaskComplete(${task.id})">Mark Complete</button>
        <button onclick="tracker.deleteTask(${task.id})">Delete</button>
      `;
      taskList.appendChild(taskElement);
    });
  }

  // Update statistics
  updateStats() {
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter((task) => task.completed).length;
    const tasksDueNextWeek = this.tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      const nextWeek = new Date(today.setDate(today.getDate() + 7));
      return dueDate <= nextWeek && !task.completed;
    }).length;

    document.getElementById('total-tasks').textContent = totalTasks;
    document.getElementById('completed-tasks').textContent = completedTasks;
    document.getElementById('tasks-due-next-week').textContent = tasksDueNextWeek;
  }
}

// Initialize Task Tracker
const tracker = new TaskTracker();

// Event Listeners
document.getElementById('task-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('task-title').value;
  const description = document.getElementById('task-description').value;
  const dueDate = document.getElementById('task-due-date').value;
  const priority = document.getElementById('task-priority').value;

  if (!title || !description || !dueDate || !priority) {
    alert('Please fill in all fields.');
    return;
  }

  tracker.addTask(title, description, dueDate, priority);
  e.target.reset();
});

document.getElementById('search-input').addEventListener('input', (e) => {
  const keyword = e.target.value;
  const filteredTasks = tracker.searchTasks(keyword);
  tracker.renderTasks(filteredTasks);
});

document.getElementById('filter-priority').addEventListener('change', (e) => {
  const priority = e.target.value;
  const filteredTasks = tracker.filterTasks(priority);
  tracker.renderTasks(filteredTasks);
});

document.getElementById('sort-priority').addEventListener('click', () => {
  tracker.sortTasks();
});
```

---

### **Features Overview**
1. **Add Task**: Users can add tasks with a title, description, due date, and priority.
2. **List Tasks**: Tasks are displayed with their details and completion status.
3. **Mark Task as Complete**: Tasks can be marked as complete.
4. **Delete Task**: Tasks can be deleted.
5. **Search and Filter**: Tasks can be searched by keyword and filtered by priority.
6. **Sorting**: Tasks can be sorted by priority.
7. **Data Validation**: Basic validation ensures all fields are filled.
8. **Statistics**: Displays total tasks, completed tasks, and tasks due within the next week.
9. **User Interface**: A clean and responsive UI for interacting with the program.
10. **Error Handling**: Basic error handling for invalid inputs.
11. **Data Persistence**: Tasks are saved to `localStorage` and persist between sessions.
12. **Documentation**: The code is well-commented and structured for readability.

---

### **How to Use**
1. Open `index.html` in a web browser.
2. Add tasks using the form.
3. Use the search, filter, and sort features to manage tasks.
4. Mark tasks as complete or delete them as needed.
5. View statistics at the bottom of the page.

---

This program is robust, user-friendly, and ready for extension! Let me know if you need further assistance. 🚀
