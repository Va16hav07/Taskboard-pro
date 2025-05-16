import { useAuth } from '../../context/AuthContext';
import { removeUserFromProject } from '../../services/projectService';
import './Projects.css';

function MembersList({ members, projectId, onMemberRemoved, isOwner }) {
  const { currentUser } = useAuth();
  
  const handleRemoveMember = async (member) => {
    if (!isOwner) {
      return; // Only owners can remove members
    }
    
    // Cannot remove yourself as an owner
    if (member.email === currentUser.email) {
      alert('Cannot remove yourself as project owner');
      return;
    }
    
    if (window.confirm(`Are you sure you want to remove ${member.email} from this project?`)) {
      try {
        // Use either userId or email to identify the member
        const memberIdentifier = member.userId || member.email;
        await removeUserFromProject(projectId, memberIdentifier);
        onMemberRemoved();
      } catch (err) {
        console.error('Failed to remove member:', err);
        alert('Failed to remove member. Please try again.');
      }
    }
  };
  
  const getInitials = (email) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };
  
  const getRandomColor = (email) => {
    const colors = [
      '#2563eb', '#7c3aed', '#db2777', '#ea580c', '#65a30d',
      '#0891b2', '#4f46e5', '#c026d3', '#d97706', '#059669'
    ];
    
    // Use a hash of the email to pick a consistent color
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };
  
  return (
    <div className="members-list">
      {members.map(member => (
        <div key={member.email} className="member-item">
          <div className="member-info">
            <div 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: getRandomColor(member.email),
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                marginRight: '8px'
              }}
            >
              {getInitials(member.email)}
            </div>
            <div>
              <span className="member-email">{member.email}</span>
              <div style={{display: 'flex', gap: '6px', marginTop: '3px'}}>
                <span className={`member-role ${member.role}`}>{member.role}</span>
                {member.userId === null && <span className="pending-tag">Pending</span>}
              </div>
            </div>
          </div>
          {isOwner && member.email !== currentUser?.email && (
            <button 
              className="remove-member-btn" 
              onClick={() => handleRemoveMember(member)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="18" y1="8" x2="23" y2="13"></line>
                <line x1="23" y1="8" x2="18" y2="13"></line>
              </svg>
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default MembersList;
