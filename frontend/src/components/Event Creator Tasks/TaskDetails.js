import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Tasks.css';

const TaskDetails = () => {
  const { taskId } = useParams();   // ✅ Use taskId instead of id
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // ✅ Fetch Task by ID
  useEffect(() => {
    const loadTask = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tasks/assigned/${taskId}`);
        setTask(response.data);
        setComments(response.data.comments || []);
      } catch (error) {
        console.error('Error fetching task:', error);
        setError('Failed to load task');
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [taskId]);

  // ✅ Add Comment
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const author = JSON.parse(localStorage.getItem('user'))?.email;
      console.log(author);
      await axios.post(`http://localhost:5000/api/tasks/assigned/${taskId}/comments`, {
        author,
        message: newComment,
      });

      // ✅ Add comment locally
      setComments([...comments, {
        author,
        message: newComment,
        timestamp: new Date().toISOString(),
      }]);

      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="task-details">
      <h1>{task?.taskName}</h1>
      <p><strong>Event:</strong> {task?.eventName}</p>
      <p><strong>Description:</strong> {task?.description}</p>
      <p><strong>Status:</strong> {task?.status}</p>

      {/* ✅ Comments Section */}
      {/* <h3>Comments</h3>
      <div className="comments">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="comment">
              <p>{comment.message}</p>
              <small>{comment.author} - {new Date(comment.timestamp).toLocaleString()}</small>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>

      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment..."
      /> */}
      {/* <button onClick={handleCommentSubmit}>Add Comment</button>

      <button onClick={() => navigate(-1)}>Back</button> */}

<h3>Comments</h3>
      <div className="comments">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="comment">
              <p>{comment.message}</p>
              <small>
                {comment.author} - {new Date(comment.timestamp).toLocaleString()}
              </small>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>

      {/* ✅ Comment Form */}
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment..."
      />
      <button onClick={handleCommentSubmit}>Add Comment</button>

      <button onClick={() => navigate(-1)}>Back</button>
    {/* </div> */}
    </div>
  );
};

export default TaskDetails;

