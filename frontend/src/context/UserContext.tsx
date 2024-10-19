// src/contexts/UserContext.tsx
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string
  name: string
  account: string
  password: string
  department: string
  age : number
  position: string
  seniority: number
  region: string
  wallet: number
  score: number
  // Add other user-related fields as needed
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshWallet: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  refreshWallet: async () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const refreshWallet = async () => {
    if (user) {
      const response = await axios.get(`/api/employee/get_wallet/${user.id}`);
      setUser({ ...user, wallet: response.data });
    }
  };

  // Load user from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    let intervalID: NodeJS.Timeout;
    if (user) {
      intervalID = setInterval(() => {
        refreshWallet();
      }, 5000); // 10 seconds
    }
    return () => clearInterval(intervalID);
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
