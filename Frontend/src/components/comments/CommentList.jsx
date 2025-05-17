import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { getTaskComments } from '../../services/commentService';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import Toggle from '../common/Toggle';
import { SpinnerIcon } from '../common/Icons';
import './Comments.css';

function CommentList({ taskId, projectId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRealTime, setShowRealTime] = useState(true); 
  const commentsEndRef = useRef(null);
  const { currentUser } = useAuth();
  const { socket } = useSocket();

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
    if (socket && showRealTime) {
      socket.on('comment-added', (data) => {
        if (data.taskId === taskId) {
          setComments(prev => [...prev, data.comment]);
          // Scroll to the new comment
          setTimeout(() => {
            commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
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
  }, [taskId, socket, showRealTime]);

  const handleCommentAdded = (newComment) => {
    setComments([...comments, newComment]);
    // Scroll to new comment
    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCommentDeleted = (commentId) => {
    setComments(comments.filter(comment => comment._id !== commentId));
  };

  return (
    <div className="comments-container">
      <div className="comments-header">
        <h3>
          Comments
          <span className="comments-counter">
            {comments.length}
          </span>
        </h3>
        
        <div className="comments-toggle">
          <Toggle 
            checked={showRealTime}
            onChange={(e) => setShowRealTime(e.target.checked)}
            label="Real-time updates"
            size="sm"
            color="primary"
          />
        </div>
      </div>
      
      {error && (
        <div className="comment-error">
          <span className="error-icon">⚠️</span>
          {error}
          <button 
            className="retry-btn" 
            onClick={fetchComments}
          >
            Retry
          </button>
        </div>
      )}
      
      {loading && comments.length === 0 ? (
        <div className="comment-loading">
          <SpinnerIcon className="w-8 h-8 text-primary-500" />
          <p>Loading comments...</p>
        </div>
      ) : (
        <div className="comment-list">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                currentUserId={currentUser?.uid}
                onDeleted={handleCommentDeleted}
                projectId={projectId}
              />
            ))
          ) : (
            <div className="no-comments">
              <p>No comments yet</p>
              <p className="text-sm mt-1">Be the first to leave a comment</p>
            </div>
          )}
          <div ref={commentsEndRef} />
        </div>
      )}
      
      <div className="comments-divider"></div>
      
      <CommentForm 
        taskId={taskId} 
        onCommentAdded={handleCommentAdded} 
      />
    </div>
  );
}

export default CommentList;
