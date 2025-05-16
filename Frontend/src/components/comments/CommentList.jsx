import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { getTaskComments } from '../../services/commentService';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import './Comments.css';

function CommentList({ taskId, projectId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const { socket } = useSocket();
  const [debugMode, setDebugMode] = useState(false);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await getTaskComments(taskId);
      setComments(data);
      setError(null);
    } catch (err) {
      setError('Failed to load comments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    
    // Listen for real-time comment updates
    if (socket) {
      socket.on('comment-added', (data) => {
        if (data.taskId === taskId) {
          setComments(prev => [...prev, data.comment]);
        }
      });
      
      socket.on('comment-deleted', (data) => {
        if (data.taskId === taskId) {
          setComments(prev => prev.filter(comment => comment._id !== data.commentId));
        }
      });
    }
    
    return () => {
      if (socket) {
        socket.off('comment-added');
        socket.off('comment-deleted');
      }
    };
  }, [taskId, socket]);

  const handleCommentAdded = (newComment) => {
    setComments([...comments, newComment]);
  };

  const handleCommentDeleted = (commentId) => {
    setComments(comments.filter(comment => comment._id !== commentId));
  };

  const handleRefreshToken = async () => {
    try {
      // Force Firebase to refresh the token
      if (currentUser) {
        const newToken = await currentUser.getIdToken(true);
        console.log("Token refreshed, fetching comments again...");
        fetchComments();
      }
    } catch (err) {
      console.error("Error refreshing token:", err);
    }
  };

  if (loading && comments.length === 0) {
    return <div className="comment-loading">Loading comments...</div>;
  }

  return (
    <div className="comments-container">
      <h3 className="comments-header">
        Comments ({comments.length})
        {debugMode && (
          <button 
            className="debug-btn" 
            onClick={handleRefreshToken}
            title="Refresh auth token"
          >
            🔄
          </button>
        )}
        <span 
          className="debug-toggle" 
          onClick={() => setDebugMode(!debugMode)}
          title="Toggle debug mode"
        >
          {debugMode ? "🐞" : "⚙️"}
        </span>
      </h3>
      
      {error && (
        <div className="comment-error">
          {error}
          {debugMode && (
            <button onClick={fetchComments} className="retry-btn">
              Retry
            </button>
          )}
        </div>
      )}
      
      <div className="comment-list">
        {comments.length > 0 ? (
          comments.map(comment => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUserId={currentUser?.uid}
              onDeleted={handleCommentDeleted}
              projectId={projectId}
            />
          ))
        ) : (
          <div className="no-comments">No comments yet</div>
        )}
      </div>
      
      <div className="comment-form-container">
        <CommentForm 
          taskId={taskId} 
          onCommentAdded={handleCommentAdded} 
        />
      </div>
    </div>
  );
}

export default CommentList;
