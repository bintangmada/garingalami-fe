import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('garing_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('garing_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('garing_user');
    }
  }, [user]);

  const loginWithGoogle = async (credentialResponse) => {
    setLoading(true);
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      
      // Prepare user data for backend
      const payload = {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        googleId: decoded.sub
      };

      // Call backend to verify and auto-register
      const response = await fetch('http://localhost:8080/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Backend authentication failed");

      const data = await response.json();
      
      const userData = {
        ...data.user,
        token: data.token
      };

      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginAsDevGuest = async () => {
    setLoading(true);
    try {
      const payload = {
        email: "testuser@garingalami.com",
        name: "Test User",
        picture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
        googleId: "dev_mock_12345"
      };

      const response = await fetch('http://localhost:8080/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Backend authentication failed");

      const data = await response.json();
      
      const userData = {
        ...data.user,
        token: data.token
      };

      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Dev guest login failed", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, loginAsDevGuest, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
