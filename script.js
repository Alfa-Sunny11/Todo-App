document.addEventListener('DOMContentLoaded', () => {

      // --- Global Variables ---
      let tasks = []; // Local array to hold tasks
      const TASKS_STORAGE_KEY = 'todo-app-tasks';

      // --- Get elements from the DOM ---
      const taskForm = document.getElementById('task-form');
      const taskInput = document.getElementById('task-input');
      const taskList = document.getElementById('task-list');
      const emptyState = document.getElementById('empty-state');

      // --- localStorage Functions ---
      function getTasksFromStorage() {
            const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
            return storedTasks ? JSON.parse(storedTasks) : [];
      }

      function saveTasksToStorage(tasksToSave) {
            localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasksToSave));
      }

      // --- App Logic ---
      function initApp() {
            tasks = getTasksFromStorage();
            renderTasks();
      }

      function renderTasks() {
            // Clear the current list
            taskList.innerHTML = '';

            // Show/hide empty state
            if (tasks.length === 0) {
                  emptyState.classList.remove('hidden');
            } else {
                  emptyState.classList.add('hidden');
            }

            // Create and append each task item
            tasks.forEach(task => {
                  const li = document.createElement('li');
                  li.dataset.id = task.id;

                  // Checkbox
                  const checkbox = document.createElement('input');
                  checkbox.type = 'checkbox';
                  checkbox.className = 'task-checkbox';
                  checkbox.checked = task.completed;
                  checkbox.addEventListener('change', () => toggleTaskComplete(task.id));

                  // Task text
                  const textSpan = document.createElement('span');
                  textSpan.className = 'task-text';
                  textSpan.textContent = task.text;

                  // Delete button
                  const deleteBtn = document.createElement('button');
                  deleteBtn.className = 'delete-btn';
                  deleteBtn.textContent = 'Delete';
                  deleteBtn.addEventListener('click', () => deleteTask(task.id));

                  // Append elements to the list item
                  li.appendChild(checkbox);
                  li.appendChild(textSpan);
                  li.appendChild(deleteBtn);

                  // Append the list item to the task list
                  taskList.appendChild(li);
            });
      }

      // Handles the new task form submission.
      function handleAddTask(e) {
            e.preventDefault();
            const text = taskInput.value.trim();

            if (text === '') {
                  // Using console.warn instead of alert
                  console.warn('Task cannot be empty.');
                  return;
            }

            // Create a new task object
            const newTask = {
                  id: Date.now().toString(), // Use timestamp as a simple unique ID
                  text: text,
                  completed: false,
            };

            // Add to local array
            tasks.push(newTask);

            // Save to localStorage and re-render
            saveTasksToStorage(tasks);
            renderTasks();

            // Clear the input field
            taskInput.value = '';
      }

      function toggleTaskComplete(id) {
            // Find the task in the array
            const task = tasks.find(t => t.id === id);
            if (task) {
                  task.completed = !task.completed;
                  saveTasksToStorage(tasks);
                  renderTasks(); // Re-render the whole list
            }
      }

      // Deletes a task from the list.

      function deleteTask(id) {
            // Filter out the task to be deleted
            tasks = tasks.filter(t => t.id !== id);

            // Save the updated array and re-render
            saveTasksToStorage(tasks);
            renderTasks();
      }

      // Add form submit listener
      taskForm.addEventListener('submit', handleAddTask);

      // Start the app
      initApp();
});