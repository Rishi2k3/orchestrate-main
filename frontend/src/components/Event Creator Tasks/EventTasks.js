import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Tasks.css';

const EventTasks = () => {
  const { eventId } = useParams(); // Event ID from URL
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState(''); // Filter by status
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tasks?eventId=${eventId}`);
        setTasks(response.data);
        setFilteredTasks(response.data); // Initially, no filter applied
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [eventId]);

  useEffect(() => {
    // Filter tasks by status
    let filtered = tasks;
    if (statusFilter) {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }
    setFilteredTasks(filtered);
  }, [statusFilter, tasks]);

  const handleTaskClick = (taskId) => {
    navigate(`/task/${taskId}`); // Navigate to individual task details
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="tasks-container">
      <h1>Tasks for Event</h1>

      {/* ✅ Filter by Status Only */}
      <div className="filters">
        <select value={statusFilter} onChange={handleStatusFilterChange}>
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {filteredTasks.length > 0 ? (
        <div className="tasks-list">
          {filteredTasks.map((task) => (
            <div key={task._id} className="task-card" onClick={() => handleTaskClick(task._id)}>
              <p><strong>Id no :</strong> {task._id}</p>
              <p><strong>Status:</strong> {task.status}</p> {/* Only displaying status */}
              <button onClick={() => handleTaskClick(task._id)}>View Details</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No tasks found for this event.</p>
      )}
    </div>
  );
};

export default EventTasks;
