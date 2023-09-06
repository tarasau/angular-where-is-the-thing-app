import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as EntityActions from '../actions/entity.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { EntityService } from '../../services/entity.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class EntityEffects {
    updateAvailableEntities$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EntityActions.UpdateAvailableEntities),
            map((action) => action.payload),
            switchMap((payload) => {
                return this.entityService.addEntity(payload).pipe(
                    map((availableItems) => {
                        return EntityActions.UpdateAvailableEntitiesSuccess({
                            payload: availableItems,
                        });
                    }),
                    tap((action) =>
                        localStorage.setItem(
                            'availableItems',
                            JSON.stringify(action.payload),
                        ),
                    ),
                    tap(() => this.router.navigateByUrl('/entities')),
                    catchError((errorMessage) => {
                        return of(
                            EntityActions.UpdateAvailableEntitiesFailure({
                                errorMessage,
                            }),
                        );
                    }),
                );
            }),
        ),
    );

    extractEntitiesData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EntityActions.InitEntities),
            map(() => {
                const availableItems = localStorage.getItem('availableItems');
                if (!availableItems) {
                    const token = localStorage.getItem('token');
                    return EntityActions.GetEntitiesData({ token });
                }
                return EntityActions.UpdateAvailableEntitiesSuccess({
                    payload: JSON.parse(availableItems),
                });
            }),
        ),
    );

    getEntitiesData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EntityActions.GetEntitiesData),
            map((action) => action.token),
            switchMap((payload) => {
                return this.entityService.getEntities(payload).pipe(
                    map((availableItems) => {
                        return EntityActions.UpdateAvailableEntitiesSuccess({
                            payload: availableItems,
                        });
                    }),
                    catchError((errorMessage) => {
                        return of(
                            EntityActions.UpdateAvailableEntitiesFailure({
                                errorMessage,
                            }),
                        );
                    }),
                );
            }),
        ),
    );

    constructor(
        private actions$: Actions,
        private entityService: EntityService,
        private router: Router,
    ) {}
}
