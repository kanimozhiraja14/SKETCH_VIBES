import React, { createContext, useContext, useState, useEffect } from 'react';
import type {  User  } from '../types';
import { authAPI } from '../lib/api';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('sv_token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const savedToken = localStorage.getItem('sv_token');
            if (savedToken) {
                try {
                    const res = await authAPI.getMe();
                    setUser(res.data.user);
                    setToken(savedToken);
                } catch {
                    localStorage.removeItem('sv_token');
                    localStorage.removeItem('sv_user');
                    setToken(null);
                    setUser(null);
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const res = await authAPI.login(email, password);
        const { token: newToken, user: newUser } = res.data;
        localStorage.setItem('sv_token', newToken);
        localStorage.setItem('sv_user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem('sv_token');
        localStorage.removeItem('sv_user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout, isAdmin: user?.role === 'admin' }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
