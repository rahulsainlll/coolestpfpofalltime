import React, { createContext, useContext, useState, useEffect } from 'react';
import { verifyToken } from '../utils/jwt';

interface UserContextType {
  twitterId: string | null;
  setTwitterId: React.Dispatch<React.SetStateAction<string | null>>;
  login: (token: string, twitterId: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [twitterId, setTwitterId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        setTwitterId(decoded.twitterId);
      } else {
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  const login = (token: string, twitterId: string) => {
    localStorage.setItem('authToken', token);
    setTwitterId(twitterId);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setTwitterId(null);
  };

  return (
    <UserContext.Provider value={{ twitterId, setTwitterId, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}