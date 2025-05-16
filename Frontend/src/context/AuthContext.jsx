import { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { 
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError('');
      const result = await signInWithPopup(auth, googleProvider);
      
      // Get a token from our backend instead of Firebase
      // This simplifies the backend auth flow
      const response = await axios.post(`${API_URL}/auth/token`, {
        uid: result.user.uid,
        email: result.user.email,
        name: result.user.displayName
      });
      
      const token = response.data.token;
      localStorage.setItem('authToken', token);
      
      // Create or update user in backend
      await axios.post(`${API_URL}/users`, {
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        uid: result.user.uid
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return result.user;
    } catch (err) {
      console.error("Error during sign in:", err);
      setError('Failed to sign in with Google');
      throw err;
    }
  };

  // Sign out
  const logOut = () => {
    localStorage.removeItem('authToken');
    return signOut(auth);
  };

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signInWithGoogle,
    logOut,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
