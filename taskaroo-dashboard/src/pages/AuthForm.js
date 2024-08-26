import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthForm.css';

const AuthForm = ({ onLogin }) => {
    const [isSignIn, setIsSignIn] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleToggle = () => {
        setIsSignIn(!isSignIn);
        setUsername('');
        setPassword('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isSignIn ? 'signin' : 'signup';
        try {
            const response = await fetch(`http://localhost:8080/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (data.success) {
                if (isSignIn) {
                    localStorage.setItem('token', data.token); // Assuming the server returns a token
                    onLogin();
                    navigate('/dashboard');
                } else {
                    // If sign up is successful, switch to sign in
                    setIsSignIn(true);
                    alert('Sign up successful. Please sign in.');
                }
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card-switch">
                <label className="auth-switch">
                    <input type="checkbox" className="auth-toggle" checked={!isSignIn} onChange={handleToggle} />
                    <span className="auth-slider"></span>
                    <span className="auth-card-side"></span>
                    <div className="auth-flip-card__inner">
                        <div className="auth-flip-card__front">
                            <div className="auth-title">Log in</div>
                            <form className="auth-flip-card__form" onSubmit={handleSubmit}>
                                <input
                                    className="auth-flip-card__input"
                                    name="username"
                                    placeholder="Username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <input
                                    className="auth-flip-card__input"
                                    name="password"
                                    placeholder="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button className="auth-flip-card__btn" type="submit">Let's go!</button>
                            </form>
                        </div>
                        <div className="auth-flip-card__back">
                            <div className="auth-title">Sign up</div>
                            <form className="auth-flip-card__form" onSubmit={handleSubmit}>
                                <input
                                    className="auth-flip-card__input"
                                    name="username"
                                    placeholder="Username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <input
                                    className="auth-flip-card__input"
                                    name="password"
                                    placeholder="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button className="auth-flip-card__btn" type="submit">Confirm!</button>
                            </form>
                        </div>
                    </div>
                </label>
            </div>
        </div>
    );
};

export default AuthForm;