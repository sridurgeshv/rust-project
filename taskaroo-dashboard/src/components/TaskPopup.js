import React, { useState, useEffect } from 'react';
import '../styles/TaskPopup.css';

function TaskPopup({ addTask, togglePopup, task }) {
    const [taskTitle, setTaskTitle] = useState('');
    const [dueDate, setDueDate] = useState('Today');
    const [priority, setPriority] = useState('Medium');

    useEffect(() => {
        if (task) {
            setTaskTitle(task.title);
            setDueDate(task.date);
            setPriority(task.priority);
        }
    }, [task]);

    const handleSubmit = (e) => {
        e.preventDefault();
        addTask(taskTitle, dueDate, priority);
        togglePopup();
    };

    return (
        <div className="popup-overlay">
            <div className="popup-box">
                <h2>{task ? 'Edit Task' : 'Add New Task'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="task-title">Task Title</label>
                        <input
                            type="text"
                            id="task-title"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="due-date">When to Complete</label>
                        <select
                            id="due-date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        >
                            <option value="Today">Today</option>
                            <option value="Tomorrow">Tomorrow</option>
                            <option value="This Week">This Week</option>
                            <option value="This Month">This Month</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="priority">Priority</label>
                        <select
                            id="priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="submit-btn">
                            {task ? 'Update Task' : 'Add Task'}
                        </button>
                        <button type="button" className="cancel-btn" onClick={togglePopup}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskPopup;