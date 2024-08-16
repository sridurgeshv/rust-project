import React, { useState } from 'react';
import '../styles/Dashboard.css';
import Calendar from '../components/Calendar';
import TaskList from '../components/TaskList';
import TrackingList from '../components/TrackingList';
import Categories from '../components/Categories';
import Comments from '../components/Comments';
import TaskPopup from '../components/TaskPopup';

function Dashboard() {
    const [showPopup, setShowPopup] = useState(false);
    const [tasks, setTasks] = useState([]);

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    // Assuming you have something like this:   
    const addTask = (taskTitle, dueDate) => {
        const task = {
          title: taskTitle,
          date: dueDate,
          completed: false
        };
      
        fetch('http://127.0.0.1:8080/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(task),
        })
        .then(response => {
          if (!response.ok) {
            return response.text().then(text => {
              throw new Error(text);
            });
          }
          return response.json();
        })
        .then(newTask => {
          setTasks(prevTasks => [...prevTasks, newTask]);
        })
        .catch(error => {
          console.error('Error adding task:', error);
        });
      };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <input type="text" placeholder="Search" />
                <button className="new-task" onClick={togglePopup}>+ New task</button>
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
            {showPopup && <TaskPopup addTask={addTask} togglePopup={togglePopup} />}
        </div>
    );
}

export default Dashboard;
