import { useAuth } from '../../context/AuthContext';
import { removeUserFromProject } from '../../services/projectService';
import './Projects.css';

function MembersList({ members, projectId, onMemberRemoved, isOwner }) {
  const { currentUser } = useAuth();
  
  const handleRemoveMember = async (userId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        await removeUserFromProject(projectId, userId);
        onMemberRemoved();
      } catch (err) {
        console.error('Failed to remove member:', err);
      }
    }
  };
  
  return (
    <div className="members-list">
      {members.map(member => (
        <div key={member.email} className="member-item">
          <div className="member-info">
            <span className="member-email">{member.email}</span>
            <span className={`member-role ${member.role}`}>{member.role}</span>
            {member.userId === null && <span className="pending-tag">Pending</span>}
          </div>
          {isOwner && currentUser?.email !== member.email && (
            <button 
              className="remove-member-btn" 
              onClick={() => handleRemoveMember(member.userId)}
            >
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default MembersList;
