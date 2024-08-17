import React, { useState, useEffect } from 'react';
import '../styles/Comments.css';

function Comments() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ title: '', content: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewComment({ title: '', content: '' });
  };

  const handleInputChange = (e, id = null) => {
    const { name, value } = e.target;
    if (id !== null) {
      setComments(comments.map(comment => 
        comment.id === id ? { ...comment, [name]: value } : comment
      ));
    } else {
      setNewComment(prev => ({ ...prev, [name]: value }));
    }
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

  const handleEdit = (id) => {
    setEditingId(id);
    setIsMenuOpen(false);
  };

  const handleSaveEdit = async (id) => {
    try {
      const commentToUpdate = comments.find(comment => comment.id === id);
      const response = await fetch(`http://localhost:8080/comments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentToUpdate),
      });
      if (response.ok) {
        setEditingId(null);
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  return (
    <div className="comments card">
      <div className="comments-header">
        <h3>New comments</h3>
        <button className="menu-dots" onClick={() => setIsMenuOpen(!isMenuOpen)}>⋮</button>
        {isMenuOpen && (
          <div className="menu-dropdown">
            <button onClick={() => handleEdit(null)}>Edit</button>
          </div>
        )}
      </div>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id} className={editingId === comment.id ? 'editing' : ''}>
            {editingId === comment.id ? (
              <>
                <input
                  type="text"
                  name="title"
                  value={comment.title}
                  onChange={(e) => handleInputChange(e, comment.id)}
                />
                <input
                  type="text"
                  name="content"
                  value={comment.content}
                  onChange={(e) => handleInputChange(e, comment.id)}
                />
                <button onClick={() => handleSaveEdit(comment.id)}>Save</button>
              </>
            ) : (
              <>
                <strong>{comment.title}</strong>
                <span>{comment.content}</span>
              </>
            )}
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
          <div className="form-buttons">
            <button type="submit">Add</button>
            <button type="button" onClick={handleCancelAdd}>Cancel</button>
          </div>
        </form>
      ) : (
        <button className="add-button" onClick={handleAddClick}>+ Add</button>
      )}
    </div>
  );
}

export default Comments;