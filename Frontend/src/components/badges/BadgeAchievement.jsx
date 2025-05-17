import { useEffect } from 'react';
import './Badges.css';

/**
 * Component to display badge achievement notifications
 */
function BadgeAchievement({ badge, onClose, duration = 5000 }) {
  useEffect(() => {
    // Automatically close the notification after the specified duration
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    
    // Clean up the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [onClose, duration]);
  
  // Get the appropriate icon for this badge type
  const getIcon = () => {
    const type = badge.name?.toLowerCase() || 'default';
    
    if (type.includes('task')) return '🏆';
    if (type.includes('problem') || type.includes('solution')) return '🔍';
    if (type.includes('team')) return '👥';
    if (type.includes('star') || type.includes('productivity')) return '⭐';
    if (type.includes('fast') || type.includes('quick')) return '⚡';
    return '🏅';
  };
  
  return (
    <div className="badge-achievement">
      <div className="achievement-icon">{getIcon()}</div>
      <div className="achievement-content">
        <h4>New Badge Earned!</h4>
        <p>{badge.name || 'Achievement unlocked'}</p>
      </div>
    </div>
  );
}

export default BadgeAchievement;
