import { types, AuthActionTypes, AuthState, LoginAction } from "./types/types";

const initialState: AuthState = {
  logged: false,
};

export const authReducer = (
  state = initialState,
  action: AuthActionTypes
): AuthState => {
  switch (action.type) {
    case types.login:
      return {
        ...state,
        logged: true,
        user: (action as LoginAction).payload,
      };
    case types.logout:
      return {
        logged: false,
      };
    default:
      return state;
  }
};
