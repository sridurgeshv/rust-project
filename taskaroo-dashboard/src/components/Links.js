import React, { useState, useEffect } from 'react';
import '../styles/Links.css';

function Links() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8080/links')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setLinks(data))
      .catch(error => console.error('Error fetching links:', error));
  }, []);

  const handleAddLink = (e) => {
    e.preventDefault();

    const formattedTitle = newLink.title.charAt(0).toUpperCase() + newLink.title.slice(1);

    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!urlPattern.test(newLink.url)) {
      setErrorMessage('Invalid URL. Please ensure it ends with .com, .in, .ai, etc.');
      return;
    }

    fetch('http://127.0.0.1:8080/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...newLink, title: formattedTitle }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add link');
        }
        return response.json();
      })
      .then(data => {
        setLinks([...links, data]);
        setNewLink({ title: '', url: '' });
        setShowAddForm(false);
        setErrorMessage('');
      })
      .catch(error => {
        console.error('Error adding link:', error);
        setErrorMessage('Failed to add link. Please try again.');
      });
  };

  return (
    <div className="links-container card">
      {!showAddForm ? (
        <>
          <div className="links-header">
            <h3 className="links-title">My Inventory</h3>
            <button className="links-add-button" onClick={() => setShowAddForm(true)}>+</button>
          </div>
          <div className="links-list">
            {links.map(link => (
              <div key={link.id} className="link-item">
                <span className="link-text">{link.title}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="add-link-form">
          <h4 className="add-form-title">Creating a link</h4>
          <form onSubmit={handleAddLink}>
            <input
              type="text"
              className="add-form-input"
              placeholder="Title"
              value={newLink.title}
              onChange={(e) => setNewLink({...newLink, title: e.target.value})}
            />
            <input
              type="text"
              className="add-form-input"
              placeholder="URL"
              value={newLink.url}
              onChange={(e) => setNewLink({...newLink, url: e.target.value})}
            />
            <button type="submit" className="add-form-submit-button">Add</button>
          </form>
          <button className="back-button" onClick={() => setShowAddForm(false)}>Back</button>
        </div>
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
}

export default Links;