import { createContext } from 'react';
import { AuthState, User } from './types/types';

export interface AuthContextProps extends AuthState {
    login: (user: User) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);
