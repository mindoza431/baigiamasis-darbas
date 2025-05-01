import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from '../api/axios';

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get<User>('/api/auth/me')
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Bandoma prisijungti:', email);
      const response = await axios.post<AuthResponse>('/api/auth/login', { email, password });
      console.log('Prisijungimo atsakymas:', response.data);
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setUser(response.data.user);
    } catch (error) {
      console.error('Prisijungimo klaida:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      console.log('Bandoma registruotis:', { name, email });
      const response = await axios.post<AuthResponse>('/api/auth/register', {
        name,
        email,
        password,
      });
      console.log('Registracijos atsakymas:', response.data);
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setUser(response.data.user);
    } catch (error: any) {
      console.error('Registracijos klaida:', error);
      if (error.response) {
        console.error('Serverio atsakymas:', error.response.data);
      } else if (error.request) {
        console.error('Nėra atsakymo iš serverio:', error.request);
      } else {
        console.error('Klaida:', error.message);
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser turi būti naudojamas UserProvider viduje');
  }
  return context;
}; 