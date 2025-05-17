import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { deleteComment } from '../../services/commentService';
import { TrashIcon } from '../common/Icons';
import './Comments.css';

function CommentItem({ comment, currentUserId, onDeleted, projectId }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(null);
  
  const isAuthor = comment.author.userId === currentUserId;
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteComment(comment._id);
      onDeleted(comment._id);
    } catch (err) {
      setError('Failed to delete comment');
      console.error(err);
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };
  
  const formatDate = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };
  
  return (
    <div className={`comment-item ${isDeleting ? 'deleting' : ''}`}>
      {error && (
        <div className="comment-error">
          <span className="error-icon">⚠️</span>
          {error}
          <button 
            className="retry-btn" 
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}
      
      <div className="comment-header">
        <div className="comment-author">
          {comment.author.photoURL ? (
            <img 
              src={comment.author.photoURL} 
              alt={comment.author.name}
              className="author-avatar"
            />
          ) : (
            <div className="author-initial" style={{ backgroundColor: generateColorFromName(comment.author.name) }}>
              {comment.author.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="author-info">
            <span className="author-name">{comment.author.name}</span>
            <span className="comment-date">{formatDate(comment.createdAt)}</span>
          </div>
        </div>
        
        {isAuthor && (
          <div className="comment-actions">
            {showConfirm ? (
              <div className="delete-confirm">
                <button 
                  className="confirm-yes"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Yes"}
                </button>
                <button 
                  className="confirm-no"
                  onClick={() => setShowConfirm(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                className="delete-comment-btn"
                onClick={() => setShowConfirm(true)}
                disabled={isDeleting}
                aria-label="Delete comment"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="comment-content">
        {comment.content}
      </div>
    </div>
  );
}

// Helper function to generate consistent colors from name
function generateColorFromName(name) {
  const colors = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#84cc16',
    '#06b6d4', '#6366f1', '#d946ef', '#f59e0b', '#10b981'
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

export default CommentItem;
