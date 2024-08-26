import React, { useState, useEffect } from 'react';
import '../styles/Settings.css';

function Settings() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        // Load user data from local storage
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUsername(user.username);
            setPassword(user.password);
        }
    }, []);

    const [notifications, setNotifications] = useState({
        taskReminders: true,
        deadlineAlerts: false,
        teamUpdates: true,
        emailNotifications: true
    });

    const handleNotificationChange = (event) => {
        const { name, checked } = event.target;
        setNotifications(prev => ({ ...prev, [name]: checked }));
    };

    const handleSave = async () => {
        const response = await fetch('http://localhost:8080/update-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password: newPassword }),
        });
        const data = await response.json();
        if (data.success) {
            alert('User details updated successfully');
            localStorage.setItem('user', JSON.stringify({ username, password: newPassword }));
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="settings-page">
            <div className="settings-container">
                <div className="settings-content">
                    <div className="settings-column">
                        <div className="settings-section">
                            <h3>Edit Profile</h3>
                            <form>
                                <div className="form-group">
                                    <label htmlFor="name">Your Name</label>
                                    <input type="text" value={username} readOnly placeholder="Username/Email" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone</label>
                                    <input type="tel" id="phone" name="phone" defaultValue="01234567890" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="role">Focus Areas</label>
                                    <input type="text" id="role" name="role" defaultValue="Project Management" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="status">Availability Status</label>
                                    <input type="text" id="status" name="status" defaultValue="Available, Busy, Do Not Disturb" />
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="settings-column">
                        <div className="settings-section">
                            <h3>Change Password</h3>
                            <form>
                                <div className="form-group">
                                    <label htmlFor="currentPassword">Current Password</label>
                                    <input type="password" id="currentPassword" name="currentPassword" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="newPassword">New Password</label>
                                    <input type="password" id="newPassword" name="newPassword" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input type="password" id="confirmPassword" name="confirmPassword" />
                                </div>
                            </form>
                        </div>
                        <div className="settings-section notifications-section">
                            <h3>Notifications</h3>
                            <div className="notification-options">
                                <div className="notification-item">
                                    <span>Task Reminders</span>
                                    <label className="switch">
                                        <input type="checkbox" name="taskReminders" checked={notifications.taskReminders} onChange={handleNotificationChange} />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                                <div className="notification-item">
                                    <span>Deadline Alerts</span>
                                    <label className="switch">
                                        <input type="checkbox" name="deadlineAlerts" checked={notifications.deadlineAlerts} onChange={handleNotificationChange} />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                                <div className="notification-item">
                                    <span>Team Updates</span>
                                    <label className="switch">
                                        <input type="checkbox" name="teamUpdates" checked={notifications.teamUpdates} onChange={handleNotificationChange} />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                                <div className="notification-item">
                                    <span>Email Notifications</span>
                                    <label className="switch">
                                        <input type="checkbox" name="emailNotifications" checked={notifications.emailNotifications} onChange={handleNotificationChange} />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="button-container">
                    <button className="save-button" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
}

export default Settings;