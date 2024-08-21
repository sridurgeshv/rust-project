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
              <span className="task-date">{task.date}</span>
          </li>
      ))}
      </ul>
    </div>
  );
}

export default TaskList;