import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import Calendar from '../components/Calendar';
import TaskList from '../components/TaskList';
import TrackingList from '../components/TrackingList';
import Categories from '../components/Categories';
import Comments from '../components/Comments';

function Dashboard() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
      fetch('http://127.0.0.1:8080/tasks')
          .then(response => response.json())
          .then(data => setTasks(data));
    }, []);

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <input type="text" placeholder="Search" />
                <button className="new-task">Profile</button>
            </div>
            <div className="main-content">
                <div className="left-column">
                    <Calendar />
                    <Categories />
                </div>
                <div className="middle-column">
                    <TaskList tasks={tasks} setTasks={setTasks} />
                    <TrackingList />
                </div>
                <div className="right-column">
                    <Comments />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

