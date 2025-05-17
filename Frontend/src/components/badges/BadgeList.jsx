import { useState, useEffect } from 'react';
import { getUserBadges } from '../../services/automationService';
import './Badges.css';

function BadgeList() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'oldest', 'name'

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true);
        const data = await getUserBadges();
        setBadges(data);
        setError(null);
      } catch (err) {
        setError('Failed to load badges');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  const sortedBadges = [...badges].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.awardedAt) - new Date(a.awardedAt);
    } else if (sortBy === 'oldest') {
      return new Date(a.awardedAt) - new Date(b.awardedAt);
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  // Badge icon based on type
  const getBadgeIcon = (name) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('task')) return '🏆';
    if (nameLower.includes('problem') || nameLower.includes('solution')) return '🔍';
    if (nameLower.includes('team')) return '👥';
    if (nameLower.includes('star') || nameLower.includes('productivity')) return '⭐';
    if (nameLower.includes('fast') || nameLower.includes('quick')) return '⚡';
    return '🏅';
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Loading your badges...</span>
      </div>
    );
  }

  return (
    <div className="badges-container">
      <div className="badges-header">
        <h2>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="7"></circle>
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
          </svg>
          Your Badges
        </h2>
        
        {badges.length > 0 && (
          <div style={{display: 'flex', gap: '16px'}}>
            <div className="view-options" style={{display: 'flex', gap: '8px'}}>
              <button 
                onClick={() => setView('grid')} 
                className={`filter-btn ${view === 'grid' ? 'active' : ''}`}
                aria-label="Grid view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </button>
              <button 
                onClick={() => setView('list')} 
                className={`filter-btn ${view === 'list' ? 'active' : ''}`}
                aria-label="List view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-btn"
              style={{backgroundColor: '#f1f5f9', border: 'none', cursor: 'pointer'}}
            >
              <option value="recent">Recently Earned</option>
              <option value="oldest">Oldest First</option>
              <option value="name">By Name</option>
            </select>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </div>
      )}

      {badges.length === 0 ? (
        <div className="empty-badges">
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="7"></circle>
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
          </svg>
          <p>You haven't earned any badges yet.</p>
          <p className="hint">Complete tasks to earn badges!</p>
        </div>
      ) : (
        <div className={view === 'grid' ? 'badge-grid' : ''}>
          {sortedBadges.map((badge) => (
            <div key={badge._id} className="badge-item">
              <div className="badge-icon">
                {getBadgeIcon(badge.name)}
              </div>
              <div className="badge-details">
                <h3>{badge.name}</h3>
                <p>{badge.description}</p>
                <div className="badge-date">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {new Date(badge.awardedAt).toLocaleDateString(undefined, { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BadgeList;
