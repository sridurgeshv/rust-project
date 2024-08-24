import React, { useState, useEffect } from 'react';
import '../styles/FocusTimer.css';

const FocusTimer = ({ initialMinutes = 25, onClose, addTrackedTask }) => {
  const [seconds, setSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [focusTask, setFocusTask] = useState('');
  const [totalFocusedTime, setTotalFocusedTime] = useState(0);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
        if (!isBreak) {
          setTotalFocusedTime(time => time + 1);
        }
      }, 1000);
    } else if (seconds === 0) {
      if (isBreak) {
        handleStop();
      } else {
        setIsBreak(true);
        setSeconds(5 * 60); // 5 minutes break
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds, isBreak]);

  const handlePauseResume = () => {
    setIsRunning(!isRunning);
  };

  const handleStop = () => {
    setIsRunning(false);
    if (focusTask) {
      fetch('http://127.0.0.1:8080/tracked-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: focusTask, time: Math.floor(totalFocusedTime / 60) }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Task tracked successfully:', data);
          addTrackedTask(data);
        })
        .catch(error => {
          console.error('Error posting tracked task:', error);
        });
    }
    onClose();
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const remainingSeconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const switchMode = () => {
    setIsBreak(!isBreak);
    setSeconds(isBreak ? initialMinutes * 60 : 5 * 60);
    setIsRunning(true);
  };

  return (
    <div className="focus-timer-overlay">
      <div className="focus-timer">
        <button className="close-button" onClick={handleStop}>×</button>
        <div className="top-bar">
          <div className="icons-left">
            <span className="icon">🔗</span>
            <span className="icon">🔥</span>
          </div>
          <div className="focus-time">
            {Math.floor(totalFocusedTime / 60)}m Focused Today
          </div>
        </div>
        <div className="timer-container">
          <div className="timer-tabs">
            <button className={`tab ${!isBreak ? 'active' : ''}`} onClick={() => !isBreak && switchMode()}>FOCUS</button>
            <button className={`tab ${isBreak ? 'active' : ''}`} onClick={() => isBreak && switchMode()}>BREAK</button>
          </div>
          <div className="timer">{formatTime(seconds)}</div>
          {!isBreak ? (
            <input
              type="text"
              className="focus-input"
              placeholder="I will focus on..."
              value={focusTask}
              onChange={(e) => setFocusTask(e.target.value)}
            />
          ) : (
            <div className="break-message">Take a break</div>
          )}
          <button className="pause-button" onClick={handlePauseResume}>
            {isRunning ? 'PAUSE' : 'RESUME'}
          </button>
        </div>
        <div className="bottom-quote">
          I am focused on a single direction and one task at a time.
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;