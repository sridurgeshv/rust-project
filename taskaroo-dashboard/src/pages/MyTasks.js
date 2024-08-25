import React, { useState, useEffect } from 'react';
import '../styles/MyTasks.css';
import TaskPopup from '../components/TaskPopup';

function MyTasks() {
    const [tasks, setTasks] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = () => {
        fetch('http://127.0.0.1:8080/tasks')
            .then(response => response.json())
            .then(data => setTasks(data));
    };

    const togglePopup = (task = null) => {
        setEditingTask(task);
        setShowPopup(!showPopup);
    };

    const addOrUpdateTask = (taskTitle, dueDate, priority) => {
        const task = {
            id: editingTask ? editingTask.id : undefined,
            title: taskTitle,
            date: dueDate,
            priority: priority,
            completed: editingTask ? editingTask.completed : false
        };

        const url = editingTask 
            ? `http://127.0.0.1:8080/tasks/${editingTask.id}` 
            : 'http://127.0.0.1:8080/tasks';
        const method = editingTask ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
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
        .then(updatedTask => {
            if (editingTask) {
                setTasks(prevTasks => prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t));
            } else {
                setTasks(prevTasks => [...prevTasks, updatedTask]);
            }
            setEditingTask(null);
        })
        .catch(error => {
            console.error('Error adding/updating task:', error);
        });
    };

    const deleteTask = (taskId) => {
        fetch(`http://127.0.0.1:8080/tasks/${taskId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
            setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        })
        .catch(error => {
            console.error('Error deleting task:', error);
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
                <button className="create-task-btn" onClick={() => togglePopup()}>+ Create new task</button>
                <button className="import-task-btn">Import from MS To-Do</button>
            </div>
            <table className="task-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Due date</th>
                        <th>Priority</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task.id}>
                            <td>{task.title}</td>
                            <td>{formatDate(task.date)}</td>
                            <td>{task.priority}</td>
                            <td>
                                <div className="task-actions">
                                    <button onClick={() => togglePopup(task)}>Edit</button>
                                    <button onClick={() => deleteTask(task.id)}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showPopup && (
            <TaskPopup 
                addTask={addOrUpdateTask} 
                togglePopup={togglePopup} 
                task={editingTask}
            />
        )}
        </div>
    );
}

export default MyTasks;