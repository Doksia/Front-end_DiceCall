import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('roleapp_token');
    const savedUser = localStorage.getItem('roleapp_user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser)); 
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('roleapp_token', token);
    localStorage.setItem('roleapp_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('roleapp_token');
    localStorage.removeItem('roleapp_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};