import { createReducer, on } from '@ngrx/store';
import { User } from '../../models/user';
import * as AuthActions from '../actions/auth.actions';

export interface AuthState {
    isAuthenticated: boolean;
    user: User;
    errorMessage: string;
}

export const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    errorMessage: null,
};

export const AuthReducer = createReducer(
    initialState,
    on(AuthActions.LogInSuccess, (state, { token, email }) => ({
        ...state,
        isAuthenticated: true,
        user: {
            ...new User(),
            email,
            token,
        },
        errorMessage: '',
    })),
    on(AuthActions.LogInFailure, (state, { errorMessage }) => ({
        ...state,
        errorMessage: 'Log In Failed',
    })),
    on(AuthActions.SignUpSuccess, (state, { token, email }) => ({
        ...state,
        isAuthenticated: true,
        user: {
            ...new User(),
            email,
            token,
        },
        errorMessage: '',
    })),
    on(AuthActions.SignUpFailure, (state, { errorMessage }) => ({
        ...state,
        errorMessage: 'Sign Up Failed',
    })),
    on(AuthActions.LogOut, () => ({
        ...initialState,
    })),
);
