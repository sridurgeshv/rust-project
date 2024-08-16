import React from 'react';
import '../styles/Comments.css';

function Comments() {
  return (
    <div className="comments card">
      <h3>New comments</h3>
      <ul>
        <li>
          Market research
          <span> Find my keynote attached...</span>
        </li>
        <li>
          Market research
          <span> I've added the data...</span>
        </li>
      </ul>
    </div>
  );
};

export default Comments;
