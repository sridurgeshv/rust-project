import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/WelcomePage.css';
import productivityImage from '../assets/productivity-image.jpg';

const WelcomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="welcome-page">
            <header>
                <div className="logo">PH</div>
                <div className="header-buttons">                    
                    <button className="get-started-btn" onClick={() => navigate('/auth')}>Get Started</button>
                </div>
            </header>
            <main>
                <div className="welcome-content">
                    <h1>Welcome to ProductivityHub</h1>
                    <p>Welcome to ProductivityHub! Boost your productivity and streamline your workflow with our intuitive tools. We empower you to tackle challenges and stay organized, providing customizable solutions that help you focus on achieving your goals efficiently.</p>
                    <button className="learn-more-btn" onClick={() => navigate('/about')}>Learn More</button>
                </div>
                <div className="image-container">
                    <img src={productivityImage} alt="Productivity" className="productivity-image" />
                </div>
            </main>
            <div className="background-shape"></div>
        </div>
    );
};

export default WelcomePage;