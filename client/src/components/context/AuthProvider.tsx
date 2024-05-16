// auth/AuthProvider.tsx

'use client';
import React, { useReducer, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthContext } from './AuthContext';
import { authReducer } from './authReducer';
import { types, AuthState, AuthActionTypes, User } from './types/types';

const init = (): AuthState => {
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
    return {
        logged: !!user,
        user: user,
    };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authState, dispatch] = useReducer(authReducer, {}, init);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (user) {
            dispatch({
                type: types.login,
                payload: user,
            });
        } else if (pathname !== '/auth/login' && pathname !== '/auth/register') {
            router.push('/auth/login');
        }
    }, [pathname, router]);

    useEffect(() => {
        if (!authState.logged && pathname !== '/auth/login' && pathname !== '/auth/register') {
            router.push('/auth/login');
        } else if (authState.logged && (pathname === '/auth/login' || pathname === '/auth/register')) {
            router.push('/dashboard'); // O cualquier ruta protegida a la que quieras redirigir
        }
    }, [authState.logged, pathname, router]);

    const login = (user: User) => {
        const action: AuthActionTypes = {
            type: types.login,
            payload: user,
        };
        localStorage.setItem('user', JSON.stringify(user));
        dispatch(action);
    };

    const logout = () => {
        const action: AuthActionTypes = {
            type: types.logout,
        };
        localStorage.removeItem('user');
        dispatch(action);
        router.push('/auth/login');
    };

    console.log('AuthState:', authState); // Para depuración

    return (
        <AuthContext.Provider value={{ ...authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
