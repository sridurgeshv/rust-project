import React, { useEffect, useCallback } from 'react';
import '../styles/TaskList.css';

function TaskList({ tasks, setTasks }) {
  const fetchTasks = useCallback(() => {
    fetch('http://127.0.0.1:8080/tasks')
      .then(response => response.json())
      .then(data => setTasks(data));
  }, [setTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleComplete = (id) => {
    fetch(`http://127.0.0.1:8080/tasks/complete/${id}`, { method: 'POST' })
      .then(() => {
        setTasks(tasks.map(task =>
          task.id === id ? { ...task, completed: true } : task
        ));
      });
  };

  const formatDate = (dateString) => {
    const today = new Date();
    const taskDate = new Date(dateString);

    // Reset the time part for accurate comparison
    today.setHours(0, 0, 0, 0);
    taskDate.setHours(0, 0, 0, 0);

    const dayDifference = (taskDate - today) / (1000 * 60 * 60 * 24);

    if (dayDifference === 0) {
        return 'Today';
    } else if (dayDifference === 1) {
        return 'Tomorrow';
    } else if (dayDifference >= 2 && dayDifference <= 6 && taskDate.getDay() !== 0) {
        return 'This Week';
    } else if (
        taskDate.getMonth() === today.getMonth() &&
        taskDate.getFullYear() === today.getFullYear()
    ) {
        return 'This Month';
    } else {
        return dateString; // fallback to the original date string
    }
};


  return (
    <div className="tasks card">
      <h3>My tasks ({tasks.length})</h3>
      <ul className="task-list">
      {tasks.map(task => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
              <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleComplete(task.id)}
              />
              {task.title}
              <span className="task-date">{formatDate(task.date)}</span>
          </li>
      ))}
      </ul>
    </div>
  );
}

export default TaskList;
