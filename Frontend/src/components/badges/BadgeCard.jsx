import './Badges.css';

const badgeIcons = {
  taskMaster: '🏆',
  problemSolver: '🔍',
  teamPlayer: '👥',
  productivityStar: '⭐',
  fastCompleter: '⚡',
  default: '🏅'
};

const badgeTitles = {
  taskMaster: 'Task Master',
  problemSolver: 'Problem Solver',
  teamPlayer: 'Team Player',
  productivityStar: 'Productivity Star',
  fastCompleter: 'Fast Completer',
};

const badgeDescriptions = {
  taskMaster: 'Completed tasks efficiently',
  problemSolver: 'Resolved issues and challenges',
  teamPlayer: 'Collaborated well with team members',
  productivityStar: 'Exceptional productivity',
  fastCompleter: 'Completed tasks before deadlines',
};

const badgeColors = {
  taskMaster: '#3b82f6',
  problemSolver: '#8b5cf6',
  teamPlayer: '#10b981',
  productivityStar: '#f59e0b',
  fastCompleter: '#ef4444',
  default: '#6366f1'
};

function BadgeCard({ type, count, animate = false }) {
  const title = badgeTitles[type] || type;
  const icon = badgeIcons[type] || badgeIcons.default;
  const description = badgeDescriptions[type] || '';
  const color = badgeColors[type] || badgeColors.default;
  
  return (
    <div className={`badge-card ${animate ? 'badge-animate' : ''}`} style={{ borderLeftColor: color }}>
      <div className="badge-icon-container" style={{ backgroundColor: `${color}20` }}>
        <div className="badge-icon-large">{icon}</div>
        {count > 1 && <div className="badge-multiplier">×{count}</div>}
      </div>
      
      <div className="badge-info">
        <h3 style={{ color }}>{title}</h3>
        <p>{description}</p>
        <div className="badge-count">
          <span>Earned:</span> <strong style={{ color }}>{count}</strong>
          <span className="badge-level">
            {count >= 10 ? 'Expert' : count >= 5 ? 'Advanced' : count >= 3 ? 'Intermediate' : 'Beginner'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default BadgeCard;
