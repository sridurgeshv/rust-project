import React from 'react';
import '../styles/Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo-section">
        <div className="logo">TK</div>
        <h1>Taskaroo</h1>
      </div>
      <ul className="menu">
        <li className="menu-item active">
          <span className="icon" role="img" aria-label="Dashboard">📊</span>
          <span>Dashboard</span>
        </li>
        <li className="menu-item">
          <span className="icon" role="img" aria-label="My tasks">📝</span>
          <span>My tasks</span>
        </li>
        <li className="menu-item">
          <span className="icon" role="img" aria-label="Notifications">🔔</span>
          <span>Notifications</span>
        </li>
      </ul>
      <ul className="logout">
        <li className="menu-item">
          <span className="icon" role="img" aria-label="Settings">⚙️</span>
          <span>Settings</span>
        </li>
        <li className="menu-item">
          <span className="icon" role="img" aria-label="Log Out">🚪</span>
          <span>Log Out</span>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;