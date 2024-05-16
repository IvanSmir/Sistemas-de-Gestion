export const types = {
  login: "[Auth] Login",
  logout: "[Auth] Logout",
};

export interface User {
  id: string;
  fullName: string;
  userName: string;
  token: string;
}

export interface LoginAction {
  type: typeof types.login;
  payload: User;
}

export interface LogoutAction {
  type: typeof types.logout;
}

export type AuthActionTypes = LoginAction | LogoutAction;

export interface AuthState {
  logged: boolean;
  user?: User;
}
