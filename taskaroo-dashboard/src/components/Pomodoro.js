// Pomodoro.js
import React, { useState } from 'react';
import focusIcon from '../assets/focus.png'; 
import FocusTimer from './FocusTimer';
import '../styles/Pomodoro.css';

const Pomodoro = ({ onClose, addTrackedTask }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pomodoroEnabled, setPomodoroEnabled] = useState(false);
  const [soundscapesEnabled, setSoundscapesEnabled] = useState(false);
  const [showFocusTimer, setShowFocusTimer] = useState(false);

  const togglePomodoro = () => {
    setIsOpen(!isOpen);
  };

  const startFocusing = () => {
    setShowFocusTimer(true);
    setIsOpen(false); // Close the pomodoro popup
  };

  const handleCloseFocusTimer = () => {
    setShowFocusTimer(false);
    onClose(); // Close the entire pomodoro component
  };

  if (showFocusTimer) {
    return <FocusTimer initialMinutes={25} onClose={handleCloseFocusTimer} addTrackedTask={addTrackedTask} />;
  }

  return (
    <div className="pomodoro-container">
      <button className="pomodoro-button" onClick={togglePomodoro}>
        <img src={focusIcon} alt="Focus Mode" className="focus-icon" />
        Pomodoro
      </button>
      {isOpen && (
        <div className="pomodoro-popup">
          <div className="popup-header">
          <span>
            <span role="img" aria-label="Brain emoji">🧠</span> Focus Mode
          </span>
            <button className="close-button" onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div className="popup-content">
            <div className="option">
              <span>Pomodoro</span>
              <div className="option-details">
                <span>Focus for 25 mins, rest for 5 mins</span>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={pomodoroEnabled}
                    onChange={() => setPomodoroEnabled(!pomodoroEnabled)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
            <div className="option">
              <span>Soundscapes</span>
              <div className="option-details">
                <span>Scene: Campfire</span>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={soundscapesEnabled}
                    onChange={() => setSoundscapesEnabled(!soundscapesEnabled)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
            <button className="start-focus-button" onClick={startFocusing}>
              Start focusing
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pomodoro;