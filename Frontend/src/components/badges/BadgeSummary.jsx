import { useState, useEffect } from 'react';
import { getUserProfile } from '../../services/profileService';
import BadgeCard from './BadgeCard';
import './Badges.css';

function BadgeSummary() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profile = await getUserProfile();
        setUserProfile(profile);
        setError(null);
      } catch (err) {
        setError('Failed to load user profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
  
  if (loading) {
    return (
      <div className="loading-spinner">
        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Loading your achievements...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-message">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        {error}
      </div>
    );
  }
  
  if (!userProfile || !userProfile.badges) {
    return (
      <div className="empty-badges">
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7"></circle>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
        </svg>
        <p>No achievement information available</p>
        <p className="hint">Complete tasks to start collecting achievements!</p>
      </div>
    );
  }
  
  const { badges } = userProfile;
  const badgeTypes = Object.entries(badges.types || {}).filter(([_, count]) => count > 0);
  
  const filteredBadges = filterType === 'all' 
    ? badgeTypes 
    : badgeTypes.filter(([type]) => type === filterType);
  
  const totalCount = badgeTypes.reduce((acc, [_, count]) => acc + count, 0);
  
  return (
    <div className="badges-summary">
      <div className="badges-summary-header">
        <h2>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="7"></circle>
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
          </svg>
          Your Achievements
        </h2>
        <div className="total-badges">
          <span className="total-badge-icon">🏅</span>
          <span className="total-badge-count">{totalCount || 0}</span>
          <span className="total-badge-label">Total Badges</span>
        </div>
      </div>
      
      {badgeTypes.length > 0 && (
        <div className="badges-filter">
          <button 
            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All
          </button>
          {badgeTypes.map(([type]) => (
            <button 
              key={type}
              className={`filter-btn ${filterType === type ? 'active' : ''}`}
              onClick={() => setFilterType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1')}
            </button>
          ))}
        </div>
      )}
      
      {badgeTypes.length > 0 ? (
        <div className="badge-cards">
          {filteredBadges.map(([type, count], index) => (
            <BadgeCard 
              key={type} 
              type={type} 
              count={count} 
              animate={true}
            />
          ))}
        </div>
      ) : (
        <div className="empty-badges">
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="7"></circle>
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
          </svg>
          <p>You haven't earned any badges yet.</p>
          <p>Complete tasks to earn recognition!</p>
        </div>
      )}
    </div>
  );
}

export default BadgeSummary;
