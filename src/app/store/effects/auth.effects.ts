import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from '../actions/auth.actions';
import { User } from '../../models/user';

@Injectable()
export class AuthEffects {
    logIn$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.LogIn),
            map((action) => action.payload),
            switchMap((payload) => {
                return this.authService
                    .logIn(payload.email, payload.password)
                    .pipe(
                        map((user) => {
                            return AuthActions.LogInSuccess({
                                token: user.token,
                                email: payload.email,
                            });
                        }),
                        catchError((errorMessage) => {
                            return of(
                                AuthActions.LogInFailure({ errorMessage }),
                            );
                        }),
                    );
            }),
        ),
    );

    logInSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.LogInSuccess),
                tap((user) => {
                    localStorage.setItem('token', user.token);
                    this.router.navigateByUrl('/entities');
                }),
            ),
        { dispatch: false },
    );

    logInFailure$ = createEffect(
        () => this.actions$.pipe(ofType(AuthActions.LogInFailure)),
        { dispatch: false },
    );

    signUp$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.SignUp),
            map((action) => action.payload),
            switchMap((payload) => {
                return this.authService
                    .signUp(payload.email, payload.password)
                    .pipe(
                        map((user: User) => {
                            return AuthActions.SignUpSuccess({
                                token: user.token,
                                email: payload.email,
                            });
                        }),
                        catchError((errorMessage) => {
                            return of(
                                AuthActions.SignUpFailure({ errorMessage }),
                            );
                        }),
                    );
            }),
        ),
    );

    signUpSuccess$ = createEffect(() =>
            this.actions$.pipe(
                ofType(AuthActions.SignUpSuccess),
                tap((user) => {
                    localStorage.setItem('token', user.token);
                    this.router.navigateByUrl('/entities');
                }),
            ),
        { dispatch: false },
    );

    signUpFailure$ = createEffect(() =>
        this.actions$.pipe(ofType(AuthActions.SignUpFailure)),
    );

    logOut$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.LogOut),
            tap((user) => {
                localStorage.removeItem('token');
                this.router.navigateByUrl('/');
            }),
        ),
        { dispatch: false },
    );

    extractLoginData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.InitAuth),
            map(() => {
                const token = localStorage.getItem('token');
                if (!token) {
                    return AuthActions.LogOut();
                }
                // { here check token expiration }
                return AuthActions.GetUserData({ token });
            }),
        ),
        { dispatch: false },
    );

    getUserData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.GetUserData),
            map((action) => action.token),
            switchMap((payload) => {
                return this.authService.getUser(payload).pipe(
                    map((user: User) => {
                        return AuthActions.LogInSuccess({
                            token: user.token,
                            email: user.email,
                        });
                    }),
                    catchError((errorMessage) => {
                        return of(AuthActions.LogInFailure({ errorMessage }));
                    }),
                );
            }),
        ),
    );

    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private router: Router,
    ) {}
}
