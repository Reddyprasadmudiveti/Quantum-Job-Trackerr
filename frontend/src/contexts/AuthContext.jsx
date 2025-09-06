import  { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  useEffect(() => {
    // Check if user is logged in on app start
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        // Verify token with backend
        const response = await fetch('http://localhost:3000/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: storedToken }),
        });

        const data = await response.json();

        if (data.valid) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } else {
          // Token is invalid, clear storage
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
      }
    }

    setLoading(false);
  };

  const login = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);

      // Clear session on server
      await fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include' // Important for sending cookies
      });
      
      // Clear client state
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Clear cookies by setting expiration in the past
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.trim().split('=');
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if server logout fails, clear client state
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Clear cookies by setting expiration in the past
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.trim().split('=');
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
      
      setLoading(false);
    }
  }, []);

  const googleLogin = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/auth/status');
      const status = await response.json();

      if (!status.googleOAuth) {
        alert('Google OAuth is not configured yet. Please check the server setup guide.');
        return;
      }

      window.location.href = 'http://localhost:3000/auth/google';

    } catch (error) {
      console.error('Error checking OAuth status:', error);
      // Try anyway in case server is not responding
      window.location.href = 'http://localhost:3000/auth/google';
    }
  }, []);

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    googleLogin,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};