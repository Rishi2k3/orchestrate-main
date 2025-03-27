import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  // 🛠️ Filtering logic
  const filteredEvents = events.filter((event) => {
    const searchMatch = event.eventName.toLowerCase().includes(search.toLowerCase());
    const statusMatch = statusFilter ? event.status === statusFilter : true;
    const eventMatch = eventFilter ? event.eventType === eventFilter : true;
    
    return searchMatch && statusMatch && eventMatch;
  });

  const handleEventClick = (eventId) => {
    navigate(`/tasks/${eventId}`);
  };

  const handleButtonClick = (event, eventId) => {
    event.stopPropagation();  // ✅ Prevent card click
    navigate(`/tasks/${eventId}`);
  };

  return (
    <div className="dashboard">
      <h1>Manage Your Events</h1>

      <div className="filters">
        {/* 🔎 Search Filter */}
        <label htmlFor="search">Search by Event Name:</label>
        <input
          id="search"
          name="search"
          type="text"
          placeholder="Search by event name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* 🛠️ Event Type Filter */}
        <label htmlFor="eventFilter">Filter by Event Type:</label>
        <select
          id="eventFilter"
          name="eventFilter"
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="team-specific">Team-Specific</option>
          <option value="company-wide">Company-Wide</option>
        </select>
      </div>

      {/* 🛠️ Display Events */}
      <div className="event-list">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div 
              key={event._id} 
              className="event-card" 
              onClick={() => handleEventClick(event._id)}   // ✅ Card click
            >
              <h3>{event.eventName}</h3> {/* Only show event name */}
              <p><strong>Type:</strong> {event.eventType}</p> {/* Only show event type */}
              
              {/* ✅ Button click */}
              <button onClick={(e) => handleButtonClick(e, event._id)}>View Tasks</button>
            </div>
          ))
        ) : (
          <p>No events available</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
