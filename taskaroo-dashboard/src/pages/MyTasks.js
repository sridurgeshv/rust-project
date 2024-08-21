import React, { useState, useEffect } from 'react';
import '../styles/MyTasks.css';
import TaskPopup from '../components/TaskPopup';

function MyTasks() {
    const [tasks, setTasks] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = () => {
        fetch('http://127.0.0.1:8080/tasks')
            .then(response => response.json())
            .then(data => setTasks(data));
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const addTask = (taskTitle, dueDate, priority) => {
        const task = {
            title: taskTitle,
            date: dueDate,
            priority: priority,
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

    const formatDate = (dateString) => {
        const today = new Date();
        const taskDate = new Date(dateString);
        
        if (taskDate.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (taskDate.toDateString() === new Date(today.setDate(today.getDate() + 1)).toDateString()) {
            return 'Tomorrow';
        } else if (taskDate <= new Date(today.setDate(today.getDate() + 6))) {
            return 'This Week';
        } else if (taskDate.getMonth() === today.getMonth() && taskDate.getFullYear() === today.getFullYear()) {
            return 'This Month';
        } else {
            return dateString; // fallback to the original date string
        }
    };

    return (
        <div className="my-tasks-page">
            <h2>Tasks</h2>
            <div className="task-controls">
                <input 
                    type="text" 
                    placeholder="Search within tasks" 
                    className="task-search"
                />
                <button className="create-task-btn" onClick={togglePopup}>+ Create new task</button>
                <button className="import-task-btn">Import from MS To-Do</button>
            </div>
            <table className="task-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Due date</th>
                        <th>Priority</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task.id}>
                            <td>{task.title}</td>
                            <td>{formatDate(task.date)}</td>
                            <td>{task.priority}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showPopup && <TaskPopup addTask={addTask} togglePopup={togglePopup} />}
        </div>
    );
}

export default MyTasks;