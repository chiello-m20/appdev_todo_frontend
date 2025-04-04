import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://appdev-todo-backend.onrender.com/api/tasks/";  // Replace with your Render URL

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editTask, setEditTask] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    fetchTasks();
    document.body.className = darkMode ? "dark-mode" : "light-mode";
  }, [darkMode]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (newTask.trim() === "") return;

    try {
      const response = await axios.post(API_URL, { text: newTask, completed: false });
      setTasks([...tasks, response.data]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateTask = async (task) => {
    await axios.put(`${API_URL}${task.id}/`, task);
    setEditTask(null);
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}${id}/`);
    fetchTasks();
  };

  const toggleCompletion = async (task) => {
    await updateTask({ ...task, completed: !task.completed });
  };

  const startEditing = (task) => {
    setEditTask(task.id);
    setEditText(task.text);
  };

  const saveEdit = () => {
    if (editText.trim() === "") return;
    updateTask({ id: editTask, text: editText });
  };

  const cancelEdit = () => {
    setEditTask(null);
    setEditText("");
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <div className={`app ${darkMode ? "dark-mode" : "light-mode"}`}>
      <h1 className="app-title">To-Do List</h1>

      {/* Dark Mode Toggle */}
      <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "Light M🌞de" : "Dark M🌝de"}
      </button>

      {/* Add Task */}
      <div className="add-task-container">
        <input
          type="text"
          className="task-input"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task..."
        />
        <button className="task-add-btn" onClick={addTask}>Add</button>
      </div>

      {/* Filter Buttons */}
      <div className="filter-container">
        <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>All</button>
        <button className={`filter-btn ${filter === "completed" ? "active" : ""}`} onClick={() => setFilter("completed")}>Completed</button>
        <button className={`filter-btn ${filter === "pending" ? "active" : ""}`} onClick={() => setFilter("pending")}>Pending</button>
      </div>

      {/* Task List */}
      <ul className="task-list">
        {filteredTasks.map((task) => (
          <li key={task.id} className={`task-item ${task.completed ? "completed" : ""}`}>
            {editTask === task.id ? (
              <div className="edit-mode">
                <input
                  type="text"
                  className="task-edit-input"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button className="task-save-btn" onClick={saveEdit}>Save</button>
                <button className="task-cancel-btn" onClick={cancelEdit}>Cancel</button>
              </div>
            ) : (
              <span className="task-text" onClick={() => toggleCompletion(task)}>
                {task.text}
              </span>
            )}

            {editTask !== task.id && (
              <>
                <button className="task-edit-btn" onClick={() => startEditing(task)}>Edit</button>
                <button className="task-delete-btn" onClick={() => deleteTask(task.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
