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
