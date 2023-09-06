import { createAction, props } from '@ngrx/store';
import { Entity } from '../../models/entity';

const ACTIONS_PREFIX = '[Available Entities]';

export const UpdateAvailableEntities = createAction(
    `${ACTIONS_PREFIX} Update`,
    props<{ payload: Entity[] }>(),
);

export const UpdateAvailableEntitiesSuccess = createAction(
    `${ACTIONS_PREFIX} Update Success`,
    props<{ payload: Entity[] }>(),
);

export const UpdateAvailableEntitiesFailure = createAction(
    `${ACTIONS_PREFIX} Update Failure`,
    props<{ errorMessage: string }>(),
);

export const InitEntities = createAction(`${ACTIONS_PREFIX} Init`);

export const GetEntitiesData = createAction(
    `${ACTIONS_PREFIX} Get`,
    props<{ token: string }>(),
);
