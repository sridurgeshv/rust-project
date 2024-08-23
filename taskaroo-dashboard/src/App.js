// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MyTasks from './pages/MyTasks';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import Pomodoro from './components/Pomodoro';
import './App.css';

function App() {
    const [showPomodoro, setShowPomodoro] = useState(false);
    const [showFocusTimer, setShowFocusTimer] = useState(false);

    const togglePomodoro = () => {
        setShowPomodoro(!showPomodoro);
    };

    const handleClosePomodoroAndFocusTimer = () => {
        setShowPomodoro(false);
        setShowFocusTimer(false);
    };

    const addTrackedTask = (task) => {
        console.log('Task tracked:', task);
    };

    return (
        <Router>
            <div className={`app-container ${showFocusTimer ? 'blurred' : ''}`}>
                <Sidebar />
                <div className="main-content">
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/my-tasks" element={<MyTasks />} />
                        <Route path="/goals" element={<Goals />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </div>
                {showPomodoro && (
                    <Pomodoro 
                        onClose={handleClosePomodoroAndFocusTimer} 
                        addTrackedTask={addTrackedTask}
                        setShowFocusTimer={setShowFocusTimer}
                    />
                )}
            </div>
        </Router>
    );
}

export default App;