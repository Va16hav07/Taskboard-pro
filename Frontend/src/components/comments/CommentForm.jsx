import { useState, useRef, useEffect } from 'react';
import { createComment } from '../../services/commentService';
import { SpinnerIcon } from '../common/Icons';
import './Comments.css';

function CommentForm({ taskId, onCommentAdded }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef(null);

  const MAX_CHARS = 1000;
  
  useEffect(() => {
    setCharCount(content.length);
  }, [content]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() || content.length > MAX_CHARS) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      const newComment = await createComment({
        taskId,
        content: content.trim()
      });
      
      setContent('');
      setCharCount(0);
      onCommentAdded(newComment);
      
      // Focus the textarea again for quick follow-up comments
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    } catch (err) {
      setError('Failed to post comment');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (content.trim() && content.length <= MAX_CHARS) {
        handleSubmit(e);
      }
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
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
      
      <textarea
        ref={textareaRef}
        className="comment-input"
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSubmitting}
        maxLength={MAX_CHARS + 1} // Allow one more to show the warning
      />
      
      <div className="comment-form-actions">
        <span className="comment-form-info">
          {charCount > 0 && `${charCount}/${MAX_CHARS} characters • Press Ctrl+Enter to post`}
          {charCount > MAX_CHARS && (
            <span className="text-danger-500"> (Limit exceeded)</span>
          )}
        </span>
        
        <button 
          type="submit" 
          className="post-comment-btn"
          disabled={!content.trim() || isSubmitting || charCount > MAX_CHARS}
        >
          {isSubmitting ? (
            <>
              <SpinnerIcon className="w-4 h-4" />
              Posting...
            </>
          ) : (
            <>Post Comment</>
          )}
        </button>
      </div>
    </form>
  );
}

export default CommentForm;
