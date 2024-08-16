import React, { useState } from 'react';
import '../styles/TaskPopup.css';

function TaskPopup({ addTask, togglePopup }) {
    const [taskTitle, setTaskTitle] = useState('');
    const [dueDate, setDueDate] = useState('Today');

    const handleSubmit = (e) => {
        e.preventDefault();
        addTask(taskTitle, dueDate);  // Call the addTask function passed down as a prop
        togglePopup();  // Close the popup after submission
    };

    return (
        <div className="popup-overlay">
            <div className="popup-box">
                <h2>Add New Task</h2>
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
                    <div className="form-actions">
                        <button type="submit" className="submit-btn">Add Task</button>
                        <button type="button" className="cancel-btn" onClick={togglePopup}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskPopup;
