import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar() {
    return (
        <div className="sidebar">
            <div className="logo-section">
                <div className="logo">PH</div>
                <h1>Productivity Hub</h1>
            </div>
            <nav className="menu">
                <NavLink to="/dashboard" className="menu-item" activeClassName="active">
                    <span className="icon" role="img" aria-label="Dashboard">📊</span>
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/my-tasks" className="menu-item" activeClassName="active">
                    <span className="icon" role="img" aria-label="My tasks">📝</span>
                    <span>My tasks</span>
                </NavLink>
                <NavLink to="/goals" className="menu-item" activeClassName="active">
                    <span className="icon" role="img" aria-label="Goals">🏆</span>
                    <span>Goals</span>
                </NavLink>
            </nav>
            <nav className="logout">
                <NavLink to="/settings" className="menu-item" activeClassName="active">
                    <span className="icon" role="img" aria-label="Settings">⚙️</span>
                    <span>Settings</span>
                </NavLink>
                <NavLink to="/logout" className="menu-item" activeClassName="active">
                    <span className="icon" role="img" aria-label="Log Out">🚪</span>
                    <span>Log Out</span>
                </NavLink>
            </nav>
        </div>
    );
}

export default Sidebar;