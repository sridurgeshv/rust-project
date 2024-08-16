import React from 'react';
import '../styles/Categories.css';

function Categories() {
  return (
    <div className="categories card">
      <h3>My categories</h3>
      <ul>
        <li>
          <img src="avatar1.jpg" alt="avatar" />
          Work
        </li>
        <li>
          <img src="avatar2.jpg" alt="avatar" />
          Family
        </li>
        <li>
          <img src="avatar3.jpg" alt="avatar" />
          Freelance work 01
        </li>
        <li>
          <img src="avatar4.jpg" alt="avatar" />
          Conference planning
        </li>
      </ul>
    </div>
  );
}

export default Categories;