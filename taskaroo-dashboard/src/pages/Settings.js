import React, { useState } from 'react';
import '../styles/Settings.css';

function Settings() {
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
                                    <input type="text" id="name" name="name" defaultValue="Ismail Hossain" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" name="email" defaultValue="ismail@example.com" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone</label>
                                    <input type="tel" id="phone" name="phone" defaultValue="01234567890" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="role">Role</label>
                                    <input type="text" id="role" name="role" defaultValue="Project Manager" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="department">Department</label>
                                    <input type="text" id="department" name="department" defaultValue="IT" />
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
                    <button className="save-button">Save</button>
                </div>
            </div>
        </div>
    );
}

export default Settings;