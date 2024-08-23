import React, { useEffect, useState } from 'react';
import '../styles/TrackingList.css';

function TrackingList() {
  const [trackedTasks, setTrackedTasks] = useState([]);

  useEffect(() => {
    // Fetch the tracked tasks from the backend
    fetch('http://127.0.0.1:8080/tracked-tasks')
      .then(response => response.json())
      .then(data => setTrackedTasks(data))
      .catch(error => console.error('Error fetching tracked tasks:', error));
  }, []);

  return (
    <div className="tracking-list card">
      <h3>My tracking</h3>
      <ul className="tracking-list">
        {trackedTasks.map(trackedTask => (
          <li key={trackedTask.id} className="tracked-task">
            <span className="task-title">{trackedTask.title}</span>
            <span className="task-time">{trackedTask.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TrackingList;