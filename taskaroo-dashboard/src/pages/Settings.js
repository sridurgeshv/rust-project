import React, { useState, useEffect } from 'react';
import '../styles/Settings.css';

function Settings() {
    const [username, setUsername] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [focusArea, setFocusArea] = useState('');
    const [availabilityStatus, setAvailabilityStatus] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        // Load user data from local storage
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUsername(user.username || '');
            setCurrentPassword(user.password ? '••••••••' : ''); // Show 8 bullet points if password exists
            setPhone(user.phone || '');
            setFocusArea(user.focusArea || '');
            setAvailabilityStatus(user.availabilityStatus || '');
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

    const validatePhone = (value) => {
        const phoneRegex = /^\d{10}$/; // Assumes 10-digit phone number
        if (!phoneRegex.test(value)) {
            setPhoneError('Please enter a valid 10-digit phone number');
            return false;
        }
        setPhoneError('');
        return true;
    };

    const validatePasswords = () => {
        if (newPassword !== confirmPassword) {
            setPasswordError('New password and confirm password do not match');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handleSave = async () => {
        if (!validatePhone(phone) || (newPassword && !validatePasswords())) {
            return;
        }

        const updatedUser = {
            username,
            password: newPassword || currentPassword,
            phone,
            focusArea,
            availabilityStatus,
            notifications
        };

        try {
            const response = await fetch('http://localhost:8080/update-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser),
            });
            const data = await response.json();
            if (data.success) {
                alert('User details updated successfully');
                localStorage.setItem('user', JSON.stringify(updatedUser));
                if (newPassword) {
                    setCurrentPassword(newPassword);
                    setNewPassword('');
                    setConfirmPassword('');
                }
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('An error occurred while updating user details');
            console.error('Error:', error);
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
                                    <input 
                                        type="tel" 
                                        id="phone" 
                                        name="phone" 
                                        value={phone}
                                        onChange={(e) => {
                                            setPhone(e.target.value);
                                            validatePhone(e.target.value);
                                        }}
                                        placeholder="Enter your 10-digit phone number"
                                    />
                                    {phoneError && <div className="error-message">{phoneError}</div>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="focusArea">Focus Areas</label>
                                    <input 
                                        type="text" 
                                        id="focusArea" 
                                        name="focusArea" 
                                        value={focusArea}
                                        onChange={(e) => setFocusArea(e.target.value)}
                                        placeholder="e.g. Project Management, Design, Development"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="availabilityStatus">Availability Status</label>
                                    <input 
                                        type="text" 
                                        id="availabilityStatus" 
                                        name="availabilityStatus" 
                                        value={availabilityStatus}
                                        onChange={(e) => setAvailabilityStatus(e.target.value)}
                                        placeholder="e.g. Available, Busy, Do Not Disturb"
                                    />
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
                                    <input 
                                        type="password" 
                                        id="currentPassword" 
                                        name="currentPassword" 
                                        value={currentPassword} 
                                        readOnly 
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="newPassword">New Password</label>
                                    <input 
                                        type="password" 
                                        id="newPassword" 
                                        name="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input 
                                        type="password" 
                                        id="confirmPassword" 
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                    />
                                </div>
                                {passwordError && <div className="error-message">{passwordError}</div>}
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