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
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  
  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError('');
      const result = await signInWithPopup(auth, googleProvider);
      
      // Get Firebase ID token
      const firebaseToken = await result.user.getIdToken();
      
      // Get a token from our backend
      const response = await axios.post(`${API_URL}/auth/token`, {
        uid: result.user.uid,
        email: result.user.email,
        name: result.user.displayName
      });
      
      const backendToken = response.data.token;
      localStorage.setItem('authToken', backendToken);
      setToken(backendToken);
      
      // Create or update user in backend
      await axios.post(`${API_URL}/users`, {
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        uid: result.user.uid
      }, {
        headers: {
          'Authorization': `Bearer ${backendToken}`
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
    setToken(null);
    return signOut(auth);
  };

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Always refresh token when user is detected
          const firebaseToken = await user.getIdToken(true); // Force token refresh
          
          const response = await axios.post(`${API_URL}/auth/token`, {
            uid: user.uid,
            email: user.email,
            name: user.displayName
          });
          
          const backendToken = response.data.token;
          localStorage.setItem('authToken', backendToken);
          setToken(backendToken);
          
          // Clear any cached API responses
          if (window.caches) {
            try {
              const cacheNames = await window.caches.keys();
              await Promise.all(
                cacheNames.map(cacheName => window.caches.delete(cacheName))
              );
            } catch (cacheError) {
              console.error("Error clearing cache:", cacheError);
            }
          }
        } catch (err) {
          console.error("Error refreshing token:", err);
          // Clear potentially invalid tokens
          localStorage.removeItem('authToken');
          setToken(null);
        }
      } else {
        localStorage.removeItem('authToken');
        setToken(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    token,
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
