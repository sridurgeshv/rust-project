import React, { useState } from 'react';
import '../styles/BotPopup.css';

function BotPopup({ tasks, setTasks, onClose }) {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');

    const handleCommand = async () => {
        if (!input.trim()) return;

        const command = input.toLowerCase().trim();
        let result = '';

        // Command: Add a new task
        if (command.startsWith('add task')) {
            const title = command.replace('add task', '').trim();
            if (title) {
                const newTask = { title, completed: false, is_pomodoro: false };
                const res = await fetch('http://127.0.0.1:8080/bot/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newTask),
                });
                if (res.ok) {
                    const createdTask = await res.json();
                    setTasks([...tasks, createdTask]);
                    result = `Task "${title}" added successfully.`;
                } else {
                    result = 'Failed to add task.';
                }
            } else {
                result = 'Please provide a task title.';
            }

        // Command: Update a task
    } else if (command.startsWith('update task')) {
        const parts = command.replace('update task', '').trim().split(' title ');
        const id = parseInt(parts[0], 10);
        const title = parts.slice(1).join(' title ');
    
        if (id && title) {
            const res = await fetch(`http://127.0.0.1:8080/bot/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, completed: false, is_pomodoro: false }), // Add other fields if needed
            });
            if (res.ok) {
                const updatedTask = await res.json();
                setTasks(tasks.map(task => task.id === id ? updatedTask : task));
                result = `Task ${id} updated to "${title}".`;
            } else {
                result = 'Failed to update task.';
            }
        } else {
            result = 'Please provide a valid task ID and title.';
        }

        // Command: Mark a task as complete
        } else if (command.startsWith('complete task')) {
            const id = command.replace('complete task', '').trim();
            if (id) {
                const res = await fetch(`http://127.0.0.1:8080/bot/tasks/complete/${id}`, {
                    method: 'POST',
                });
                if (res.ok) {
                    const updatedTask = await res.json();
                    setTasks(tasks.map(task => task.id === parseInt(id) ? updatedTask : task));
                    result = `Task ${id} marked as complete.`;
                } else {
                    result = 'Failed to complete task.';
                }
            } else {
                result = 'Please provide a valid task ID.';
            }

        // Command: Delete a task
        } else if (command.startsWith('delete task')) {
            const id = command.replace('delete task', '').trim();
            if (id) {
                const res = await fetch(`http://127.0.0.1:8080/bot/tasks/${id}`, {
                    method: 'DELETE',
                });
                if (res.ok) {
                    setTasks(tasks.filter(task => task.id !== parseInt(id)));
                    result = `Task ${id} deleted.`;
                } else {
                    result = 'Failed to delete task.';
                }
            } else {
                result = 'Please provide a valid task ID.';
            }

        // Command: Add a new goal
    } else if (command.startsWith('add goal')) {
        const title = command.replace('add goal', '').trim();
        if (title) {
            const newGoal = { title, progress: 0 }; // Adding progress as 0 for new goals
            const res = await fetch('http://127.0.0.1:8080/bot/goals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newGoal),
            });
            if (res.ok) {
                const createdGoal = await res.json();
                result = `Goal "${createdGoal.title}" added successfully with ID ${createdGoal.id}.`;
            } else {
                result = 'Failed to add goal.';
            }
        } else {
            result = 'Please provide a goal title.';
        }
    } else {
        result = 'Unknown command. Please try again.';
    }    

        setResponse(result);
        setInput('');
    };

    return (
        <div className="bot-popup">
            <div className="bot-header">
                <h5>Task Management Bot</h5>
                <button onClick={onClose}>Close</button>
            </div>
            <div className="bot-content">
                <div className="bot-response">{response}</div>
                <input 
                    type="text" 
                    placeholder="Enter your command..." 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyPress={(e) => e.key === 'Enter' && handleCommand()} 
                />
                <button onClick={handleCommand}>Submit</button>
            </div>
        </div>
    );
}

export default BotPopup;