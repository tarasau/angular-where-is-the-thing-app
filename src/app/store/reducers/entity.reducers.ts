import { createReducer, on } from '@ngrx/store';
import { Entity } from '../../models/entity';
import * as EntityActions from '../actions/entity.actions';

export interface EntityState {
    availableItems: Entity[];
    errorMessage: string;
}

export const initialState: EntityState = {
    availableItems: [],
    errorMessage: null,
};

export const EntityReducer = createReducer(
    initialState,
    on(EntityActions.UpdateAvailableEntitiesSuccess, (state, { payload }) => ({
        ...state,
        ...payload,
    })),
    on(
        EntityActions.UpdateAvailableEntitiesFailure,
        (state, { errorMessage }) => ({
            ...state,
            errorMessage: 'Update Available Entities Failed',
        }),
    ),
);
