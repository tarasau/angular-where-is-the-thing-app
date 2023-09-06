import { createFeatureSelector } from '@ngrx/store';

import { AuthReducer, AuthState } from './reducers/auth.reducers';
import { EntityReducer, EntityState } from './reducers/entity.reducers';

export interface AppState {
    authState: AuthState;
    entityState: EntityState;
}

export const reducers = {
    auth: AuthReducer,
    entity: EntityReducer,
};

export const selectAuthState = createFeatureSelector<AuthState>('auth');
export const selectEntityState = createFeatureSelector<EntityState>('entity');
