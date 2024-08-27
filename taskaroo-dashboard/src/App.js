import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MyTasks from './pages/MyTasks';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import AuthForm from './pages/AuthForm';
import WelcomePage from './pages/WelcomePage';
import Pomodoro from './components/Pomodoro';
import './App.css';

function App() {
    const [showPomodoro, setShowPomodoro] = useState(false);
    const [showFocusTimer, setShowFocusTimer] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

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

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
    };

    return (
        <Router>
            <div className={`app-container ${showFocusTimer ? 'blurred' : ''}`}>
                {isAuthenticated && <Sidebar onLogout={handleLogout} />}
                <div className={isAuthenticated ? "main-content" : "full-content"}>
                    <Routes>
                        <Route path="/" element={
                            isAuthenticated ? <Navigate to="/dashboard" /> : <WelcomePage />
                        } />
                        <Route path="/auth" element={
                            isAuthenticated ? <Navigate to="/dashboard" /> : <AuthForm onLogin={handleLogin} />
                        } />
                        <Route path="/dashboard" element={
                            isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />
                        } />
                        <Route path="/my-tasks" element={
                            isAuthenticated ? <MyTasks /> : <Navigate to="/auth" />
                        } />
                        <Route path="/goals" element={
                            isAuthenticated ? <Goals /> : <Navigate to="/auth" />
                        } />
                        <Route path="/settings" element={
                            isAuthenticated ? <Settings /> : <Navigate to="/auth" />
                        } />
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