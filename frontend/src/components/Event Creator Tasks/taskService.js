import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks";  // ✅ Correct Backend Task URL

// ✅ Centralized function for headers
const getHeaders = () => {
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail');

  if (!token || !userEmail) {
    console.error("❗ Token or userEmail missing. Please log in.");
    throw new Error("Token or userEmail missing.");
  }

  return {
    Authorization: `Bearer ${token}`,
    "user-email": userEmail,
  };
};

// ✅ Logging function
const logData = (label, data) => {
  console.log(`✅ ${label}:`, data);
};

// ✅ Fetch all tasks
export const fetchTasks = async () => {
  try {
    const response = await axios.get(API_URL, { headers: getHeaders() });
    logData('Fetched All Tasks', response.data);
    return response.data;
  } catch (error) {
    console.error('❗ Error fetching tasks:', error.response?.data?.message || error.message);
    throw error;
  }
};

// ✅ Fetch a task by ID → Correct route
export const fetchTaskById = async (taskId) => {
  try {
    const response = await axios.get(`${API_URL}/assigned/${taskId}`, { headers: getHeaders() });  // ✅ Correct route
    logData(`Fetched Task Data for ID ${taskId}`, response.data);
    return response.data;
  } catch (error) {
    console.error(`❗ Error fetching task ${taskId}:`, error.response?.data?.message || error.message);
    throw error;
  }
};

// ✅ Fetch tasks by Event ID (keeping it)
export const fetchTasksByEventId = async (eventId) => {
  try {
    const response = await axios.get(`${API_URL}/events/${eventId}/tasks`, {
      headers: getHeaders(),
    });
    logData(`Fetched Tasks for Event ID ${eventId}`, response.data);
    return response.data;
  } catch (error) {
    console.error(`❗ Error fetching tasks for event ${eventId}:`, error.response?.data?.message || error.message);
    throw error;
  }
};

// ✅ Add Comment to a Task (no change)
export const addCommentToTask = async (taskId, message) => {
  try {
    const response = await axios.post(`${API_URL}/${taskId}/comments`,
      { message },
      { headers: getHeaders() }
    );

    logData(`Comment Added to Task ${taskId}`, response.data);
    return response.data;
  } catch (error) {
    console.error(`❗ Error adding comment to task ${taskId}:`, error.response?.data?.message || error.message);
    throw error;
  }
};
