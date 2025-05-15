import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedLink, setSelectedLink] = useState('');
  const [email, setEmail] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/events');
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
    setLoading(false);
  };

  const scrapeEvents = async () => {
    try {
      await axios.post('http://localhost:5000/api/scrape');
      fetchEvents();
    } catch (err) {
      console.error('Scraping failed:', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleBuyTicket = (link) => {
    setSelectedLink(link);
    setShowModal(true);
  };

 const handleEmailSubmit = async () => {
  if (email.trim()) {
    try {
      await axios.post('http://localhost:5000/api/subscribe', { email });
      setShowModal(false);
      window.open(selectedLink, '_blank');
      setEmail('');
    } catch (err) {
      console.error('Error saving email:', err);
      alert('Failed to save email. Please try again.');
    }
  } else {
    alert('Please enter a valid email address');
  }
};


  return (
    <div className="app-container">
      <header className="header">
        <h1 className="heading">🎉 Sydney Events</h1>
        <button className="scrape-button" onClick={scrapeEvents}>
          Get Latest Events
        </button>
      </header>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#333' }}>Loading events...</p>
      ) : (
        <div className="flex-container">
          {events.map((event, index) => (
            <div key={index} className="card">
              <img
                src={event.image_url !== 'N/A' ? event.image_url : 'https://via.placeholder.com/300'}
                alt="Event"
              />
              <h2 className="title">{event.title}</h2>
              <p className="detail"><strong>Category:</strong> {event.category}</p>
              <p className="detail"><strong>Location:</strong> {event.location}</p>
              <p className="detail"><strong>Date:</strong> {event.date}</p>
              <button
                className="ticket-button"
                onClick={() => handleBuyTicket(event.link)}
              >
                🎫 Buy Ticket
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Enter your email before redirecting</h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            <div className="modal-buttons">
              <button onClick={handleEmailSubmit}>Continue</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
