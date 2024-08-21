import React from 'react';
import '../styles/VoiceAssistantIcon.css';

function VoiceAssistantIcon({ onClick }) {
    return (
        <div className="voice-assistant-icon" onClick={onClick}>
            <img src="/voice-icon.png" alt="Voice Assistant" />
        </div>
    );
}

export default VoiceAssistantIcon;
