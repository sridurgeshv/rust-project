import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Goals.css';

const Goals = () => {
    const [goals, setGoals] = useState([]);
    const [newGoal, setNewGoal] = useState({ title: '', description: '', priority: 'low', dueDate: '' });

    useEffect(() => {
      axios.get('http://127.0.0.1:8080/goals')
        .then(response => {
          const data = response.data.map(goal => ({
            ...goal,
            subGoals: goal.subGoals || [] // Ensure subGoals is an array
          }));
          setGoals(data);
        })
        .catch(error => console.error('Error fetching goals:', error));
    }, []);    

    const addGoal = () => {
      axios.post('http://127.0.0.1:8080/goals', {
        title: newGoal.title,
        description: newGoal.description,
        priority: newGoal.priority,
        due_date: newGoal.dueDate
      })
      .then(response => {
        const newGoalWithSubGoals = { ...response.data, subGoals: [] }; // Initialize subGoals
        setGoals([...goals, newGoalWithSubGoals]);
      })
      .catch(error => console.error('Error adding goal:', error));
    };     

  const updateProgress = (goalId, progress) => {
    axios.put(`http://127.0.0.1:8080/goals/${goalId}/progress`, { progress })
      .then(response => {
        setGoals(goals.map(goal => goal.id === goalId ? response.data : goal));
      })
      .catch(error => console.error('Error updating progress:', error));
  };

  return (
    <div className="goals-container">
      <h2>Goals</h2>
      <div className="goals-list">
        {goals.map(goal => (
          <div key={goal.id} className="goal-item">
            <div className="goal-header">
              <h3>{goal.title}</h3>
              <div className="goal-meta">
                <span className={`priority ${goal.priority}`}>{goal.priority.toUpperCase()}</span>
                <span className="due-date">{goal.dueDate}</span>
              </div>
            </div>
            <p>{goal.description}</p>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${goal.progress}%` }}></div>
            </div>
            <div className="subgoals">
            {goal.subGoals && Array.isArray(goal.subGoals) && goal.subGoals.map(subGoal => (
            <div key={subGoal.id} className="subgoal-item">
              <input
                type="checkbox"
                checked={subGoal.completed}
                onChange={() => updateProgress(goal.id, subGoal.progress)}
              />
              <span>{subGoal.title}</span>
            </div>
          ))}
            </div>
          </div>
        ))}
      </div>

      <div className="add-goal">
        <h3>Add New Goal</h3>
        <input
          type="text"
          placeholder="Title"
          value={newGoal.title}
          onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newGoal.description}
          onChange={e => setNewGoal({ ...newGoal, description: e.target.value })}
        />
        <select
          value={newGoal.priority}
          onChange={e => setNewGoal({ ...newGoal, priority: e.target.value })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="date"
          value={newGoal.dueDate}
          onChange={e => setNewGoal({ ...newGoal, dueDate: e.target.value })}
        />
        <button onClick={addGoal}>Add Goal</button>
      </div>
    </div>
  );
};

export default Goals;