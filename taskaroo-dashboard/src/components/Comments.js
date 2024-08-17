import React, { useState, useEffect } from 'react';
import '../styles/Comments.css';

function Comments() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ title: '', content: '' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch('http://localhost:8080/comments');
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComment(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment),
      });
      const data = await response.json();
      setComments(prev => [...prev, data]);
      setNewComment({ title: '', content: '' });
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="comments card">
      <h3>New comments</h3>
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>
            <strong>{comment.title}</strong>
            <span>{comment.content}</span>
          </li>
        ))}
      </ul>
      {isAdding ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={newComment.title}
            onChange={handleInputChange}
            placeholder="Title"
            required
          />
          <input
            type="text"
            name="content"
            value={newComment.content}
            onChange={handleInputChange}
            placeholder="Comment"
            required
          />
          <button type="submit">Add</button>
        </form>
      ) : (
        <button className="add-button" onClick={handleAddClick}>+ Add</button>
      )}
    </div>
  );
}

export default Comments;