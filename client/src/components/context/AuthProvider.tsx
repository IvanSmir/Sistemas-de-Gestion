'use client';
import React, { useReducer, FC, ReactNode, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { authReducer } from './authReducer';
import { types, AuthState, AuthActionTypes, User } from './types/types';

const init = (): AuthState => {
    if (typeof window !== 'undefined') {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        return {
            logged: !!user,
            user: user,
        };
    }
    return {
        logged: false,
    };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authState, dispatch] = useReducer(authReducer, {}, init);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            if (user) {
                dispatch({
                    type: types.login,
                    payload: user,
                });
            }
        }
    }, []);

    const login = (user: User) => {
        const action: AuthActionTypes = {
            type: types.login,
            payload: user,
        };
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));
        }
        dispatch(action);
    };

    const logout = () => {
        const action: AuthActionTypes = {
            type: types.logout,
        };
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
        }
        dispatch(action);
    };

    return (
        <AuthContext.Provider value={{ ...authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
