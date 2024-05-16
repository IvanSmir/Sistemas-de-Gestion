// auth/AuthProvider.tsx

'use client';
import React, { useState, useEffect, useCallback, useContext, createContext, ReactNode, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { User } from './types/types';

interface AuthContextType {
    user?: User | null;
    isLoading: boolean;
    error?: Error | null;
    login: (user: User) => void;
    logout: () => void;
    checkSession: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType>({
    isLoading: true,
    login: () => { },
    logout: () => { },
    checkSession: async () => { }
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();

    const checkSession = useCallback(async () => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                setUser(null);
                router.push('/auth/login');
            }
        } catch (err) {
            setError(err as Error);
            setUser(null);
            router.push('/auth/login');
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    const login = useCallback((user: User) => {
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        router.push('/dashboard');
    }, [router]);

    const logout = useCallback(() => {
        localStorage.removeItem('user');
        setUser(null);
        router.push('/auth/login');
    }, [router]);

    const value = useMemo(() => ({
        user,
        isLoading,
        error,
        login,
        logout,
        checkSession
    }), [user, isLoading, error, login, logout, checkSession]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
