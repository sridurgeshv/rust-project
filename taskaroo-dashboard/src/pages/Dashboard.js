import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import Calendar from '../components/Calendar';
import Pomodoro from '../components/Pomodoro'; 
import TaskList from '../components/TaskList';
import TrackingList from '../components/TrackingList';
import Categories from '../components/Categories';
import Comments from '../components/Comments';
import VoiceAssistantIcon from '../components/VoiceAssistantIcon';
import BotPopup from '../components/BotPopup';

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [showPomodoro, setShowPomodoro] = useState(false); // State for Pomodoro form
    const [trackedTasks, setTrackedTasks] = useState([]); // State for tracked tasks
    const [isBotOpen, setIsBotOpen] = useState(false); // State for bot popup visibility

    useEffect(() => {
      fetch('http://127.0.0.1:8080/tasks')
          .then(response => response.json())
          .then(data => setTasks(data));
    }, []);
    
    const togglePomodoro = () => {
        setShowPomodoro(!showPomodoro);
    };

    const toggleBot = () => {
        setIsBotOpen(!isBotOpen);
    };

    // Fetch the tracked tasks from the backend when the component mounts
    useEffect(() => {
        fetch(fetch('http://127.0.0.1:8080/tracked-tasks'))
            .then(response => response.json())
            .then(data => setTrackedTasks(data))
            .catch(error => console.error('Error fetching tracked tasks:', error));
    }, []);

    // Function to add a tracked task from PomodoroForm
    const addTrackedTask = (task) => {
        setTrackedTasks(prevTrackedTasks => [...prevTrackedTasks, task]);
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <input type="text" placeholder="Search" />
                <div className="header-buttons">
                    <button className="profile-button">Profile</button>
                    <Pomodoro addTrackedTask={addTrackedTask} />
                </div>
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
        <VoiceAssistantIcon onClick={toggleBot} />
            {isBotOpen && (
                <BotPopup
                    tasks={tasks}
                    setTasks={setTasks}
                    onClose={toggleBot}
                />
            )}
        {showPomodoro && <Pomodoro onClose={togglePomodoro} addTrackedTask={addTrackedTask} />} {/* Pomodoro Form */}
        </div>
    );
}

export default Dashboard;

