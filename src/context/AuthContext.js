import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { AuthService } from "../services/authService";
import { UserService } from "../services/userService";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // If logged in, fetch full user data from Firestore
          const userData = await UserService.getUserProfile(firebaseUser.uid);
          setUser({ ...firebaseUser, ...userData });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth State Error:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe; // Unsubscribe on unmount
  }, []);

  const login = async (email, password) => {
    try {
      const result = await AuthService.login(email, password);
      // user will be set by onAuthStateChanged
      return result;
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const result = await AuthService.register(name, email, password);
      // user will be set by onAuthStateChanged
      return result;
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = async (idToken) => {
    try {
      const result = await AuthService.loginWithGoogle(idToken);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      throw error;
    }
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
        login, 
        register,
        loginWithGoogle,
        logout,
        updateUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
