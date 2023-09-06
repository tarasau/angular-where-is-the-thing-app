import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user';

const ACTIONS_PREFIX = '[Auth]';

export const LogIn = createAction(
    `${ACTIONS_PREFIX} Login`,
    props<{ payload: User }>(),
);

export const LogInSuccess = createAction(
    `${ACTIONS_PREFIX} Login Success`,
    props<{ token: string; email: string }>(),
);

export const LogInFailure = createAction(
    `${ACTIONS_PREFIX} Login Failure`,
    props<{ errorMessage: string }>(),
);

export const SignUp = createAction(
    `${ACTIONS_PREFIX} Sign Up`,
    props<{ payload: any }>(),
);

export const SignUpSuccess = createAction(
    `${ACTIONS_PREFIX} Sign Up Success`,
    props<{ token: string; email: string }>(),
);

export const SignUpFailure = createAction(
    `${ACTIONS_PREFIX} Sign Up Failure`,
    props<{ errorMessage: string }>(),
);

export const LogOut = createAction(`${ACTIONS_PREFIX} Log Out`);

export const InitAuth = createAction(`${ACTIONS_PREFIX} Init`);

export const GetUserData = createAction(
    `${ACTIONS_PREFIX} Get User Data`,
    props<{ token: string }>(),
);
