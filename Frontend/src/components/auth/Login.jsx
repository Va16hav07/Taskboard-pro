import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Login() {
  const { signInWithGoogle, currentUser, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome to TaskBoard Pro</h2>
        <p>Collaborative project management platform</p>
        
        {error && <p className="auth-error">{error}</p>}
        
        <button 
          onClick={handleGoogleSignIn} 
          className="google-signin-btn"
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
            alt="Google logo" 
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
