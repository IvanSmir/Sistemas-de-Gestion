export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  logged: boolean;
  user: User | null;
}

export const types = {
  login: "LOGIN",
  logout: "LOGOUT",
} as const;

export interface LoginAction {
  type: typeof types.login;
  payload: User;
}

interface LogoutAction {
  type: typeof types.logout;
}

export type AuthActionTypes = LoginAction | LogoutAction;
