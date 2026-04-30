import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simple username-based authentication (no Firebase)
  const setUsername = (username) => {
    setUser({ username });
  };

  const logout = () => {
    setUser(null);
  };

  const updateUserData = (newData) => {
    setUser(prev => prev ? { ...prev, ...newData } : null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        setUsername,
        logout,
        updateUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
