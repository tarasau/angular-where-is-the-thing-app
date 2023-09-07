import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AppState, selectAuthState } from '../../store/app.states';
import { AuthState } from '../../store/reducers/auth.reducers';
import { User } from '../../models/user';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
    getAuthState: Observable<AuthState>;
    isAuthenticated: boolean;
    errorMessage: string;
    user: User = null;
    subscriptions: Subscription = new Subscription();

    constructor(private store: Store<AppState>) {
        this.getAuthState = this.store.select(selectAuthState);
    }

    ngOnInit() {
        this.subscriptions.add(
            this.getAuthState.subscribe((state) => {
                this.isAuthenticated = state.isAuthenticated;
                this.user = state.user;
                this.errorMessage = state.errorMessage;
            }),
        );
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
